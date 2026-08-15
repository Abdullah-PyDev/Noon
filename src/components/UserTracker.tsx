import React, { useState } from 'react';
import {
  Search,
  ArrowLeft,
  Clock,
  Briefcase,
  Truck,
  CheckCircle,
  Copy,
  Calendar,
  Layers,
  MapPin,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  PhoneCall,
  Mail,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { Order, Municipality, QATAR_MUNICIPALITIES } from '../types';

interface UserTrackerProps {
  orders: Order[];
  currentLang: 'en' | 'ar';
  onBackToStore: () => void;
  onRefresh: () => Promise<void>;
  isRefreshing?: boolean;
}

export default function UserTracker({
  orders,
  currentLang,
  onBackToStore,
  onRefresh,
  isRefreshing = false
}: UserTrackerProps) {
  const isRtl = currentLang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // If client has recently ordered in current session, pre-populate last order phone or id
  const sessionOrders = React.useMemo(() => {
    // Return all orders but sorted by most recent
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders]);

  // Track state searches
  const filteredOrders = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      // By default show all orders for general tracking or demo presentation
      return sessionOrders;
    }

    return sessionOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(query) ||
        o.customerPhone.toLowerCase().includes(query) ||
        o.customerEmail.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query)
    );
  }, [sessionOrders, searchQuery]);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getStatusDetails = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return {
          step: 0,
          color: 'text-amber-500 bg-amber-50 border-amber-200',
          lineColor: 'bg-slate-200',
          title: isRtl ? 'قيد الانتظار' : 'Order Registered',
          desc: isRtl ? 'تم تسجيل وتأكيد الطلب في طابور التجهيز بالدوحة' : 'Order securely queued in Doha queue for stock packaging',
          icon: <Clock className="h-5 w-5" />
        };
      case 'Sourced':
        return {
          step: 1,
          color: 'text-blue-500 bg-blue-50 border-blue-200',
          lineColor: 'bg-blue-400',
          title: isRtl ? 'تم التجهيز والتعبئة' : 'Sourced & Packaged',
          desc: isRtl ? 'تم فحص جودة الأجهزة وتغليفها في مستودع الريان' : 'Quality diagnostics passed and premium packaging added at Al-Rayyan hub',
          icon: <Briefcase className="h-5 w-5" />
        };
      case 'Out for Delivery':
        return {
          step: 2,
          color: 'text-purple-500 bg-purple-50 border-purple-200',
          lineColor: 'bg-purple-400',
          title: isRtl ? 'مع مندوب التوصيل' : 'Out for Delivery',
          desc: isRtl ? 'الطلب مع أحد مناديبنا السريعين في الطريق إليك' : 'Dispatched with local express agent and actively routed to your zone',
          icon: <Truck className="h-5 w-5" />
        };
      case 'Delivered':
        return {
          step: 3,
          color: 'text-emerald-500 bg-emerald-50 border-emerald-200',
          lineColor: 'bg-emerald-500',
          title: isRtl ? 'تم التوصيل بنجاح' : 'Delivered & Completed',
          desc: isRtl ? 'تم تسليم الشحنة للعميل ومراجعة فاتورة ضمان قطر' : 'Delivered safely under Qatar elite warranty. Enjoy your new setup!',
          icon: <CheckCircle className="h-5 w-5" />
        };
      case 'Cancelled':
        return {
          step: -1,
          color: 'text-red-500 bg-red-50 border-red-200',
          lineColor: 'bg-slate-200',
          title: isRtl ? 'تم إلغاء الطلب' : 'Cancelled',
          desc: isRtl ? 'تم إلغاء عملية التوصيل هذه بناء على طلب العميل أو نفاد الكمية' : 'Fulfillment voided. Refunding or re-allocating product stock.',
          icon: <AlertCircle className="h-5 w-5" />
        };
    }
  };

  const steps = [
    { key: 'Pending', label: isRtl ? 'تأكيد الطلب' : 'Pending', sub: isRtl ? 'الدوحة' : 'Doha Hub' },
    { key: 'Sourced', label: isRtl ? 'تجهيز السلعة' : 'Sourced', sub: isRtl ? 'الريان' : 'Al-Rayyan' },
    { key: 'Out for Delivery', label: isRtl ? 'مع المندوب' : 'Out for Delivery', sub: isRtl ? 'على الطريق' : 'En Route' },
    { key: 'Delivered', label: isRtl ? 'تم التوصيل' : 'Delivered', sub: isRtl ? 'مستلم' : 'Completed' }
  ];

  return (
    <div id="user-tracking-root" className={`max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in ${isRtl ? 'rtl text-right' : 'ltr text-left'}`}>
      
      {/* 1. Header Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div className="space-y-1.5">
          <button
            onClick={onBackToStore}
            className="group flex items-center gap-1.5 text-xs font-black text-[#8A1538] hover:text-[#a11b44] transition-all"
          >
            <ArrowLeft className={`h-4 w-4 transition-transform group-hover:-translate-x-1 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{isRtl ? 'العودة لواجهة المتجر الرئيسي' : 'Return to Storefront'}</span>
          </button>
          
          <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-none pt-1">
            {isRtl ? 'لوحة المتابعة وتتبع الشحنات' : 'Customer Account Panel & Live Tracking'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {isRtl 
              ? 'متابعة مباشرة عبر قنوات الربط اللوجستي لدولة قطر لجميع بلدات الدوحة والريان والوكرة ولوسيل.'
              : 'Direct localized logistics telemetry for Doha, Al-Rayyan, Al-Wakrah, and Lusail areas.'}
          </p>
        </div>

        {/* Refresh Live triggers */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRtl ? 'تحديث تلقائي للمسار' : 'Sync Live Status'}</span>
        </button>
      </div>

      {/* 2. Search Tracker Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest block">
          {isRtl ? 'ابحث عن شحنتك برقم الجوال أو رقم الفاتورة المرجعي' : 'Search by Qatar Mobile Phone or Order Reference ID'}
        </label>
        
        <div className="relative">
          <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-3.5 h-4.5 w-4.5 text-slate-400 pointer-events-none`} />
          <input
            type="text"
            placeholder={isRtl ? 'مثال: 55423189 أو QAR-ORD-...' : 'e.g. 55423189 or QAR-ORD-890214-DOH...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-sm font-semibold text-slate-900 ${isRtl ? 'pl-4 pr-12' : 'pl-12 pr-4'} py-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-[#8A1538] focus:bg-white focus:ring-1 focus:ring-[#8A1538] rounded-2xl focus:outline-none transition-all`}
          />
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 font-semibold items-center">
          <span>{isRtl ? 'الاختصارات السريعة للتجربة والتحقق:' : 'Pre-seeded Mobile Numbers to test:'}</span>
          <button onClick={() => setSearchQuery('55423189')} className="bg-[#8A1538]/5 text-[#8A1538] hover:bg-[#8A1538]/10 px-2.5 py-1 rounded-md font-mono">55423189</button>
          <button onClick={() => setSearchQuery('33890211')} className="bg-[#8A1538]/5 text-[#8A1538] hover:bg-[#8A1538]/10 px-2.5 py-1 rounded-md font-mono">33890211</button>
          <button onClick={() => setSearchQuery('77012354')} className="bg-[#8A1538]/5 text-[#8A1538] hover:bg-[#8A1538]/10 px-2.5 py-1 rounded-md font-mono">77012354</button>
        </div>
      </div>

      {/* Live Information Alert Banner */}
      <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-5 flex items-start gap-3.5">
        <div className="h-9 w-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xs font-black text-amber-900 uppercase tracking-tight">
            {isRtl ? 'حالة الطلب مباشرة ومحدثة!' : 'Real-time Live Status Active'}
          </h4>
          <p className="text-xs text-amber-700/90 leading-relaxed font-semibold mt-0.5">
            {isRtl 
              ? 'تتصل بوابة طلباتك هذه بالخادم المباشر! يمكنك متابعة وتتبع طلبيتك الحالية المحدثة من قبل المتجر والمسار اللوجستي بدقة.'
              : 'Our localized Express pipeline connects directly to our server database! Any status transitions updated manually by the vendor are instantly synchronized here.'}
          </p>
        </div>
      </div>

      {/* 3. Tracked Orders Array Display */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">
                {isRtl ? 'لم نجد أي طلبات مطابقة للبحث' : 'No Matching Orders'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                {isRtl 
                  ? 'برجاء مراجعة رقم الجوال القطري الخلوي المكون من ٨ أرقام المكتوب في الفاتورة.' 
                  : 'Please inspect the 8-digit phone number or invoice string configured during checkout.'}
              </p>
            </div>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const currentObj = getStatusDetails(order.status);
            const muni = QATAR_MUNICIPALITIES.find((m) => m.id === order.municipality);
            const formattedDate = new Date(order.createdAt).toLocaleString(isRtl ? 'ar-QA' : 'en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Order Meta Header */}
                <div className="bg-slate-50/60 p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-900 text-white font-mono font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        {isRtl ? 'مرجع الفاتورة' : 'REF'}
                      </span>
                      <span className="text-sm font-black font-mono text-slate-950">
                        {order.id}
                      </span>
                      <button
                        onClick={() => handleCopy(order.id)}
                        className="text-slate-400 hover:text-slate-800 p-1 rounded-md hover:bg-slate-200/50 transition-colors"
                        title={isRtl ? 'نسخ رمز المعرف' : 'Copy Invoice Code'}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      {copiedId === order.id && (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                          {isRtl ? 'تم النسخ!' : 'Copied!'}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium font-sans">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#8A1538]" />
                        <span>{isRtl ? muni?.nameAr : muni?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing metrics */}
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
                      {isRtl ? 'إجمالي الدفع الآمن' : 'Grand Total Paid'}
                    </span>
                    <span className="text-lg md:text-xl font-black text-[#8A1538] tracking-tight">
                      QAR {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Tracking Progress Stepper Dashboard */}
                <div className="p-6 md:p-8 border-b border-slate-100 bg-linear-to-b from-white to-slate-50/20">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                      {isRtl ? 'مؤشر الرحلة المباشرة' : 'Elite Delivery Telemetry Pipeline'}
                    </span>
                    
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-xl text-xs font-black uppercase tracking-wide ${currentObj?.color}`}>
                      {currentObj?.icon}
                      <span>{currentObj?.title}</span>
                    </span>
                  </div>

                  {/* Horizontal visual stepper lines on Desktop & Vertical on Mobile */}
                  {order.status === 'Cancelled' ? (
                    <div className="p-4 bg-red-50 text-red-700/90 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                      <span>{currentObj?.desc}</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Desktop layout */}
                      <div className="hidden md:flex items-center justify-between relative">
                        {/* Connecting background progress-track bar */}
                        <div className="absolute left-[8%] right-[8%] top-[20px] h-[3px] bg-slate-100 z-0">
                          {/* Inner flowing green/blue progression */}
                          <div
                            className={`h-full bg-[#8A1538] transition-all duration-700`}
                            style={{
                              width: `${(Math.max(0, currentObj?.step ?? 0) / (steps.length - 1)) * 100}%`
                            }}
                          ></div>
                        </div>

                        {steps.map((step, idx) => {
                          const isCompleted = idx <= (currentObj?.step ?? 0);
                          const isActive = idx === (currentObj?.step ?? 0);
                          
                          return (
                            <div key={idx} className="flex flex-col items-center text-center w-[20%] relative z-10">
                              <div
                                className={`h-11 w-11 rounded-full flex items-center justify-center border-3 transition-colors ${
                                  isActive
                                    ? 'bg-[#8A1538] text-white border-[#8A1538] shadow-md ring-4 ring-[#8A1538]/20 animate-pulse'
                                    : isCompleted
                                    ? 'bg-[#8A1538] text-white border-[#8A1538]'
                                    : 'bg-white text-slate-400 border-slate-200'
                                }`}
                              >
                                {idx === 0 && <Clock className="h-5 w-5" />}
                                {idx === 1 && <Briefcase className="h-5 w-5" />}
                                {idx === 2 && <Truck className="h-5 w-5" />}
                                {idx === 3 && <CheckCircle className="h-5 w-5" />}
                              </div>
                              <span className={`text-xs font-black mt-3 block ${isCompleted ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-medium'}`}>
                                {step.label}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                                {step.sub}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Informative Step Log details */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                        <MapPin className="h-4.5 w-4.5 text-[#8A1538] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">
                            {isRtl ? 'مستجد المندوب الحالي' : 'Active Telemetry Log'}
                          </span>
                          <p className="text-xs font-semibold text-slate-800 leading-relaxed mt-0.5">
                            {currentObj?.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer and Order items summary list */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Delivery Info */}
                  <div className="space-y-3.5 bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-[#8A1538]" />
                      <span>{isRtl ? 'معلومات التوصيل للمستلم' : 'Consignee Delivery Docket'}</span>
                    </h4>

                    <div className="text-xs font-medium space-y-2 text-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">{isRtl ? 'الاسم الكامل' : 'Recipient'}</span>
                        <span className="font-extrabold text-slate-950 text-[13px]">{order.customerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">{isRtl ? 'رقم الهاتف الخلوي' : 'Qatar Mobile Phone'}</span>
                        <span className="font-mono font-bold text-slate-900">{order.customerPhone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">{isRtl ? 'العنوان اللوجستي' : 'Address details'}</span>
                        <span className="text-[11px] leading-relaxed block">{order.deliveryAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="lg:col-span-2 space-y-3">
                    <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                      <ShoppingBag className="h-4 w-4 text-[#8A1538]" />
                      <span>{isRtl ? 'السلع المشمولة في الشحنة' : 'Items Enclosed In Shipment'}</span>
                    </h4>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-slate-50/30 hover:bg-slate-50/80 border border-slate-100 rounded-xl transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="h-6 w-6 bg-slate-900 text-white rounded-md flex items-center justify-center font-mono font-bold text-xs">
                              {item.quantity}x
                            </span>
                            <div>
                              <h5 className="text-xs font-extrabold text-slate-950">
                                {isRtl ? item.nameAr : item.name}
                              </h5>
                              <span className="text-[10px] text-slate-400 font-medium">
                                QAR {item.price.toLocaleString()} {isRtl ? 'للوحدة' : 'per unit'}
                              </span>
                            </div>
                          </div>

                          <span className="text-xs font-black text-[#8A1538]">
                            QAR {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Short financial aggregate breakdown inside the customer view */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-medium space-y-1 font-mono text-slate-600">
                      <div className="flex justify-between">
                        <span>{isRtl ? 'المجموع الفرعي' : 'Cart Subtotal'}:</span>
                        <span>QAR {order.subtotal.toLocaleString()}</span>
                      </div>
                      {order.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>{isRtl ? 'قسيمة خصم' : 'Discount Applied'} ({order.discountCode}):</span>
                          <span>-QAR {order.discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>{isRtl ? 'رسوم البلدية' : 'Local Area Shipping'}:</span>
                        <span>QAR {order.deliveryFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-1 text-slate-950 font-sans font-black text-[13px]">
                        <span>{isRtl ? 'الإجمالي المدفوع الموثق' : 'Grand Authorized Total'}:</span>
                        <span>QAR {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
