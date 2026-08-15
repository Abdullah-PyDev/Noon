/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  ShieldCheck, 
  CheckCircle, 
  CreditCard, 
  Smartphone, 
  Fingerprint, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  X, 
  Info,
  Server,
  QrCode
} from 'lucide-react';

interface SecurePaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotal: number;
  paymentMethod: 'card' | 'qpay' | 'applepay' | 'gpay';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  currentLang: 'en' | 'ar';
  onPaymentSuccess: (transactionId: string) => void;
}

type Step = 'form' | 'biometric' | 'processing' | 'otp' | 'success';

export default function SecurePaymentGateway({
  isOpen,
  onClose,
  orderTotal,
  paymentMethod,
  customerName,
  customerPhone,
  customerEmail,
  currentLang,
  onPaymentSuccess
}: SecurePaymentGatewayProps) {
  const isRtl = currentLang === 'ar';
  
  // Local states
  const [step, setStep] = useState<Step>('form');
  const [paymentGatewayProvider, setPaymentGatewayProvider] = useState<'qnb' | 'cbq' | 'stripe'>('qnb');
  
  // Card credentials state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(customerName.toUpperCase());
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardErrors, setCardErrors] = useState<{ [key: string]: string }>({});

  // Apple/Google Pay biometric states
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricProgress, setBiometricProgress] = useState(0);

  // OTP Validation states
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(true);
  const [otpTimer, setOtpTimer] = useState(59);

  // General processing logs
  const [processLogs, setProcessLogs] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(0);

  // Auto pre-fill for comfort
  useEffect(() => {
    if (customerName) {
      setCardHolder(customerName.toUpperCase());
    }
  }, [customerName]);

  // Handle countdown Timer
  useEffect(() => {
    let interval: any;
    if (step === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  // Card details auto detection prefix
  const getCardBrand = (num: string) => {
    const raw = num.replace(/\D/g, '');
    if (raw.startsWith('4')) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(raw)) return 'mastercard';
    if (/^(34|37)/.test(raw)) return 'amex';
    return 'generic';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.substring(0, 16);
    // Format to 4-space groups
    const parts = [];
    for (let i = 0; i < val.length; i += 4) {
      parts.push(val.substring(i, i + 4));
    }
    setCardNumber(parts.join(' '));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.substring(0, 4);
    if (val.length > 2) {
      setExpiry(`${val.substring(0, 2)}/${val.substring(2)}`);
    } else {
      setExpiry(val);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 4) setCvv(val);
  };

  // Validations
  const validateCardForm = () => {
    const errs: { [key: string]: string } = {};
    const rawNumber = cardNumber.replace(/\s+/g, '');
    
    if (rawNumber.length < 16) {
      errs.number = isRtl ? 'رقم بطاقة غير مكتمل الـ ١٦ رقماً' : 'Incomplete 16-digit card number';
    }
    if (!cardHolder.trim()) {
      errs.holder = isRtl ? 'اسم حامل البطاقة مطلوب' : 'Cardholder name is required';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      errs.expiry = isRtl ? 'صيغة تاريخ غير صالحة (MM/YY)' : 'Invalid expiry format (MM/YY)';
    } else {
      // Validate future expiration
      const [m, y] = expiry.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      if (y < currentYear || (y === currentYear && m < currentMonth)) {
        errs.expiry = isRtl ? 'البطاقة منتهية الصلاحية' : 'Card has already expired';
      }
    }

    if (cvv.length < 3) {
      errs.cvv = isRtl ? 'رمز التحقق (CVV) غير صالح' : 'Invalid CVV code';
    }

    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Triggering visual processing checklist logs
  const startProcessingLogs = (nextStep: Step) => {
    setStep('processing');
    const logs = isRtl ? [
      'جاري تهيئة قناة مشفّرة آمنة...',
      'التحقق من توفر المخزون في الدوائر اللوجستية...',
      'فحص بروتوكول مكافحة الاحتيال والجرائم المالية...',
      'إجراء المصادقة ثلاثية الأبعاد 3-D Secure مع البنك المصدر...',
      'جاري الاتصال بنظام المقاصة بالريال القطري Q-Clearing...'
    ] : [
      'Establishing end-to-end encrypted tunnels...',
      'Booking verified items inside inventory vaults...',
      'Running machine-learning anti-fraud shield scoring...',
      'Consulting issuer bank with secure token hands...',
      'Contacting Qatar Riyal clearing networks...'
    ];
    setProcessLogs([]);
    setLogIndex(0);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < logs.length) {
        setProcessLogs((prev) => [...prev, logs[idx]]);
        idx++;
        setLogIndex(idx);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setStep(nextStep);
        }, 800);
      }
    }, 900);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCardForm()) return;
    startProcessingLogs('otp');
  };

  const handleBiometricPress = () => {
    if (biometricScanning) return;
    setBiometricScanning(true);
    setBiometricProgress(0);

    const interval = setInterval(() => {
      setBiometricProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setBiometricScanning(false);
            startProcessingLogs('success');
          }, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleOtpVerify = () => {
    if (otpCode === '123456') {
      setStep('success');
    } else {
      setOtpError(isRtl ? 'الرمز غير صحيح! الرجاء إدخال 123456 للتجربة' : 'Incorrect verification code. Hint: entered code must be 123456');
    }
  };

  const handleSuccessDone = () => {
    const txId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    onPaymentSuccess(txId);
  };

  // Custom pre-fills
  const applyTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/29');
    setCvv('123');
    setCardErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" onClick={onClose} />

      {/* Gateway Card Dialog body */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col font-sans">
        
        {/* Top bar with branding */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#8A1538]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest leading-none">
                {isRtl ? 'بوابة الدفع الآمنة' : 'Secure Electronic Gateway'}
              </span>
              <span className="text-xs font-bold text-white tracking-wide">
                Qatar Digits Shield
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-550 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Amount bar & details */}
        <div className="bg-[#8A1538]/10 px-6 py-3 border-b border-[#8A1538]/20 flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            {isRtl ? 'القيمة الإجمالية المصادق عليها' : 'Authorized Grand Total'}
          </span>
          <span className="text-sm font-bold text-[#f59e0b] font-mono">
            QAR {orderTotal.toLocaleString()}
          </span>
        </div>

        {/* Core Gateway views */}
        <div className="p-6 flex-1 max-h-[80vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            
            {/* View 1: Card form / checkout choices */}
            {step === 'form' && paymentMethod === 'card' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between bg-zinc-950/50 p-3 rounded-2xl border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-zinc-500" />
                    <span className="text-xs text-zinc-400 font-medium">Gateway Service:</span>
                  </div>
                  <div className="flex gap-1.5">
                    {['qnb', 'cbq', 'stripe'].map((prov) => (
                      <button
                        key={prov}
                        onClick={() => setPaymentGatewayProvider(prov as any)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all ${
                          paymentGatewayProvider === prov
                            ? 'bg-[#8A1538] text-white'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {prov}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated credit card face */}
                <div className="relative bg-gradient-to-br from-zinc-850 via-[#8A1538]/40 to-zinc-800 rounded-2xl p-5 border border-zinc-700/60 shadow-lg overflow-hidden h-44 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-700/50 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-zinc-300" />
                    </div>
                    {/* Brand Badge */}
                    <div className="h-6 flex items-center uppercase font-bold text-xs tracking-widest font-mono text-zinc-400">
                      {getCardBrand(cardNumber) === 'visa' && <span className="text-blue-400 font-serif font-extrabold italic text-base">VISA</span>}
                      {getCardBrand(cardNumber) === 'mastercard' && <span className="text-orange-400 text-base">MasterCard</span>}
                      {getCardBrand(cardNumber) === 'amex' && <span className="text-emerald-400 text-base">AMEX</span>}
                      {getCardBrand(cardNumber) === 'generic' && <span>QPay Shield</span>}
                    </div>
                  </div>

                  {/* Number row */}
                  <div className="text-sm md:text-base font-mono tracking-[0.2em] font-medium text-white/90 my-2">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  {/* Holder and exp */}
                  <div className="flex justify-between items-end font-mono text-[10px] text-zinc-400">
                    <div>
                      <div className="text-[8px] uppercase tracking-wider text-zinc-500 mb-0.5">Cardholder</div>
                      <div className="uppercase font-semibold tracking-wide text-white truncate max-w-[200px]">
                        {cardHolder || 'FULL NAME'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[8px] uppercase tracking-wider text-zinc-500 mb-0.5">Expires</div>
                      <div className="font-semibold text-white">
                        {expiry || 'MM/YY'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing inputs */}
                <form onSubmit={handleCardSubmit} className="space-y-4">
                  {/* Card Number */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex justify-between items-baseline">
                      <span>{isRtl ? 'رقم بطاقة الائتمان' : 'Credit Card Number'}</span>
                      <button 
                        type="button" 
                        onClick={applyTestCard}
                        className="text-[#f59e0b] hover:underline normal-case text-[9px] font-bold"
                      >
                        ⚡ {isRtl ? 'ملء بيانات التجربة' : 'Use Test Card Demo'}
                      </button>
                    </label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className={`w-full bg-zinc-950 border text-sm px-4 py-2.5 rounded-xl font-mono text-white placeholder-zinc-700 focus:outline-none ${
                        cardErrors.number ? 'border-red-500' : 'border-zinc-800 focus:border-zinc-500'
                      }`}
                    />
                    {cardErrors.number && <p className="text-[10px] text-red-500 font-mono font-medium">{cardErrors.number}</p>}
                  </div>

                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{isRtl ? 'الاسم المدون على البطاقة' : 'Cardholder Name'}</label>
                    <input
                      type="text"
                      placeholder="SALMAN AL-THANI"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      className={`w-full bg-zinc-950 border text-sm px-4 py-2.5 rounded-xl font-mono text-white placeholder-zinc-700 focus:outline-none ${
                        cardErrors.holder ? 'border-red-500' : 'border-zinc-800 focus:border-zinc-500'
                      }`}
                    />
                    {cardErrors.holder && <p className="text-[10px] text-red-500 font-mono font-medium">{cardErrors.holder}</p>}
                  </div>

                  {/* Double Row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Expiry */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={handleExpiryChange}
                        className={`w-full bg-zinc-950 border text-sm px-4 py-2.5 rounded-xl font-mono text-white placeholder-zinc-700 focus:outline-none ${
                          cardErrors.expiry ? 'border-red-500' : 'border-zinc-800 focus:border-zinc-500'
                        }`}
                      />
                      {cardErrors.expiry && <p className="text-[10px] text-red-500 font-mono font-medium">{cardErrors.expiry}</p>}
                    </div>

                    {/* CVV */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">CVV / CVC</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cvv}
                        onChange={handleCvvChange}
                        className={`w-full bg-zinc-950 border text-sm px-4 py-2.5 rounded-xl font-mono text-white placeholder-zinc-700 focus:outline-none ${
                          cardErrors.cvv ? 'border-red-500' : 'border-zinc-800 focus:border-zinc-500'
                        }`}
                      />
                      {cardErrors.cvv && <p className="text-[10px] text-red-500 font-mono font-medium">{cardErrors.cvv}</p>}
                    </div>
                  </div>

                  {/* Helper secure text info */}
                  <div className="bg-zinc-950/20 p-3 rounded-xl border border-zinc-800/60 flex items-start gap-2.5 text-[10px] text-zinc-400 leading-normal">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 text-left mt-0.5" />
                    <div>
                      {isRtl ? (
                        <span>بياناتك الائتمانية مشفرة وخاضعة لبروتوكول PCI-DSS رتبة ١ للتجارة الإلكترونية في الشرق الأوسط.</span>
                      ) : (
                        <span>Encrypted and processed under PCI-DSS Level 1 compliance directly routed within local bank nodes. No credentials stored.</span>
                      )}
                    </div>
                  </div>

                  {/* Submit pay */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-zinc-100 hover:bg-[#8A1538] text-zinc-950 hover:text-white rounded-xl text-xs font-mono uppercase tracking-widest font-bold transition-all border border-zinc-100 hover:border-[#8A1538] flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    <span>{isRtl ? 'مصادقة الدفع الآمن للبطاقة' : 'Authenticate Security Pay'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* View 2: Biometric verification (Apple Pay / Google Pay) */}
            {step === 'form' && (paymentMethod === 'applepay' || paymentMethod === 'gpay') && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col items-center justify-center py-6 text-center space-y-6"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border font-display font-black shadow-lg ${
                  paymentMethod === 'applepay' 
                    ? 'bg-white text-zinc-950 border-zinc-200' 
                    : 'bg-zinc-950 text-white border-zinc-800'
                }`}>
                  {paymentMethod === 'applepay' ? (
                    <span className="text-xl">Pay</span>
                  ) : (
                    <span className="text-sm font-mono tracking-wide font-extrabold">G Pay</span>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {paymentMethod === 'applepay' ? 'Secure Apple Pay Engine' : 'Secure Google Pay Hub'}
                  </h3>
                  <p className="text-xs text-zinc-450 max-w-sm leading-relaxed mx-auto">
                    {isRtl 
                      ? 'قم بمصادقة السلة عن طريق تأكيد الهوية البيومترية الملحقة في جهازك الذكي.'
                      : 'Authorize and execute smart payment with integrated multi-biometric check protocol.'
                    }
                  </p>
                </div>

                {/* Interactive Dynamic scanner */}
                <div className="relative flex flex-col items-center p-6 bg-zinc-950/40 rounded-2xl border border-zinc-805/85 min-w-[280px]">
                  <motion.button
                    type="button"
                    onClick={handleBiometricPress}
                    animate={{
                      scale: biometricScanning ? [1, 0.96, 1.04, 1] : 1,
                    }}
                    transition={{ repeat: biometricScanning ? Infinity : 0, duration: 1.2 }}
                    className={`w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all border ${
                      biometricScanning 
                        ? 'bg-[#8A1538]/20 border-[#8A1538] text-[#8A1538]' 
                        : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    <Fingerprint className="h-10 w-10" />
                  </motion.button>

                  <div className="mt-4 space-y-2 w-full">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                      {biometricScanning 
                        ? (isRtl ? 'جاري الفحص المجهري للهوية...' : 'Scanning Biosignature...')
                        : (isRtl ? 'انقر مع الاستمرار للمصادقة' : 'Press and Hold to Verify')
                      }
                    </div>

                    {biometricScanning && (
                      <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden mt-1 max-w-[200px] mx-auto">
                        <div 
                          className="bg-[#8A1538] h-1 rounded-full transition-all duration-100"
                          style={{ width: `${biometricProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Pre-fill simulation variables info */}
                <div className="bg-zinc-950/20 px-4 py-3 rounded-xl border border-zinc-800 flex items-center gap-3 text-[10px] font-mono text-zinc-400">
                  <UnlockSimulationBadge isRtl={isRtl} />
                </div>
              </motion.div>
            )}

            {/* View 3: QPay QR code simulation */}
            {step === 'form' && paymentMethod === 'qpay' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col items-center justify-center p-4 text-center space-y-6"
              >
                <div className="flex items-center gap-2 bg-[#8A1538] px-3 py-1.5 rounded-lg border border-[#8A1538]/25 text-[10px] font-mono uppercase tracking-wider font-extrabold text-white">
                  <QrCode className="h-4 w-4" />
                  <span>QPay Online Merchant QR</span>
                </div>

                <div className="bg-white p-4 rounded-3xl border border-zinc-200 shadow-xl flex items-center justify-center">
                  <div className="relative p-2 bg-white">
                    {/* Fake detailed QR code */}
                    <div className="w-40 h-40 bg-zinc-900 border-4 border-zinc-900 rounded flex flex-col items-center justify-center text-white relative">
                      <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-1 p-3">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`rounded-sm ${(i * 23 + 7) % 3 === 0 || i < 4 || i === 24 || i === 20 ? 'bg-white' : 'bg-transparent'}`} 
                          />
                        ))}
                      </div>
                      <div className="relative z-10 font-bold font-mono text-xs border bg-zinc-900 px-2 py-0.5 rounded text-yellow-400 border-zinc-800 uppercase tracking-widest">QPay</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 max-w-sm">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">{isRtl ? 'امسح الرمز أو المصادقة من المحفظة' : 'Scan to Checkout Immediately'}</h4>
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      {isRtl 
                        ? 'افتح تطبيق محفظة كيوباي القطرية، وامسح رمز الاستجابة السريع للخصم التلقائي الآمن.'
                        : 'Open QPay wallet application on your phone to capture and clear this QR transaction instantly.'
                      }
                    </p>
                  </div>

                  <div className="flex p-3 bg-zinc-950/40 rounded-2xl border border-zinc-800 text-left items-start gap-2.5 text-[10px] text-zinc-400">
                    <Info className="h-4 w-4 text-[#8A1538] shrink-0 mt-0.5" />
                    <span>
                      {isRtl 
                        ? 'استخدم خيار المحاكاة المباشر بالضغط أدناه للطلب الفوري.'
                        : 'Simulate instant scanning trigger with immediate response callback validation.'
                      }
                    </span>
                  </div>

                  <button
                    onClick={() => startProcessingLogs('success')}
                    className="w-full py-3 bg-zinc-200 hover:bg-[#8A1538] text-zinc-900 hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {isRtl ? 'محاكاة تأكيد القراءة من المحفظة' : 'Simulate Direct Wallet Clearing'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* View 4: Processing State (animated logs checklist) */}
            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center space-y-6"
              >
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-2 border-[#8A1538]/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-t-2 border-t-[#8A1538] border-transparent animate-spin" />
                  <Lock className="absolute inset-0 m-auto h-5 w-5 text-[#8A1538] animate-pulse" />
                </div>

                <div className="space-y-3 w-full">
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-300 font-mono">
                    {isRtl ? 'جاري تمرير الدفعة ومعالجة الأمان' : 'Processing Digital Invoicing'}
                  </div>
                  
                  {/* Interactive checklist logs */}
                  <div className="max-w-sm mx-auto bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800 text-left space-y-2.5 font-mono text-[9px] text-zinc-500">
                    {processLogs.map((log, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {i < logIndex - 1 ? (
                          <div className="p-0.5 bg-emerald-500 rounded-full text-zinc-950">
                            <CheckCircle className="h-3 w-3 text-white fill-emerald-500" />
                          </div>
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-zinc-700 border-t-zinc-400 animate-spin" />
                        )}
                        <span className={i < logIndex - 1 ? 'text-zinc-300' : 'text-zinc-400 font-bold'}>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* View 5: 3D Secure SMS validation (OTP) */}
            {step === 'otp' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="mx-auto w-10 h-10 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{isRtl ? 'مصادقة الأمان ثلاثية الأبعاد' : '3D Secure Verification'}</h3>
                  <p className="text-[11px] text-zinc-450 leading-relaxed max-w-sm mx-auto">
                    {isRtl ? (
                      <span>لقد أرسلنا رمز التحقق المكون من ٦ أرقام برسالة نصية إلى رقم جوالك القطري المسجل: 55•• ••••. الرجاء كتابته أدناه.</span>
                    ) : (
                      <span>We sent a 6-digit authentication OTP password to your registered Qatar line (+974 55•• ••••). Enter the code to authorize transaction.</span>
                    )}
                  </p>
                </div>

                {/* Verification inputs */}
                <div className="space-y-4">
                  <div className="max-w-[240px] mx-auto space-y-1.5">
                    <div className="flex justify-between items-baseline text-[9px] uppercase tracking-wider font-mono text-zinc-500">
                      <span>Enter SMS OTP Code</span>
                      <button 
                        onClick={() => setOtpCode('123456')}
                        className="text-indigo-400 underline hover:text-white"
                      >
                        Auto-fill Code
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 123456"
                      value={otpCode}
                      onChange={(e) => {
                        setOtpError('');
                        setOtpCode(e.target.value.replace(/\D/g, ''));
                      }}
                      className="w-full text-center tracking-[0.4em] bg-zinc-950 border border-zinc-800 rounded-xl py-3 text-lg font-mono placeholder-zinc-800 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    
                    {otpError && (
                      <p className="text-[10px] text-red-500 text-center font-mono font-medium leading-relaxed">
                        {otpError}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between max-w-[240px] mx-auto text-[10px] text-zinc-500 font-mono">
                    <span>Code Sent ✓</span>
                    {otpTimer > 0 ? (
                      <span>Resend in {otpTimer}s</span>
                    ) : (
                      <button 
                        onClick={() => {
                          setOtpTimer(59);
                          setOtpError('');
                        }}
                        className="text-[#8A1538] hover:underline font-bold"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  {/* Submit code */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setStep('form')}
                      className="flex-1 py-3 border border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-400 hover:text-white rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleOtpVerify}
                      className="flex-1 py-3 bg-[#8A1538] border border-[#8A1538] text-white hover:bg-[#a21a43] rounded-xl text-xs font-mono uppercase tracking-widest font-bold transition-all cursor-pointer"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* View 6: Success state */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center space-y-6"
              >
                {/* Checkmark circle rings */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 animate-ping duration-1000" />
                  <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
                    <CheckCircle className="h-8 w-8 text-emerald-400 fill-emerald-500/10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase font-extrabold">
                    {isRtl ? 'المصادقة الأمنية مكتملة بنجاح' : 'Cleared & Secured ✓'}
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {isRtl ? 'تفويض المعاملة مقبول بنجاح' : 'Security Clearance Cleared'}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-normal max-w-sm mx-auto">
                    {isRtl 
                      ? 'البنك المصدر للبطاقة وافق على الحيازات المالية وحجز المخزون بنجاح.'
                      : 'The financial clearing network approved the charge tokens. Preparing digital receipt files now.'
                    }
                  </p>
                </div>

                {/* Receipt card specs */}
                <div className="w-full bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800 text-left font-mono space-y-2 max-w-sm mx-auto text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">PROVIDER:</span>
                    <span className="font-bold text-zinc-300 uppercase">{paymentGatewayProvider} SECUREPAY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">MERCHANT:</span>
                    <span className="font-bold text-[#8A1538]">QGADGET-ONLINE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">CUSTOMER:</span>
                    <span className="font-bold text-zinc-300 truncate max-w-[150px]">{customerName.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">CLEARANCE AMNT:</span>
                    <span className="font-bold text-[#f59e0b]">QAR {orderTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-zinc-800 pt-2 mt-1">
                    <span className="text-zinc-500">REF TRANSACTION:</span>
                    <span className="text-emerald-400 font-bold">MRES-SUCCESS-OK</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSuccessDone}
                  className="w-full max-w-sm py-3.5 bg-emerald-500 border border-emerald-500 text-zinc-950 hover:bg-emerald-400 rounded-xl text-xs font-mono uppercase tracking-widest font-black transition-all cursor-pointer"
                >
                  {isRtl ? 'إكمال عملية الحجز المضمونة' : 'Complete Secured Booking'}
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

// Sub components helper
function UnlockSimulationBadge({ isRtl }: { isRtl: boolean }) {
  return (
    <>
      <ShieldCheck className="h-4 w-4 text-[#8A1538]" />
      <span>
        {isRtl 
          ? 'المحاكاة تعتمد على المصادقة الرقمية الفورية الآمنة.'
          : 'Simulation uses live biometric tokens. Touch scan interface above to bypass.'
        }
      </span>
    </>
  );
}
