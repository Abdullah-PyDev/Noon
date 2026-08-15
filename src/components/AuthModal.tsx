import React, { useState, useEffect } from 'react';
import { Mail, Lock, User as UserIcon, Shield, X, Sparkles, Building, Loader2, Globe, Chrome } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  currentLang: 'en' | 'ar';
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, currentLang }: AuthModalProps) {
  const isRtl = currentLang === 'ar';
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      // Trust local origins and standard preview run.app subdomains
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data.user) {
        onAuthSuccess(event.data.user);
        onClose();
        setEmail('');
        setPassword('');
        setFullName('');
      } else if (event.data?.type === 'OAUTH_AUTH_FAILURE') {
        setError(event.data.error || (isRtl ? 'فشل الاتصال بحساب Google' : 'Google authentication failed'));
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [isOpen, onAuthSuccess, onClose, isRtl]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const response = await fetch(`/api/auth/google/url?redirect_uri=${encodeURIComponent(redirectUri)}`);
      if (!response.ok) {
        throw new Error('Failed to reach authentication services');
      }

      const result = await response.json();
      if (result.configured && result.url) {
        const authWindow = window.open(
          result.url,
          'google_oauth_popup',
          'width=600,height=700,status=no,resizable=yes,scrollbars=yes'
        );

        if (!authWindow) {
          setError(
            isRtl 
              ? 'يرجى السماح بالنوافذ المنبثقة لإتمام مصادقة Google' 
              : 'Please enable pop-ups for this secure portal to log in with Google.'
          );
          setLoading(false);
        }
      } else {
        // Safe fall-through simulation for development / staging sandbox
        console.info('[Google Auth Status]: Server credentials missing. Defaulting to sandbox simulation.');
        const simEmail = `${isLogin ? 'demo' : 'new'}-google-${Math.floor(100 + Math.random() * 900)}@gmail.com`;
        const simName = isRtl ? 'مستخدم تجريبي من جوجل' : 'Google Sandbox User';

        const simResponse = await fetch('/api/auth/google/simulate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: simEmail,
            fullName: simName,
            role,
          }),
        });

        if (!simResponse.ok) {
          throw new Error('Fallback authentication failed');
        }

        const simResult = await simResponse.json();
        if (simResult.user) {
          onAuthSuccess(simResult.user);
          onClose();
          setEmail('');
          setPassword('');
          setFullName('');
        }
      }
    } catch (err: any) {
      setError(err.message || 'OAuth Connection Error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const bodyPayload = isLogin 
        ? { email, password }
        : { email, password, fullName, role };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || (isRtl ? 'حدث خطأ أثناء المصادقة' : 'Authentication failed'));
      }

      if (result.user) {
        onAuthSuccess(result.user);
        onClose();
        // Clear forms
        setEmail('');
        setPassword('');
        setFullName('');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      id="auth-modal-overlay" 
      className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div 
        id="auth-modal-card" 
        className="bg-white text-zinc-900 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-zinc-200/60 grid grid-cols-1 md:grid-cols-12 min-h-[550px] relative font-sans"
      >
        {/* Close button in top right of entire card */}
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-4 p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100/80 transition-all rounded-full z-50 cursor-pointer`}
          aria-label="Close Authentication Screen"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left column: noon-style Assured Branding Side-Panel */}
        <div className="hidden md:flex md:col-span-5 bg-[#ebf4f8] p-8 flex-col justify-between items-center text-center relative overflow-hidden border-r border-zinc-200/50">
          {/* Decorative shapes to make background feel immersive and premium */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/40 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-sky-200/15 rounded-full blur-3xl"></div>
          
          <div className="my-auto space-y-8 relative z-10 py-6">
            {/* "noon assured" speed badge styled exactly like noon’s programs */}
            <div className="inline-flex justify-center items-center">
              <span className="bg-[#feee00] text-zinc-950 font-sans font-black text-[11px] px-3.5 py-1.5 rounded-full tracking-tighter uppercase inline-flex items-center gap-1 border border-yellow-300 shadow-3xs leading-none italic select-none">
                <span className="font-extrabold not-italic text-[9px] text-zinc-700">≡</span> noon <span className="text-zinc-900">assured</span>
              </span>
            </div>

            {/* Core copy */}
            <div className="space-y-3">
              <h3 className="text-base md:text-lg font-sans font-black text-zinc-900 leading-snug tracking-tight italic">
                Assured is <span className="underline decoration-[#feee00] decoration-4">Trusted</span>. Faster. Reliable.
              </h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed max-w-[210px] mx-auto font-medium">
                Assured means products are stored in our own local Qatar warehouse, facilitating faster sorting, robust inspection, and near-instant secure delivery.
              </p>
            </div>

            {/* Quick logistics UI graphics representation */}
            <div className="p-4 bg-white/90 backdrop-blur-xs rounded-xl border border-zinc-200/60 shadow-xs max-w-[190px] mx-auto space-y-2 text-left">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[8px] font-mono uppercase text-zinc-400 tracking-widest">LOCAL HUB OK</span>
              </div>
              <div className="h-1 bg-zinc-200/60 rounded"></div>
              <div className="h-1 w-4/5 bg-zinc-200/65 rounded"></div>
              <div className="pt-1.5 flex justify-between items-end leading-none">
                <span className="text-[9px] font-mono font-bold text-[#8A1538]">ACTIVE SHIPMENT</span>
                <span className="text-[7.5px] bg-[#feee00] text-zinc-950 font-black px-1 rounded-xs uppercase tracking-tighter">EXPRESS</span>
              </div>
            </div>
          </div>

          {/* Foot note */}
          <div className="text-[8px] text-zinc-400 font-mono tracking-widest uppercase relative z-10">
            DOHA PREMIUM DIGITAL HUB
          </div>
        </div>

        {/* Right column: Form Fields and Interactive Actions */}
        <div className="col-span-1 md:col-span-7 p-6 md:p-10 flex flex-col justify-between space-y-8 bg-white">
          
          <div className="space-y-6">
            {/* Header / Titles */}
            <div className="space-y-2 text-left pt-2">
              <h2 id="auth-modal-title" className="text-xl md:text-2xl font-sans font-extrabold text-[#111] tracking-tight leading-none uppercase">
                {isRtl 
                  ? (isLogin ? 'مرحباً بك مجدداً!' : 'إنشاء حساب جديد') 
                  : (isLogin ? 'Welcome back!' : 'Create New Account')}
              </h2>
              <p id="auth-modal-subtitle" className="text-xs text-zinc-500 leading-relaxed font-medium">
                {isRtl 
                  ? 'تمتع بالوصول السريع إلى طلباتك، نقاط مكافآتك وتتبع شحناتك مباشرة.'
                  : 'Get access to your Orders, Superpoints & Support Ticket'}
              </p>
            </div>

            {/* Error notifications */}
            {error && (
              <div 
                id="auth-modal-error-banner" 
                className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-[10px] font-mono font-medium flex items-center gap-2"
              >
                <div className="h-1.5 w-1.5 bg-red-650 rounded-full shrink-0"></div>
                <span>{error}</span>
              </div>
            )}

            {/* Signup Tab selection for User Roles (Vendor vs Customer) */}
            {!isLogin && (
              <div id="auth-role-tabs" className="grid grid-cols-2 gap-1 p-1 bg-zinc-100 rounded-lg max-w-xs">
                <button
                  id="role-tab-customer"
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-1.5 text-[9px] font-mono uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'customer'
                      ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50 font-bold'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <UserIcon className="h-3 w-3" />
                  <span>{isRtl ? 'عميل' : 'Customer'}</span>
                </button>
                <button
                  id="role-tab-vendor"
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`py-1.5 text-[9px] font-mono uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'vendor'
                      ? 'bg-zinc-900 text-[#feee00] shadow-xs font-bold'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <Building className="h-3 w-3" />
                  <span>{isRtl ? 'شريك تاجر' : 'Merchant'}</span>
                </button>
              </div>
            )}

            {/* Input Form Fields */}
            <form id="auth-submit-form" onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name field (SignUp only) */}
              {!isLogin && (
                <div className="relative border border-zinc-200 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 rounded-lg p-2.5 px-3 bg-zinc-50/20 transition-all">
                  <label htmlFor="auth-fullName" className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest block leading-none mb-1">
                    {isRtl ? 'الاسم الكامل للمشترك' : 'Full Name / Business Title'}
                  </label>
                  <div className="relative flex items-center gap-2">
                    <UserIcon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <input
                      id="auth-fullName"
                      type="text"
                      required
                      placeholder={isRtl ? 'مبارك محمد الخيارين' : 'e.g. Mubarak Al-Kuwari'}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs font-sans text-zinc-900 bg-transparent focus:outline-none focus:ring-0 p-0 m-0 border-0"
                    />
                  </div>
                </div>
              )}

              {/* Corporate or Personal Email Field */}
              <div className="relative border border-zinc-200 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 rounded-lg p-2.5 px-3 bg-zinc-50/20 transition-all">
                <label htmlFor="auth-email" className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest block leading-none mb-1">
                  {isRtl ? 'البريد الإلكتروني المعتمد' : 'Corporate or Personal Email'}
                </label>
                <div className="relative flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    placeholder={isRtl ? 'example@domain.qa' : 'e.g. name@domain.qa'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs font-sans text-zinc-900 bg-transparent focus:outline-none focus:ring-0 p-0 m-0 border-0"
                  />
                </div>
              </div>

              {/* Encrypted Password Input with Inline Simulated Forgot link */}
              <div className="relative border border-zinc-200 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 rounded-lg p-2.5 px-3 bg-zinc-50/20 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="auth-password" className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest block leading-none">
                    {isRtl ? 'كلمة المرور' : 'Encrypted Password'}
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setShowForgotNotice(!showForgotNotice)}
                      className="text-[8px] text-[#8A1538] hover:underline font-mono uppercase tracking-wider cursor-pointer"
                    >
                      {isRtl ? 'نسيت كلمة المرور؟' : 'Forgot?'}
                    </button>
                  )}
                </div>
                <div className="relative flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <input
                    id="auth-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (showForgotNotice) setShowForgotNotice(false);
                    }}
                    className="w-full text-xs font-sans text-zinc-900 bg-transparent focus:outline-none focus:ring-0 p-0 m-0 border-0"
                  />
                </div>
              </div>

              {/* Simulated inline forgot warning banner if toggled */}
              {showForgotNotice && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-[10px] text-amber-850 font-mono leading-relaxed animate-fade-in">
                  <strong>{isRtl ? 'استرداد كلمة المرور:' : 'PASSWORD RESET CAPABILITY:'}</strong>
                  <span className="block mt-0.5 opacity-90">
                    {isRtl
                      ? 'لأغراض الحماية الآمنة، يرجى تقديم طلب استرداد مالي أو حسابي لمسؤولي الدعم الفني: support@digitalgadgets.qa.'
                      : 'Please coordinate password revisions with our security operations center: support@digitalgadgets.qa'}
                  </span>
                </div>
              )}

              {/* Info Block for Vendor Registration */}
              {!isLogin && role === 'vendor' && (
                <div className="bg-zinc-50 border border-zinc-200/60 text-[10px] text-zinc-500 p-2.5 rounded-lg leading-relaxed font-mono">
                  <strong className="text-[#8A1538] font-semibold uppercase">{isRtl ? 'تنبيه حساب تاجر:' : 'MERCHANT CLASS PRIVILEGES:'}</strong>
                  <span className="block mt-0.5 opacity-90">
                    {isRtl
                      ? 'سيمكن هذا الحساب الشركاء من تعديل المعروض، زيادة السلع ومراجعة فواتير الدفع.'
                      : 'Authorizes full-stack capabilities to manage inventory products, adjust pricing lists and view incoming order logs.'}
                  </span>
                </div>
              )}

              {/* Solid High-Contrast Submission Action conforming to noon aesthetic */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-zinc-900 hover:bg-[#8A1538] text-white rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-zinc-900 hover:border-[#8A1538] active:scale-97 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    <span>{isRtl ? 'تحقق ومصادقة...' : 'Authorizing Profile...'}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {isRtl 
                        ? (isLogin ? 'تسجيل الدخول والولوج آمن' : 'حفظ وتأكيد الحساب') 
                        : (isLogin ? 'Authenticate & Enter' : 'Submit Secured Registration')}
                    </span>
                  </>
                )}
              </button>

            </form>

            {/* Google Authentication Integrated button with custom clean icon representation */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-zinc-150"></div>
              <span className="flex-shrink mx-3 text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                {isRtl ? 'أو الدخول عبر القنوات المشفرة' : 'Or Integrated Credentials'}
              </span>
              <div className="flex-grow border-t border-zinc-150"></div>
            </div>

            <button
              id="auth-google-btn"
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-[#f8fafc] hover:bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-lg text-[10.5px] font-mono uppercase tracking-wider transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Chrome className="h-4 w-4 text-zinc-900 shrink-0" />
              <span>{isRtl ? 'متابعة عن طريق حساب Google' : 'Continue with Google'}</span>
            </button>

          </div>

          {/* Switch Action Links Area */}
          <div className="border-t border-zinc-150 pt-5 flex items-center justify-between text-xs font-sans gap-2 flex-wrap">
            <span className="text-zinc-400 font-medium">
              {isRtl 
                ? (isLogin ? 'ليس لديك حساب بعد؟' : 'لديك عضوية بالفعل؟') 
                : (isLogin ? "Don't have an account?" : 'Already registered?')}
            </span>
            <button
              id="auth-toggle-view-btn"
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setShowForgotNotice(false);
              }}
              className="text-[#8A1538] hover:text-[#a11b44] font-bold tracking-tight underline transition-all active:scale-95 text-[10px] uppercase cursor-pointer"
            >
              {isRtl 
                ? (isLogin ? 'إنشاء حساب جديد' : 'تسجيل دخول الآن') 
                : (isLogin ? 'Create Account' : 'Log in here')}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
