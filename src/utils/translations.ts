/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationDictionary {
  brandName: string;
  brandSubtitle: string;
  searchPlaceholder: string;
  allCategories: string;
  bestSellers: string;
  addToCart: string;
  addedToCart: string;
  outOfStock: string;
  lowStock: string;
  inStock: string;
  stockCount: string;
  priceQar: string;
  qarSign: string;
  languageLabel: string;
  viewAdmin: string;
  viewStore: string;
  cartTitle: string;
  cartEmpty: string;
  cartSubtotal: string;
  cartShipping: string;
  cartDiscount: string;
  cartTotal: string;
  promoCodeLabel: string;
  promoCodePlaceholder: string;
  promoApply: string;
  promoApplied: string;
  promoInvalid: string;
  shippingOption: string;
  checkoutBtn: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerAddress: string;
  paymentMethod: string;
  paymentCard: string;
  paymentCod: string;
  paymentQPay: string;
  submittingOrder: string;
  orderCompletedTitle: string;
  orderCompletedDesc: string;
  orderNo: string;
  estimateDelivery: string;
  continueShopping: string;
  all: string;
  rate: string;
  reviews: string;
  techSpecs: string;
  close: string;
  
  // Admin translations
  adminTitle: string;
  adminSubtitle: string;
  tabDashboard: string;
  tabInventory: string;
  tabOrders: string;
  tabPromos: string;
  metricRevenue: string;
  metricOrders: string;
  metricAverageOrder: string;
  metricLowStock: string;
  recentOrders: string;
  orderId: string;
  customer: string;
  date: string;
  status: string;
  action: string;
  updateStock: string;
  editProduct: string;
  deleteProduct: string;
  addNewProduct: string;
  productNameEn: string;
  productNameAr: string;
  productDescEn: string;
  productDescAr: string;
  productCategory: string;
  productPrice: string;
  productStock: string;
  productImage: string;
  productSpecsEn: string;
  productSpecsAr: string;
  save: string;
  cancel: string;
  activePromos: string;
  createPromo: string;
  promoType: string;
  promoValue: string;
  minSpend: string;
  noOrders: string;
  latestSalesTrends: string;
  stockLevelAlert: string;
}

