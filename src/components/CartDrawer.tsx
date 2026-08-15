/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Ticket, CreditCard, ChevronRight, ShoppingBag, MapPin, Truck, Smartphone } from 'lucide-react';
import { CartItem, Product, Municipality, QATAR_MUNICIPALITIES, PromoCode, User } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import SecurePaymentGateway from './SecurePaymentGateway';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  promos: PromoCode[];
  currentUser?: User | null;
  onOpenAuth?: () => void;
  currentLang: 'en' | 'ar';
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onCheckoutComplete: (orderDetails: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    municipality: string;
    deliveryAddress: string;
    items: { productId: string; name: string; nameAr: string; price: number; quantity: number }[];
    subtotal: number;
    discountCode?: string;
    discountAmount: number;
    deliveryFee: number;
    total: number;
    paymentMethod: 'card' | 'cod' | 'qpay' | 'applepay' | 'gpay';
  }) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  products,
  promos,
  currentUser,
  onOpenAuth,
  currentLang,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckoutComplete,
}: CartDrawerProps) {
  const isRtl = currentLang === 'ar';
  const t = TRANSLATIONS[currentLang];

  const [promoInput, setPromoInput] = useState('');
  const [activeCode, setActiveCode] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const [selectedMuni, setSelectedMuni] = useState<Municipality>(QATAR_MUNICIPALITIES[0]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'qpay' | 'applepay' | 'gpay'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);

  // Auto-prefill billing info from active authenticated session
  React.useEffect(() => {
    if (isOpen && currentUser) {
      setCustomerName(currentUser.fullName);
      setCustomerEmail(currentUser.email);
    } else if (isOpen && !currentUser) {
      setCustomerName('');
      setCustomerEmail('');
    }
  }, [isOpen, currentUser]);

  // Form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  // Resolve cart items with current database
  const cartWithProducts = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return { item, product };
    })
    .filter((cp) => cp.product !== undefined) as { item: CartItem; product: Product }[];

  // Math totals
  const subtotal = cartWithProducts.reduce((sum, item) => sum + item.product.price * item.item.quantity, 0);

  // Calculate discount
  let discountAmount = 0;
  if (activeCode) {
    if (activeCode.minSpend && subtotal < activeCode.minSpend) {
      // Automatic removal if subtotal drops
      setActiveCode(null);
      setPromoSuccess('');
      setPromoError(`Requires at least QAR ${activeCode.minSpend}`);
    } else {
      if (activeCode.type === 'percent') {
        discountAmount = Math.round((subtotal * activeCode.value) / 100);
      } else {
        discountAmount = activeCode.value;
      }
    }
  }

  const deliveryFee = subtotal > 0 ? selectedMuni.fee : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const matched = promos.find((c) => c.code.trim().toUpperCase() === promoInput.trim().toUpperCase());
    if (!matched) {
      setPromoError(t.promoInvalid);
      return;
    }

    if (matched.minSpend && subtotal < matched.minSpend) {
      setPromoError(isRtl 
        ? `الحد الأدنى للاستخدام هو ${matched.minSpend} ر.ق` 
        : `Minimum purchase of QAR ${matched.minSpend} required`
      );
      return;
    }

    setActiveCode(matched);
    setPromoSuccess(t.promoApplied);
    setPromoInput('');
  };

  const handleMuniChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const muniId = e.target.value;
    const muni = QATAR_MUNICIPALITIES.find((m) => m.id === muniId);
    if (muni) {
      setSelectedMuni(muni);
    }
  };

  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!customerName.trim()) {
      tempErrors.name = isRtl ? 'الاسم الكامل مطلوب' : 'Full Name is required';
    }
    
    // Qatar phone verification: 8 digits, typically starting with 3, 4, 5, 6, 7
    const cleanPhone = customerPhone.replace(/\s+/g, '');
    if (!cleanPhone) {
      tempErrors.phone = isRtl ? 'رقم الجوال القطري مطلوب' : 'Qatar Mobile is required';
    } else if (!/^[34567]\d{7}$/.test(cleanPhone)) {
      tempErrors.phone = isRtl 
        ? 'يجب أن يكون رقم الجوال القطري من ٨ أرقام ويبدأ بـ (3,4,5,6,7)' 
        : 'Must be 8 digits starting with (3,4,5,6,7) for Qatar lines';
    }

    if (!customerEmail.trim()) {
      tempErrors.email = isRtl ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      tempErrors.email = isRtl ? 'البريد الإلكتروني غير صالح' : 'Invalid email pattern';
    }

    if (!deliveryAddress.trim()) {
      tempErrors.address = isRtl ? 'عنوان التوصيل أو الزون مطلوب' : 'Street/Zone designation is required';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleGatewaySuccess = (transactionId: string) => {
    setIsGatewayOpen(false);
    setIsSubmitting(true);

    onCheckoutComplete({
      customerName,
      customerPhone,
      customerEmail,
      municipality: selectedMuni.id,
      deliveryAddress,
      items: cartWithProducts.map((cp) => ({
        productId: cp.product.id,
        name: cp.product.name,
        nameAr: cp.product.nameAr,
        price: cp.product.price,
        quantity: cp.item.quantity,
      })),
      subtotal,
      discountCode: activeCode?.code,
      discountAmount,
      deliveryFee,
      total: grandTotal,
      paymentMethod,
    });

    setIsSubmitting(false);
    // Reset form variables
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setDeliveryAddress('');
    setActiveCode(null);
    setPromoSuccess('');
  };

  const handleSubmitCheckout = () => {
    if (!currentUser) {
      if (onOpenAuth) {
        onOpenAuth();
        onClose();
      }
      return;
    }
    if (!validateForm()) return;

    if (paymentMethod === 'cod') {
      setIsSubmitting(true);
      // Simulate luxurious clearance
      setTimeout(() => {
        onCheckoutComplete({
          customerName,
          customerPhone,
          customerEmail,
          municipality: selectedMuni.id,
          deliveryAddress,
          items: cartWithProducts.map((cp) => ({
            productId: cp.product.id,
            name: cp.product.name,
            nameAr: cp.product.nameAr,
            price: cp.product.price,
            quantity: cp.item.quantity,
          })),
          subtotal,
          discountCode: activeCode?.code,
          discountAmount,
          deliveryFee,
          total: grandTotal,
          paymentMethod,
        });

        setIsSubmitting(false);
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setDeliveryAddress('');
        setActiveCode(null);
        setPromoSuccess('');
      }, 1500);
    } else {
      setIsGatewayOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Dim Overlay */}
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity cursor-pointer" onClick={onClose}></div>

      {/* Cart Slider Box */}
      <div
        id="cart-slider-panel"
        className="relative z-10 w-full max-w-md bg-zinc-50 flex flex-col h-full shadow-2xl overflow-hidden border-l border-zinc-200/85"
      >
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-zinc-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#8A1538]" />
            <h2 className="text-sm font-display font-semibold uppercase tracking-tight text-zinc-950">
              {t.cartTitle}
            </h2>
            <span className="bg-zinc-100 text-zinc-900 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border border-zinc-200/60">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer border border-transparent hover:border-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {cartWithProducts.length === 0 ? (
          /* Empty Bag State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400 border border-zinc-200/60">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <p className="text-zinc-500 font-light text-xs px-6">
              {t.cartEmpty}
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-zinc-900 border border-zinc-900 text-white rounded-lg text-[10px] font-mono uppercase tracking-widest hover:bg-[#8A1538] hover:border-[#8A1538] transition-all cursor-pointer"
            >
              {isRtl ? 'ابدأ التسوق الآن' : 'Start Discovering'}
            </button>
          </div>
        ) : (
          /* Cart & Form Core */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. Item List */}
            <div className="space-y-3">
              {cartWithProducts.map(({ item, product }) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-lg border border-zinc-200/80 flex items-center gap-3"
                >
                  <img
                    src={product.image}
                    alt={isRtl ? product.nameAr : product.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover rounded-md bg-zinc-50 border border-zinc-100"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-display font-medium text-zinc-900 truncate">
                      {isRtl ? product.nameAr : product.name}
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      QAR {product.price.toLocaleString()} x {item.quantity}
                    </span>
                    
                    {/* Add/Minus Actions */}
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center bg-zinc-50 border border-zinc-200/60 rounded">
                        <button
                          onClick={() => onUpdateQuantity(product.id, item.quantity - 1)}
                          className="p-1 hover:bg-zinc-100 text-zinc-500 cursor-pointer"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="px-2 text-[10px] font-mono font-medium text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, item.quantity + 1)}
                          disabled={item.quantity >= product.stock}
                          className="p-1 hover:bg-zinc-100 text-zinc-500 disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromCart(product.id)}
                    className="p-1.5 text-zinc-300 hover:text-[#8A1538] hover:bg-zinc-50 rounded-md transition-colors self-start cursor-pointer border border-transparent hover:border-zinc-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* 2. Promo Code Application */}
            <form onSubmit={handleApplyPromo} className="bg-white p-4 rounded-lg border border-zinc-200/80 space-y-2.5">
              <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block">
                {t.promoCodeLabel}
              </label>
              <div className="flex gap-2 font-mono">
                <div className="relative flex-1">
                  <Ticket className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={t.promoCodePlaceholder}
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 bg-zinc-50/50"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 border border-zinc-900 hover:bg-[#8A1538] hover:border-[#8A1538] text-white rounded-lg text-[10px] uppercase font-mono tracking-wider transition-all cursor-pointer"
                >
                  {t.promoApply}
                </button>
              </div>
              {promoError && <p className="text-[10px] text-red-650 font-mono font-medium">{promoError}</p>}
              {promoSuccess && <p className="text-[10px] text-emerald-600 font-mono font-medium">{promoSuccess}</p>}
              {activeCode && (
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 p-2 rounded-lg text-[10px] font-mono border border-emerald-100">
                  <span>{activeCode.code} Applied! ({activeCode.type === 'percent' ? `${activeCode.value}% Off` : `QAR ${activeCode.value} Off`})</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCode(null);
                      setPromoSuccess('');
                    }}
                    className="text-emerald-700 hover:text-red-700 cursor-pointer font-bold uppercase text-[9px]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* 3. Delivery Logistics Selector */}
            <div className="bg-white p-4 rounded-lg border border-zinc-200/80 space-y-3">
              <div className="flex items-center gap-2 text-zinc-800">
                <MapPin className="h-3.5 w-3.5 text-[#8A1538]" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#8A1538] block">
                  {t.shippingOption}
                </span>
              </div>
              
              <select
                value={selectedMuni.id}
                onChange={handleMuniChange}
                className="w-full text-xs p-2.5 border border-zinc-200 rounded-lg bg-zinc-50 focus:outline-none focus:border-zinc-950 font-mono"
              >
                {QATAR_MUNICIPALITIES.map((muni) => (
                  <option key={muni.id} value={muni.id}>
                    {isRtl ? muni.nameAr : muni.name} (+QAR {muni.fee})
                  </option>
                ))}
              </select>

              <div className="flex justify-between items-center bg-zinc-50/50 p-2.5 rounded-lg border border-zinc-200/40 text-[10px] text-zinc-500 font-mono tracking-wide">
                <div className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-[#8A1538]" />
                  <span>{isRtl ? 'مدة التوصيل لبلديتك:' : 'SHIPPING DURATION:'}</span>
                </div>
                <span className="font-semibold text-zinc-800">
                  {isRtl ? selectedMuni.deliveryTimeAr : selectedMuni.deliveryTime.toUpperCase()}
                </span>
              </div>
            </div>

            {/* 4. Buyer Secure Verification Form */}
            <div className="bg-white p-4 rounded-lg border border-zinc-200/80 space-y-4">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#8A1538] block">
                {isRtl ? 'بيانات الشحن للمستلم' : 'Consignee Delivery Credentials'}
              </span>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block">{t.buyerName}</label>
                <input
                  type="text"
                  placeholder={isRtl ? 'أحمد الغامدي' : 'Salman Al-Khor'}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full text-xs p-2 py-1.5 border rounded-lg focus:outline-none font-mono ${
                    errors.name ? 'border-red-500 bg-red-50/10' : 'border-zinc-200 focus:border-zinc-950 bg-zinc-50/30'
                  }`}
                />
                {errors.name && <p className="text-[10px] text-red-500 font-mono font-medium">{errors.name}</p>}
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block">{t.buyerPhone}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pr-2 pointer-events-none text-zinc-400 text-xs font-mono border-r border-zinc-200">
                    +974
                  </div>
                  <input
                    type="tel"
                    placeholder="55123456"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className={`w-full text-xs pl-16 pr-3 py-1.5 border rounded-lg focus:outline-none font-mono ${
                      errors.phone ? 'border-red-500 bg-red-50/10' : 'border-zinc-200 focus:border-zinc-950 bg-zinc-50/30'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-red-500 font-mono font-medium">{errors.phone}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block">{t.buyerEmail}</label>
                <input
                  type="email"
                  placeholder="name@domain.qa"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className={`w-full text-xs p-2 py-1.5 border rounded-lg focus:outline-none font-mono ${
                    errors.email ? 'border-red-500 bg-red-50/10' : 'border-zinc-205 focus:border-zinc-950 bg-zinc-50/30'
                  }`}
                />
                {errors.email && <p className="text-[10px] text-red-500 font-mono font-medium">{errors.email}</p>}
              </div>

              {/* Street Delivery Address */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block">{t.buyerAddress}</label>
                <textarea
                  rows={2}
                  placeholder={isRtl ? 'شارع الكورنيش، مبنى مارينا، الطابق الرابع، شقة ١٢' : 'Al Corniche St, Marina Tower, Zone 66, Villa 4'}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className={`w-full text-xs p-2 border rounded-lg focus:outline-none resize-none font-mono ${
                    errors.address ? 'border-red-500 bg-red-50/10' : 'border-zinc-202 focus:border-zinc-950 bg-zinc-50/30'
                  }`}
                />
                {errors.address && <p className="text-[10px] text-red-500 font-mono font-medium">{errors.address}</p>}
              </div>
            </div>

            {/* 5. Secured payment channels selection */}
            <div className="bg-white p-4 rounded-lg border border-zinc-200/80 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A1538] block">
                {t.paymentMethod}
              </span>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Qatar Card options */}
                <label
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#8A1538] bg-[#8A1538]/5 font-medium text-zinc-950'
                      : 'border-zinc-200 hover:border-zinc-350 text-zinc-650'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-[#8A1538] focus:ring-[#8A1538] accent-[#8A1538]"
                    />
                    <span className="text-xs">{t.paymentCard}</span>
                  </div>
                  <CreditCard className="h-4 w-4 text-zinc-400" />
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#8A1538] bg-[#8A1538]/5 font-medium text-zinc-950'
                      : 'border-zinc-200 hover:border-zinc-350 text-zinc-650'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#8A1538] focus:ring-[#8A1538] accent-[#8A1538]"
                    />
                    <span className="text-xs">{t.paymentCod}</span>
                  </div>
                  <span className="text-[9px] bg-zinc-100 border border-zinc-200/60 px-2 py-0.5 rounded text-zinc-700 font-mono">COD</span>
                </label>

                {/* QPay Express Wallet */}
                <label
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'qpay'
                      ? 'border-[#8A1538] bg-[#8A1538]/5 font-medium text-zinc-950'
                      : 'border-zinc-200 hover:border-zinc-350 text-zinc-650'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'qpay'}
                      onChange={() => setPaymentMethod('qpay')}
                      className="text-[#8A1538] focus:ring-[#8A1538] accent-[#8A1538]"
                    />
                    <span className="text-xs">{t.paymentQPay}</span>
                  </div>
                  <span className="text-[9px] bg-[#8A1538] text-white border border-[#8A1538]/30 px-2 py-0.5 rounded font-mono uppercase tracking-wider">QPay</span>
                </label>

                {/* Apple Pay options */}
                <label
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'applepay'
                      ? 'border-[#8A1538] bg-[#8A1538]/5 font-medium text-zinc-950'
                      : 'border-zinc-200 hover:border-zinc-350 text-zinc-650'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'applepay'}
                      onChange={() => setPaymentMethod('applepay')}
                      className="text-[#8A1538] focus:ring-[#8A1538] accent-[#8A1538]"
                    />
                    <span className="text-xs"> Pay (Apple Pay)</span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-900 bg-white border px-1.5 py-0.5 rounded shadow-xs"> Pay</span>
                </label>

                {/* Google Pay options */}
                <label
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'gpay'
                      ? 'border-[#8A1538] bg-[#8A1538]/5 font-medium text-zinc-950'
                      : 'border-zinc-200 hover:border-zinc-350 text-zinc-650'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'gpay'}
                      onChange={() => setPaymentMethod('gpay')}
                      className="text-[#8A1538] focus:ring-[#8A1538] accent-[#8A1538]"
                    />
                    <span className="text-xs">Google Pay (G Pay)</span>
                  </div>
                  <span className="text-[10px] font-mono tracking-wide font-black text-white bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded shadow-xs">GPay</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Math summary summary & Submission drawer base */}
        {cartWithProducts.length > 0 && (
          <div className="bg-white px-6 py-5 border-t border-zinc-200/80 space-y-4">
            <div className="space-y-2 text-xs text-zinc-550">
              {/* Subtotal */}
              <div className="flex justify-between font-light">
                <span>{t.cartSubtotal}</span>
                <span className="font-mono text-zinc-950">QAR {subtotal.toLocaleString()}</span>
              </div>

              {/* Discount apply notification */}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium font-mono">
                  <span>{t.cartDiscount}</span>
                  <span>- QAR {discountAmount.toLocaleString()}</span>
                </div>
              )}

              {/* Delivery charges */}
              <div className="flex justify-between font-light">
                <span>{t.cartShipping} ({isRtl ? selectedMuni.nameAr : selectedMuni.name})</span>
                <span className="font-mono text-zinc-950">QAR {deliveryFee}</span>
              </div>

              {/* Grand Total */}
              <div className="pt-2.5 border-t border-dashed border-zinc-200 flex justify-between items-baseline text-zinc-950">
                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">{t.cartTotal}</span>
                <span className="text-xl font-display font-medium text-[#8A1538]">
                  QAR {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Check out lock button */}
            <button
              disabled={isSubmitting}
              onClick={handleSubmitCheckout}
              className={`w-full py-3.5 bg-zinc-900 hover:bg-[#8A1538] text-white rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all focus:outline-none flex items-center justify-center gap-2 cursor-pointer border border-zinc-900 hover:border-[#8A1538] active:scale-97`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                  <span className="text-[10px] font-mono uppercase tracking-wider">{t.submittingOrder}</span>
                </div>
              ) : !currentUser ? (
                <>
                  <span>{isRtl ? 'تسجيل الدخول / التسجيل لإتمام الشراء' : 'Login / Register to Buy Now'}</span>
                  <ChevronRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </>
              ) : (
                <>
                  <span>{t.checkoutBtn}</span>
                  <ChevronRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Interactive payment gateway overlay */}
      <SecurePaymentGateway
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        orderTotal={grandTotal}
        paymentMethod={paymentMethod as any}
        customerName={customerName}
        customerPhone={customerPhone}
        customerEmail={customerEmail}
        currentLang={currentLang}
        onPaymentSuccess={handleGatewaySuccess}
      />
    </div>
  );
}