export const TRANSLATIONS: Record<'en' | 'ar', TranslationDictionary> = {
  en: {
    brandName: 'Qatar Digital Gadgets',
    brandSubtitle: 'Premium Consumer Electronics & Custom Wearables',
    searchPlaceholder: 'Search high-performance gadgets...',
    allCategories: 'All Categories',
    bestSellers: 'Signature Tech Collection',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart ✓',
    outOfStock: 'Out of Stock',
    lowStock: 'Low Stock Alert',
    inStock: 'In Stock',
    stockCount: 'items remaining',
    priceQar: 'QAR',
    qarSign: 'ر.ق',
    languageLabel: 'العربية',
    viewAdmin: 'Merchant Workspace',
    viewStore: 'Go to Storefront',
    cartTitle: 'Your Shopping Bag',
    cartEmpty: 'Your shopping bag is empty. Explore our premium collections!',
    cartSubtotal: 'Subtotal',
    cartShipping: 'Delivery Charge',
    cartDiscount: 'Discount Code Applied',
    cartTotal: 'Grand Total',
    promoCodeLabel: 'Promo Coupon',
    promoCodePlaceholder: 'Enter promo code (e.g. DOHA10)',
    promoApply: 'Apply',
    promoApplied: 'Promo Applied ✓',
    promoInvalid: 'Invalid Coupon Code',
    shippingOption: 'Select Delivery Area in Qatar',
    checkoutBtn: 'Proceed to Secured Checkout',
    buyerName: 'Full Name',
    buyerPhone: 'Qatar Mobile Number (+974)',
    buyerEmail: 'Email Address',
    buyerAddress: 'Street / Flat / Zone Address',
    paymentMethod: 'Secured Payment Channel',
    paymentCard: 'Qatar Debit / Credit Card (QPay Gateway)',
    paymentCod: 'Cash On Delivery (COD)',
    paymentQPay: 'QPay Wallet Express',
    submittingOrder: 'Verifying Security Protocol & Securing Stock...',
    orderCompletedTitle: 'Order Confirmed!',
    orderCompletedDesc: 'Thank you for shopping. Your electronic security invoice has been issued and sent. Local distribution agents are preparing your delivery.',
    orderNo: 'Order reference number',
    estimateDelivery: 'Estimated distribution speed',
    continueShopping: 'Explore More Products',
    all: 'All Products',
    rate: 'Rating',
    reviews: 'Reviews',
    techSpecs: 'Technical Specifications',
    close: 'Close',
    
    adminTitle: 'Merchant Admin Portal',
    adminSubtitle: 'Real-time Single Vendor Inventory Command & Control Center',
    tabDashboard: 'Overview Stats',
    tabInventory: 'Stock & Pricing',
    tabOrders: 'Order Log',
    tabPromos: 'Coupons & Promos',
    metricRevenue: 'Gross Sales Revenue',
    metricOrders: 'Fulfilled Invoices',
    metricAverageOrder: 'Average Purchase Value',
    metricLowStock: 'Critical Stock Warnings',
    recentOrders: 'Live Flow Realtime Orders',
    orderId: 'Invoice ID',
    customer: 'Consignee',
    date: 'Timestamp',
    status: 'Fulfillment Status',
    action: 'Operations',
    updateStock: 'Adjust Available Inventory',
    editProduct: 'Refactor Details',
    deleteProduct: 'Remove Item',
    addNewProduct: 'Provision Brand New Gadget',
    productNameEn: 'Product Title (English)',
    productNameAr: 'Product Title (Arabic)',
    productDescEn: 'Technical Spec Sheet (English)',
    productDescAr: 'Technical Spec Sheet (Arabic)',
    productCategory: 'Product Classification',
    productPrice: 'Pricing (QAR Riyal)',
    productStock: 'Initial Reserve Stock count',
    productImage: 'Visual Asset Image URL',
    productSpecsEn: 'Bullet Highlights (English, separated with commas)',
    productSpecsAr: 'Bullet Highlights (Arabic, separated with commas)',
    save: 'Publish Configurations',
    cancel: 'Discard Changes',
    activePromos: 'Currently Active Promo Databases',
    createPromo: 'Issue New Coupon Code',
    promoType: 'Discount Class',
    promoValue: 'Discount Benefit',
    minSpend: 'Threshold spend (QAR)',
    noOrders: 'No distribution pipelines registered yet.',
    latestSalesTrends: 'Vessel Sales Analytics Trend',
    stockLevelAlert: 'Deficit Inventory Level'
  },
  ar: {
    brandName: 'قطر للإلكترونيات الرقمية',
    brandSubtitle: 'أرقى المنتجات التقنية الاستهلاكية والأجهزة المخصصة',
    searchPlaceholder: 'ابحث عن أحدث الأجهزة الرقمية والتقنية الفائقة...',
    allCategories: 'جميع الفئات',
    bestSellers: 'تشكيلة العلامة المميزة للتقنية',
    addToCart: 'أضف إلى السلة',
    addedToCart: 'تمت الإضافة للسلة ✓',
    outOfStock: 'نفد من المخزون',
    lowStock: 'تنبيه: مخزون منخفض جداً',
    inStock: 'متوفر في المخزن',
    stockCount: 'قطع متبقية فقط',
    priceQar: 'ريال قطري',
    qarSign: 'ر.ق',
    languageLabel: 'English',
    viewAdmin: 'بوابة إدارة التاجر والمخزن',
    viewStore: 'الذهاب إلى واجهة المتجر',
    cartTitle: 'حقيبة التسوق الخاصة بك',
    cartEmpty: 'حقيبة التسوق فارغة تماماً. استكشف مجموعاتنا الرائعة والممتازة!',
    cartSubtotal: 'المجموع الفرعي',
    cartShipping: 'رسوم التوصيل المحلي',
    cartDiscount: 'تم تطبيق كود الخصم',
    cartTotal: 'المجموع الإجمالي النهائي',
    promoCodeLabel: 'قسيمة خصم ترويجية',
    promoCodePlaceholder: 'أدخل رمز الكوبون (مثال: DOHA10)',
    promoApply: 'تطبيق الرمز',
    promoApplied: 'تم تفعيل الكود بنجاح ✓',
    promoInvalid: 'رمز الكوبون هذا غير صالح',
    shippingOption: 'اختر بلدية التوصيل في دولة قطر',
    checkoutBtn: 'الانتقال إلى إتمام الدفع الآمن',
    buyerName: 'الاسم الكامل للمستلم',
    buyerPhone: 'رقم الجوال القطري الخلوي (+974)',
    buyerEmail: 'عنوان البريد الإلكتروني للمستلم',
    buyerAddress: 'الشارع / رقم الشقة / المنطقة (الزون)',
    paymentMethod: 'قناة الدفع الرقمية الآمنة',
    paymentCard: 'بطاقة الخصم / الائتمان القطرية (بوابة QPay)',
    paymentCod: 'الدفع نقداً عند الاستلام (COD)',
    paymentQPay: 'محفظة كيوباي السريعة المباشرة',
    submittingOrder: 'جاري التحقق من بروتوكول الأمان وحجز المخزون...',
    orderCompletedTitle: 'تم تأكيد الطلب بنجاح!',
    orderCompletedDesc: 'شكراً لتسوقكم معنا. تم إصدار فاتورتك الرقمية المؤمنة بالكامل وتجهيزها. يقوم ممثلو المبيعات المحليون الآن بتحضير دفعتك للشحن السريع.',
    orderNo: 'رقم الفاتورة المرجعي الموحد',
    estimateDelivery: 'مدة التوصيل المحتسبة للوجهة',
    continueShopping: 'العودة لاستكشاف المزيد من التقنيات',
    all: 'جميع الأجهزة الكلية',
    rate: 'التقييم العام',
    reviews: 'المراجعات',
    techSpecs: 'المواصفات التقنية الفنية للبضاعة',
    close: 'إغلاق',
    
    adminTitle: 'بوابة التحكم والعمليات للمتجر',
    adminSubtitle: 'مركز تحكم وإدارة مخزون البائع الفردي في الوقت الفعلي لوجستياً والمجال المالي',
    tabDashboard: 'لوحة قياس المؤشرات العامة',
    tabInventory: 'التحكم باللوجستيات والأسعار',
    tabOrders: 'أرشيف وتعديل الطلبات',
    tabPromos: 'قواعد كوبونات الخصم',
    metricRevenue: 'إجمالي العوائد والمبيعات لقطر',
    metricOrders: 'الفواتير المكتملة كلياً',
    metricAverageOrder: 'متوسط قيمة العملية الشرائية',
    metricLowStock: 'إنذارات نفاد المخزون الحرجة',
    recentOrders: 'تدفق مباشر ومستجد لطلبات التوصيل',
    orderId: 'رقم الفاتورة الشرائية',
    customer: 'مرسل إليه الفاتورة',
    date: 'توقيت الطلب الزمني',
    status: 'حالة التوصيل اللوجستية',
    action: 'إجراءات تشغيل فورية',
    updateStock: 'تعديل الوحدات المتاحة للبيع',
    editProduct: 'إعادة صياغة تفاصيل المنتجات',
    deleteProduct: 'إلغاء وإسقاط السلعة من المتجر',
    addNewProduct: 'تهيئة بضاعة ذكية جديدة كلياً',
    productNameEn: 'عنوان المنتج (باللغة الإنجليزية)',
    productNameAr: 'عنوان المنتج (باللغة العربية)',
    productDescEn: 'مواصفات وتفاصيل العرض (بالإنجليزية)',
    productDescAr: 'مواصفات وتفاصيل العرض (بالعربية)',
    productCategory: 'تصنيف وتفريغ السلعة الرقمية',
    productPrice: 'سعر الوحدة بالريال القطري',
    productStock: 'مستوى مخزون البدء الاحتياطي',
    productImage: 'تحميل رابط الصورة من السيرفر',
    productSpecsEn: 'نقاط مميزات المنتج (بالإنجليزي، مفصولة بفواصل)',
    productSpecsAr: 'نقاط مميزات المنتج (بالعربي، مفصولة بفواصل)',
    save: 'نشر وتحديث الخيارات للعامة',
    cancel: 'التراجع عن التعديلات',
    activePromos: 'قاعدة بيانات كوبونات الخصم الحالية في قطر',
    createPromo: 'إصدار رمز قسيمة خصم إضافي',
    promoType: 'بنية وطبيعة التخفيض المقرونة',
    promoValue: 'قيمة وبند الخصم المتاح',
    minSpend: 'الحد الأدنى لقيمة السلة (ر.ق)',
    noOrders: 'لا توجد طلبات جارية مسجلة لوجستياً حالياً.',
    latestSalesTrends: 'تحليلات ومخططات صفقات المبيعات',
    stockLevelAlert: 'تنبيه عجز مخزون البضائع المتبقية'
  }
};
