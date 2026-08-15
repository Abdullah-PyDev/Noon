/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  price: number; // in QAR
  image: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  specs: string[];
  specsAr: string[];
  reviews?: Review[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  municipality: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  discountCode?: string;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'card' | 'cod' | 'qpay' | 'applepay' | 'gpay';
  status: 'Pending' | 'Sourced' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface PromoCode {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minSpend?: number;
}

export interface Municipality {
  id: string;
  name: string;
  nameAr: string;
  fee: number;
  deliveryTime: string;
  deliveryTimeAr: string;
}

export const QATAR_MUNICIPALITIES: Municipality[] = [
  { id: 'doha', name: 'Doha / Ad Dawhah', nameAr: 'الدوحة', fee: 15, deliveryTime: '1-2 Hours', deliveryTimeAr: '١-٢ ساعة' },
  { id: 'lusail', name: 'Lusail / Al Daayen', nameAr: 'لوسيل / الضعاين', fee: 20, deliveryTime: 'Same Day', deliveryTimeAr: 'نفس اليوم' },
  { id: 'westbay', name: 'West Bay & Pearl-Qatar', nameAr: 'الخليج الغربي واللؤلؤة', fee: 15, deliveryTime: '1-2 Hours', deliveryTimeAr: '١-٢ ساعة' },
  { id: 'rayyan', name: 'Al Rayyan', nameAr: 'الريان', fee: 20, deliveryTime: 'Same Day', deliveryTimeAr: 'نفس اليوم' },
  { id: 'wakrah', name: 'Al Wakrah', nameAr: 'الوكرة', fee: 25, deliveryTime: 'Next Day', deliveryTimeAr: 'اليوم التالي' },
  { id: 'al_khor', name: 'Al Khor / Al Thakhira', nameAr: 'الخور / الذخيرة', fee: 35, deliveryTime: 'Next Day', deliveryTimeAr: 'اليوم التالي' },
  { id: 'al_shamal', name: 'Madinat ash Shamal', nameAr: 'الشمال', fee: 45, deliveryTime: '1-2 Days', deliveryTimeAr: '١-٢ يوم' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Futura Vision Pro VR Headset',
    nameAr: 'نظارة الواقع الافتراضي فيوتشرا فيجن برو',
    description: 'Experience standard-shattering augmented reality with dual 4K micro-OLED microdisplays, responsive eye tracking, and high-fidelity directional spatial audio.',
    descriptionAr: 'اختبر واقعاً معززاً مبهراً مع شاشات ميكرو ديسبلاي مزدوجة بدقة 4K وتتبع متقدم لحركة العين وصوت مكاني مذهل ذو دقة متناهية.',
    category: 'Wearables',
    categoryAr: 'الأجهزة القابلة للارتداء',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=800',
    stock: 8,
    rating: 4.9,
    reviewsCount: 24,
    featured: true,
    specs: ['Dual 4K Micro-OLED Displays', 'M2 + R1 Spatial Processing Silicon', 'Intuitive Eye & Voice Tracking', 'Dynamic Spatial Soundstage'],
    specsAr: ['شاشات Micro-OLED مزدوجة بدقة 4K', 'معالجات M2 + R1 الفائقة', 'تتبع ذكي لحركة العين والصوت', 'صوت مكاني ديناميكي محيطي']
  },
  {
    id: 'prod-2',
    name: 'Optima Curved OLED Tech Monitor 34"',
    nameAr: 'شاشة أوبتيما المنحنية بتقنية أوليد ٣٤ بوصة',
    description: 'Ultra-wide 240Hz OLED gaming monitor with 0.03ms response time, infinite contrast, and gorgeous HDR True Black 400 profiles.',
    descriptionAr: 'شاشة ألعاب أوليد فائقة العرض بتردد ٢٤٠ هرتز ومعدل استجابة ٠.٠٣ مللي ثانية وتباين لانهائي مع دعم كامل ومذهل لتقنية HDR.',
    category: 'Displays',
    categoryAr: 'الشاشات واللوحات',
    price: 3899,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    rating: 4.8,
    reviewsCount: 42,
    featured: true,
    specs: ['34-inch 1800R Deep Curve', 'True OLED-level Infinite Contrast', 'Sizzling 240Hz Refresh Rate', 'Lightning 0.03ms Pixel Response'],
    specsAr: ['انحناء عميق بقوة 1800R مقاس ٣٤ بوصة', 'تباين أوليد حقيقي ولانهائي', 'معدل تحديث فائق بقوة ٢٤٠ هرتز', 'سرعة استجابة فائقة بقيمة 0.03 مللي ثانية']
  },
  {
    id: 'prod-3',
    name: 'Acoustic-X ANC Over-Ear Headphones',
    nameAr: 'سماعات الرأس أكوستيك-إكس عازلة الضوضاء',
    description: 'Industry-leading Active Noise Cancellation with customized auto-isolation chips, touch sensors, and up to 40 hours of lossless audio playback.',
    descriptionAr: 'تقنية إلغاء الضوضاء النشطة الرائدة في الصناعة مع معالجة ذكية للعزل التلقائي، ومستشعرات لمس، وما يصل إلى ٤٠ ساعة من تشغيل الصوت بلا فقدان.',
    category: 'Audio',
    categoryAr: 'الصوتيات والسمعيات',
    price: 1349,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    stock: 25,
    rating: 4.7,
    reviewsCount: 88,
    featured: true,
    specs: ['Custom Level Hybrid Dual ANC', '40mm Premium Dome Driver Arrays', 'High-Res Audio LDAC Codec Support', 'Ultra-Comfort Cloud Cushions'],
    specsAr: ['نظام إلغاء ضوضاء هجين ثنائي ممتاز', 'مكبرات صوت داخلية متميزة مقاس 40 مم', 'دعم ترميز LDAC عالي الدقة للصوت', 'وسائد أذن مريحة للغاية تشبه السحاب']
  },
  {
    id: 'prod-4',
    name: 'Titan Tech Flagship Pro (512GB)',
    nameAr: 'هاتف تايتن تيك فلاغشيب برو (٥١٢ جيجابايت)',
    description: 'Impeccably detailed aerospace-grade titanium frame housing a 3nm neural engine, triple optical zooms, and a dynamic island screen layout.',
    descriptionAr: 'هيكل مذهل للغاية من التيتانيوم المخصص للمركبات الفضائية يضم محركاً عصبياً بدقة ٣ نانومتر، وثلاث كاميرات زووم بصري وشاشة ديناميكية رائعة.',
    category: 'Smartphones',
    categoryAr: 'الهواتف الذكية',
    price: 4899,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    rating: 4.9,
    reviewsCount: 104,
    featured: true,
    specs: ['Aerospace-grade Polished Titanium', '3nm Next-Gen Octa-core Processor', 'Advanced Pro triple focal zoom', 'Super Retina 120Hz Refresh Screen'],
    specsAr: ['هيكل تيتانيوم مصقول فائق المتانة', 'معالج ثماني النواة بدقة ٣ نانومتر اليوم', 'نظام تصوير احترافي زووم ثلاثي متطور', 'شاشة سوبر ريتنا بمعدل تحديث ١٢٠ هرتز']
  },
  {
    id: 'prod-5',
    name: 'Al-Anabi Mechanical Custom Keyboard',
    nameAr: 'لوحة مفاتيح العنابي الميكانيكية الفاخرة',
    description: 'Special Qatari Edition mechanical keyboard featuring custom burgundy-maroon hot-swappable switches, keycaps with Arabic-English legends, and a solid aluminum chassis.',
    descriptionAr: 'إصدار قطري خاص من لوحة المفاتيح الميكانيكية تتميز بمفاتيح حمراء داكنة قابلة للتبديل السريع، وأغطية بمفاتيح ثنائية اللغة (عربي-إنجليزي)، وهيكل متين من الألمنيوم.',
    category: 'Peripherals',
    categoryAr: 'الملحقات والأجهزة الطرفية',
    price: 749,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800',
    stock: 30,
    rating: 4.9,
    reviewsCount: 31,
    featured: true,
    specs: ['Solid CNC Milled Aluminum Frame', 'Custom Swappable Linear Maroon Switches', 'Arabic + English PBT Keycaps', 'Gasket Mounted Sound-Dampened Body'],
    specsAr: ['هيكل متين مصنوع بالكامل من الألومنيوم CNC', 'مفاتيح حمراء خطية قابلة للتبديل متطورة', 'أغطية مفاتيح PBT ثنائية اللغة عربي + إنجليزي', 'جسم مزود بحشوات كاتمة للأصوات المرتفعة']
  },
  {
    id: 'prod-6',
    name: 'Chrono-Sport Hybrid Smart Watch',
    nameAr: 'ساعة كرونو الرياضية الذكية المتطورة',
    description: 'Adventure smart watch featuring full dual-band GPS, multi-day solar battery lifespan, heart & stress bio-sensors, and water protection up to 100 meters.',
    descriptionAr: 'ساعة ذكية للمغامرات تتميز بنظام تحديد المواقع العالمي ثنائي النطاق وبطارية تعمل بالطاقة الشمسية لعدة أيام وحساسات متميزة للمؤشرات الحيوية.',
    category: 'Wearables',
    categoryAr: 'الأجهزة القابلة للارتداء',
    price: 2199,
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800',
    stock: 18,
    rating: 4.6,
    reviewsCount: 56,
    featured: false,
    specs: ['Premium Solar Charging Watch Dial', 'Ultimate Precise Multi-Band GPS', 'Heart rate / SpO2 / Sleep Sensors', 'Robust Waterproof Grade (10 ATM)'],
    specsAr: ['ميناء ساعة يشحن بالطاقة الشمسية تلقائياً', 'نظام ملاحة وتحديد مواقع فائق الدقة', 'مستشعر نبضات القلب ونسبة الأكسجين والنوم', 'مقاومة تامة وعالية للماء تصنيف 10 ATM']
  },
  {
    id: 'prod-7',
    name: 'Pro-Link Lunar Core Gaming Console',
    nameAr: 'جهاز ألعاب برولينك لونار كور المتقدم',
    description: 'Next-generation power delivery console with direct SSD architecture, pristine 4K 120fps outputs, and responsive haptic controller mechanics.',
    descriptionAr: 'جهاز ألعاب الجيل الجديد مجهز بذاكرة تخزين فائقة السرعة، ومخرجات صورة مذهلة بدقة 4K و١٢٠ إطاراً في الثانية، وتحكم تفاعلي مباشر.',
    category: 'Consoles',
    categoryAr: 'منصات الألعاب والترفيه',
    price: 2199,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=800',
    stock: 5,
    rating: 4.8,
    reviewsCount: 71,
    featured: false,
    specs: ['8-Core AMD Zen 2 CPU Cores', '12 TeraFLOPS RDNA 2 GPU Graphics', 'Custom Ultra-Fast 1TB SSD', 'True 4K Gaming up to 120 FPS'],
    specsAr: ['معالج AMD Zen 2 ثماني النواة', 'رسوميات RDNA 2 بقوة 12 تيرافلوبس', 'ذاكرة تخزين SSD فائقة السرعة ١ تيرابايت', 'دعم كامل لدقة 4K و١٢٠ إطاراً في الثانية']
  },
  {
    id: 'prod-8',
    name: 'Aether 4K Smart Ambient Projector',
    nameAr: 'جهاز إسقاط الضوئي الذكي أيثر بدقة 4K',
    description: 'Portable cylindrical high-brightness smart projector with auto-focus, automatic keystone leveling, built-in smart streaming apps, and a rotating base.',
    descriptionAr: 'جهاز عرض ذكي محمول عالي السطوع مزود بميزة التركيز التلقائي وتعديل الأبعاد الرقمي التلقائي، وتطبيقات بث مدمجة مع قاعدة متحركة ومريحة.',
    category: 'Smart Home',
    categoryAr: 'الأجهزة المنزلية الذكية',
    price: 2799,
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=800',
    stock: 9,
    rating: 4.5,
    reviewsCount: 19,
    featured: false,
    specs: ['Crisp Native 4K UHD Projection', '1500 ANSI Lumens High Contrast Brightness', 'Seamless 180-degree Rotating Base', 'Instant Auto Focus & Intelligent Keystone'],
    specsAr: ['عرض عالي الدقة والوضوح 4K UHD منبعث', 'سطوع استثنائي بقوة ١٥٠٠ لومن شمعة', 'قاعدة دوارة مريحة بزاوية ١٨٠ درجة كاملة', 'تركيز تلقائي فوري وتعديل ذكي تام للأبعاد']
  },
  {
    id: 'prod-9',
    name: 'Aura Grace Diamond-Trim Smartwatch',
    nameAr: 'ساعة أورا غريس الذكية المرصعة بالألماس',
    description: 'An elegant, bespoke smartwatch blending jewelry-grade materials with advanced health and micro-tracker suites, styled with a rose gold stainless steel mesh strap.',
    descriptionAr: 'ساعة ذكية أنيقة تجمع بين المواد الفاخرة لتتبع الصحة والمؤشرات الحيوية بشكل متطور، مصممة بحزام شبكي من الفولاذ المقاوم للصدأ والذهب الوردي الطبيعي.',
    category: 'Women\'s Collection',
    categoryAr: 'الركن النسائي',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    rating: 4.9,
    reviewsCount: 37,
    featured: true,
    specs: ['Bespoke Rose Gold Plated Alloy Frame', 'Bespoke Diamond-Cut Protective Bezel', 'Advanced Female Cycle & Bio-Tracking', 'Up to 7 Days Battery Life on Single Charge'],
    specsAr: ['هيكل مطلي بالذهب الوردي عيار ١٨ قيراط', 'إطار خارجي مرصع بالألماس الأنيق المقاوم للخدش', 'مجموعة تتبع صحي متقدم للمؤشرات الحيوية والنشاط', 'عمر بطارية يصل إلى 7 أيام بشحنة واحدة']
  },
  {
    id: 'prod-10',
    name: 'Luna Pearl Ergonomic Smart Ring',
    nameAr: 'خاتم لونا بيرل الذكي الفاخر',
    description: 'Ultra-slim lightweight ceramic smart ring designed for active women, tracking sleep stages, systemic temperature, and workout recovery metrics with micro-sensors.',
    descriptionAr: 'خاتم ذكي من السيراميك فائق النحافة والخفة مصمم للمرأة المعاصرة والنشطة لتتبع مريحة لمراحل النوم ودرجة الحرارة ونسب الإرهاق والتحسن.',
    category: 'Women\'s Collection',
    categoryAr: 'الركن النسائي',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
    stock: 20,
    rating: 4.8,
    reviewsCount: 15,
    featured: true,
    specs: ['Space-Grade White Ceramic Outer Shell', 'Medical-Grade Non-Allergic Internal Resin', 'High-Precision Temperature & Sleep Sensors', 'Waterproof for Swimming and Diving (50m)'],
    specsAr: ['هيكل خارجي من السيراميك الأبيض الفاخر', 'جزء داخلي مجهز براتينج طبي طبيعي مضاد للحساسية', 'مستشعرات دقيقة لمراقبة درجة حرارة الجسم والنوم', 'مقاوم تماماً للماء ومناسب للسباحة والغوص']
  },
  {
    id: 'prod-11',
    name: 'AeroGrace Ionic Multi-Styler & Dryer',
    nameAr: 'جهاز مصفف ومجفف الشعر الأيوني أيروغريس',
    description: 'High-airflow intelligence-engineered styling tool designed for perfect voluminous waves, smooth blowouts, and fast drying without extreme thermal damage.',
    descriptionAr: 'أداة تصفيف وتجفيف ذكية بتدفق هواء قوي ومثالي، للحصول على تموجات ديناميكية ناعمة وسريعة دون تعريض الشعر لحرارة مفرطة وضارة.',
    category: 'Women\'s Collection',
    categoryAr: 'الركن النسائي',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    rating: 4.9,
    reviewsCount: 42,
    featured: true,
    specs: ['Thermo-Control High Heat Monitor (40x/Sec)', 'Includes 4 Magnetic Intelligent Attachments', 'Advanced Negative-Ion Frizz-Free System', 'Luxury Leather Storage Case Included'],
    specsAr: ['نظام مراقبة ذكي للحرارة لمنع التلف (٤٠ مرة/ثانية)', 'يشتمل على 4 ملحقات تصفيف مغناطيسية ذكية وسهلة', 'مولد أيونات سالبة متطور للقضاء التام على النفشة', 'حقيبة صلبة فاخرة مكسوة بالجلد لحماية الجهاز وبطاناته']
  },
  {
    id: 'prod-12',
    name: 'Somnus Silk Smart Sleeping Mask',
    nameAr: 'قناع النوم الحريري الذكي سومنوس',
    description: 'Premium mulberry silk smart eye mask integrating built-in bone-conduction soothing soundscapes and a gentle sunrise simulation light.',
    descriptionAr: 'قناع ذكي فاخر للعين من حرير التوت مجهّز بسماعات توصيل عظمي خفية للموسيقى المهدئة والإيقاعات الطبيعية مع ضوء يقدم شروقاً اصطناعياً لطيفاً للاستيقاظ.',
    category: 'Women\'s Collection',
    categoryAr: 'الركن النسائي',
    price: 449,
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80&w=800',
    stock: 25,
    rating: 4.7,
    reviewsCount: 29,
    featured: false,
    specs: ['100% Premium 22-Momme Mulberry Silk', 'Ultra-Thin Bone Conduction Audio Elements', 'Chroma-Warm Dawn Simulator LEDs', 'Adjustable Contoured Nose Bridge Closure'],
    specsAr: ['مصنوع من حرير التوت الطبيعي الفاخر بنسبة ١٠٠٪', 'سماعات توصيل عظمي مدمجة نحيفة للغاية ومريحة', 'إضاءة دافئة ذكية ومريحة لمحاكاة ضوء الفجر الحالم', 'شريط مريح وقابل للتعديل لمنع تسرب أي ضوء خارجي']
  },
  {
    id: 'prod-13',
    name: 'Glow Quartz Microcurrent Facial device',
    nameAr: 'جهاز شد وتجميل الوجه غلو بالتيار الدقيق',
    description: 'Bespoke beauty essential featuring natural Madagascar rose quartz combined with mild microcurrent toning to help lift, contour, and define facial features.',
    descriptionAr: 'أداة تجميل فاخرة تجمع بين حجر الكوارتز الوردي الطبيعي والتيار الكهربائي الدقيق الخفيف لشد البشرة وتنشيط دورتها وتجميل ملامح الوجه.',
    category: 'Women\'s Collection',
    categoryAr: 'الركن النسائي',
    price: 899,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
    stock: 10,
    rating: 4.6,
    reviewsCount: 18,
    featured: false,
    specs: ['100% Genuine Natural Madagascar Rose Quartz', '5 Adjustable Microcurrent Intensity Levels', 'Smart Skin Sync App for Targeted Routines', 'Elegant Gold-Plated Wireless Charging Dock'],
    specsAr: ['كوارتز وردي طبيعي أصلي ومصقول بنسبة ١٠٠٪', 'خمسة مستويات قابلة للتعديل من قوة التيار الدقيق المريح', 'تطبيق ذكي للمزامنة وتوفير جلسات توجيهية مخصصة للجمال', 'قاعدة شحن لاسلكية ذهبية ناعمة وأنيقة لسطح الطاولة']
  },
  {
    id: 'prod-14',
    name: 'Serene Aura Smart Fragrance Dispenser',
    nameAr: 'موزع العطور الذكي سيرين أورا',
    description: 'App-controlled luxury multi-aroma room diffuser that schedule custom scent sequences using advanced waterless micro-droplet nebulizing tech.',
    descriptionAr: 'موزع عطور منزلي فاخر يتم التحكم فيه بالكامل بجدولة مخصصة، يعمل عبر تقنيات الرش والتبخير الدقيقة لنشر الزيوت العطرية بدون ماء.',
    category: 'Women\'s Collection',
    categoryAr: 'الركن النسائي',
    price: 649,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
    stock: 18,
    rating: 4.5,
    reviewsCount: 22,
    featured: false,
    specs: ['Waterless Dry-Air Nebulizer Technology', 'Independent Dual-Fragrance Chamber System', 'Companion App with Weekly Schedules & Intensity', 'Sleek Aesthetic Anodized Aluminum Enclosure'],
    specsAr: ['تقنية موزع رذاذ جاف بدون الحاجة لخلط الماء', 'نظام غرف مستقل مزدوج لتشغيل نفحتين عطرية مختلفة', 'تطبيق ذكي لتهيئة جداول العمل اليومية ومستوى القوة', 'تصميم فاخر من الألومنيوم المؤكسد الأنيق والجذاب']
  },
  {
    id: 'prod-15',
    name: 'Iris Smart Vanity Makeup Mirror',
    nameAr: 'مرآة المكياج الذكية آيريس ثلاثية الإضاءة',
    description: 'High-definition 95 CRI auto-illuminating vanity mirror with gesture-controlled LED lighting, ambient speakers, and magnifiers.',
    descriptionAr: 'مرآة ذكية للمكياج والجمال عالية الدقة ومذهلة مع إضاءة LED ذات معامل وضوح ألوان ٩5 CRI فائق، قابلة للمزامنة لاسلكياً وتدعم ميزة اللمس.',
    category: 'Women\'s Collection',
    categoryAr: 'الركن النسائي',
    price: 599,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800',
    stock: 14,
    rating: 4.8,
    reviewsCount: 31,
    featured: false,
    specs: ['Clinical-Grade Multi-Spectrum LED Aura Frame', 'Pro-Sound Bluetooth Speakers Embedded Behind', 'Interactive Motion Sensor for Wave-to-On', 'Includes Magnetic 10x Detail Mirror Attachment'],
    specsAr: ['حلقة إضاءة LED تجميلية احترافية متعددة الدرجات', 'سماعات بلوتوث ممتازة مدمجة خلف المرآة للاستمتاع', 'مستشعر حركة مدمج لتشغيل المرآة بمجرد الاقتراب والتلويح', 'تشتمل على مرآة مصغرة مكبرة ١٠ مرات للتفاصيل الدقيقة']
  },
  {
    id: 'prod-16',
    name: 'Solis Smart UV Protective Sunglasses',
    nameAr: 'نظارات شمسية ذكية واقية سوليس',
    description: 'Elegant handcrafted sunglasses protecting eyes from light while featuring UV warnings via app and direct directional audio.',
    descriptionAr: 'نظارات شمسية أنيقة وعالية الجودة مصنعة يدوياً، توفر إشعاراً بالأشعة فوق البنفسجية عبر التطبيق وسماعات صوتية موجهة مخفية بالأذرع.',
    category: 'Women\'s Collection',
    categoryAr: 'الركن النسائي',
    price: 899,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
    stock: 8,
    rating: 4.7,
    reviewsCount: 12,
    featured: false,
    specs: ['Premium Polarized CAT-3 Lenses (100% UV Protection)', 'Direct Directional Audio Temples for Music/Calls', 'Ambient Live UV Sensor Syncs with Companion App', 'Handmade Acetate Frame with Resilient Gold Hinges'],
    specsAr: ['عدسات مستقطبة ممتازة حماية تامة من الأشعة فوق البنفسجية', 'سماعات موجهة وصوت شخصي على الأذرع للمكالمات والموسيقى', 'حساس مباشر لقراءة مستويات الأشعة وإبلاغك على هاتفك', 'إطار مصنوع يدوياً من الأسيتات المتين والمقاوم للصدمات']
  },
  {
    id: 'prod-17',
    name: 'Zephyr Air-Purifying Smart Mask',
    nameAr: 'كمامة زيفير الذكية لتنقية الهواء النشط',
    description: 'High-tech comfortable face mask combining surgical-grade protection with active dual-ventilation HEPA filtration fans.',
    descriptionAr: 'كمامة متطورة توفر راحة تامة طوال اليوم تضم حماية بمستوى حاد للغاية وفلاتر HEPA نشطة للتنقية والتهوية الممتازة.',
    category: 'Wearables',
    categoryAr: 'الأجهزة القابلة للارتداء',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1584634731339-252c5bea133f?auto=format&fit=crop&q=80&w=800',
    stock: 22,
    rating: 4.5,
    reviewsCount: 16,
    featured: false,
    specs: ['Dual H13 Grade HEPA Micro-Filters Included', 'Active Automatic Ventilation (3 Fan Speed Levels)', 'Real-Time Air Quality Breathing Metrics tracking', 'Ultra-Soft Food-Grade Washable Silicone Frame'],
    specsAr: ['تشتمل على فلترين ميكرو هيبا HEPA H13 متطورة للغاية', 'نظام تهوية نشط وتلقائي هادئ بثلاث مستويات للسرعة', 'سجل فوري لمعدل جودة الهواء وصحتك التنفسية عبر التطبيق', 'تصميم وحواف من السيليكون فائق النعومة والقابل للغسيل']
  },
  {
    id: 'prod-18',
    name: 'Nirvana Bio-Feedback Stress Headband',
    nameAr: 'عصابة رأس المستشعرات الحيوية لتهدئة الإرهاق',
    description: 'Wellness smart headband translating systemic EEG brain signals into beautiful ambient nature sounds to aid deep meditation and lower tension.',
    descriptionAr: 'عصابة رأس متميزة لمؤشرات الصحة النفسية تقيس أنماط تخطيط الدماغ الكهربائي وتترجم دقاتها لمؤثرات صوتية هادئة لتخيف التوتر وتحفيز الاسترخاء.',
    category: 'Wearables',
    categoryAr: 'الأجهزة القابلة للارتداء',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    rating: 4.8,
    reviewsCount: 34,
    featured: false,
    specs: ['5 High-Fidelity EEG Gold Brainwave Sensor Points', 'Real-Time Guided Auditory Biofeedback Soundscapes', 'Helps Accelerate Relaxation Patterns by over 45%', 'Rechargeable Premium Comfort Fabric Construction'],
    specsAr: ['خمس نقاط اتصال مطلية بالذهب لمستشعرات تخطيط الدماغ', 'تغذية راجعة سمعية مباشرة متوافقة مع أنفاسك لتهيئة حالمة', 'ثبت علمياً مساهمتها بتحفيز الاسترخاء وتسكين مستويات الضيق', 'تصميم قماشي مرن ومريح لدرجات قصوى أثناء ارتدائه']
  },
  {
    id: 'prod-19',
    name: 'Velo-Sound Active Sports Earbuds',
    nameAr: 'سماعات الأذن فيلو ساوند الرياضية المتينة',
    description: 'Ultra-secure sports ear-hook buds engineered for high-intensity training with IP67 waterproofing and clear environmental transparency pass-through.',
    descriptionAr: 'سماعات ألعاب ورياضية متطورة للغاية تثبت بإحكام على الأذن تم تصميمها للتمارين القوية والنشطة بتصنيف مقاومة الماء IP67 وميزة وعي البيئة.',
    category: 'Audio',
    categoryAr: 'الصوتيات والسمعيات',
    price: 699,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
    stock: 35,
    rating: 4.6,
    reviewsCount: 42,
    featured: false,
    specs: ['Comfortable Soft-Hook Design (Zero Fall Out)', 'IP67 Waterproof Water and Sweat Shielding', 'Smart Ambient Transparency Pass-Through Audio', 'Up to 10 Hours of Continuous Run-Time Audio'],
    specsAr: ['ملحق أذن مريح وتثبيت إضافي لضمان عدم السقوط', 'مقاوم تماماً للعرق والماء والمطر تصنيف IP67 المتين', 'ميكروفونات نشطة لتوفير شفافية تامة مع الأصوات الخارجية', 'بطارية تدوم لعشر ساعات متواصلة من الاستماع المذهل والمستمر']
  },
  {
    id: 'prod-20',
    name: 'Qatar Shell Premium Wooden Speaker',
    nameAr: 'مكبر الصوت وودن شيل الفاخر من الخشب الصلب',
    description: 'Luxury design and elite performance meeting in a custom shell sculpted from Qatari-curated solid walnut with Wi-Fi and AirPlay 2 support.',
    descriptionAr: 'يلتقي التصميم الفاخر والأداء المذهل في جهاز مكسو ومصنع من قطعة خشب الجوز الصلبة والمطلية يدوياً يدعم الاتصال اللاسلكي عالي الدقة.',
    category: 'Audio',
    categoryAr: 'الصوتيات والسمعيات',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
    stock: 8,
    rating: 4.9,
    reviewsCount: 19,
    featured: true,
    specs: ['100% Solid Premium Sustainable Walnut Shell', 'Dynamic Triple High-Fidelity Dome Tweeters', 'Lossless Apple AirPlay 2, Cast & Multi-room Sync', 'Audiophile Grade Internal DAC Amplification Path'],
    specsAr: ['مصنع بالكامل من خشب الجوز الطبيعي المستدام والمصقول', 'مكبرات صوت ثلاثية مذهلة لتفاصيل حادة وعميقة جداً', 'اتصال ودعم وتوافق كامل مع AirPlay 2 و Multi-room', 'مضخم صوت ومحول إشارة DAC داخلي من رتبة عشاق الموسيقى الرفيعة']
  },
  {
    id: 'prod-21',
    name: 'Pocket Fold Slim Flip Elite',
    nameAr: 'هاتف بوكيت فولد فليب سليم النحيف',
    description: 'Ultra-thin foldable smartphone featuring a dynamic cover OLED screen, zero-gap state-of-the-art aluminum hinge, and pro AI cameras.',
    descriptionAr: 'هاتف ذكي بآلية طي فائقة النحافة، شاشات أوليد مزدوجة ذكية، مفصلات دقيقة ومرنة بنظام ألومنيوم مطور بالكامل، وكاميرات احترافية ذكية.',
    category: 'Smartphones',
    categoryAr: 'الهواتف الذكية',
    price: 4299,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    rating: 4.8,
    reviewsCount: 26,
    featured: false,
    specs: ['Zero-Gap Flexible Fluid Inner OLED Display', 'Handy Cover Screen OLED for Urgent Actions', 'Snapdragon Flagship Processors Built Inner', 'Sophisticated Dual 50MP Cameras with Optical Stabilization'],
    specsAr: ['شاشة مرنة وناعمة بالكامل ومقاومة للتجاعيد والطي', 'شاشة خارجية مصغرة وسهلة للمهام السريعة المباشرة والردود', 'معالجات كوالكوم الرائدة لتشغيل فائق وخفة استثنائية', 'نظام كاميرات مزدوج رائع بدقة ٥٠ ميجابكسل مع مثبت بصري']
  },
  {
    id: 'prod-22',
    name: 'Nova Pro Explorer (256GB)',
    nameAr: 'هاتف نوفا برو إكسبلورر (٢٥٦ جيجابايت)',
    description: 'Sleek and robust smartphone integrating a speedy 144Hz screen with incredible fast charging and aerospace-grade defense.',
    descriptionAr: 'هاتف ذكي متين وأنيق، يدمج شاشة خارقة ١٤٤ هرتز مع نظام شحن سريع طاقة ١٠٠ واط ومقاومة ممتازة.',
    category: 'Smartphones',
    categoryAr: 'الهواتف الذكية',
    price: 3299,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800',
    stock: 20,
    rating: 4.7,
    reviewsCount: 39,
    featured: false,
    specs: ['144Hz Fluid AMOLED Display paneling', 'True 100W Hyper Hyper Charge (100% in 18 Min)', 'Dual Face-Unlocked Secure Sensors Included', 'Corning Gorilla Glass Victus front and rear'],
    specsAr: ['شاشة أموليد ذات تردد ١٤٤ هرتز فائقة السلاسة والاستجابة', 'شحن خارق بقوة ١٠٠ واط (كامل البطارية في ١٨ دقيقة فقط)', 'نظام حماية مزدوج بالتعرف الفوري الآمن على الوجه والبصمة', 'درع زجاجي من كورنينغ جوريلا جلاس فيكتوس شديد التحمل']
  },
  {
    id: 'prod-23',
    name: 'Heron Smart Hydroponic Herb Garden',
    nameAr: 'حديقة هيرون المائية الذكية للأعشاب والبيت',
    description: 'Bring fresh organic greens right inside your kitchen with a smart automated grow box using water-circulation and LED light vectors.',
    descriptionAr: 'احصل على أعشاب ونباتات طازجة وخضراء عضوية وصحية مباشرة داخل مطبخك مع هذا الحوض الأوتوماتيكي المزين بنظام إضاءة مدروس.',
    category: 'Smart Home',
    categoryAr: 'الأجهزة المنزلية الذكية',
    price: 799,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    stock: 14,
    rating: 4.6,
    reviewsCount: 15,
    featured: false,
    specs: ['Automated Dynamic LED Full-spectrum Light Panel', 'Self-watering Silent Circulating Micro-Pump Base', 'No-soil Neat Hydroponic Pod Capsule Design', 'Smart Low Water Alarm and Level Indicators'],
    specsAr: ['لوحة إضاءة ذكية تحاكي ضوء الشمس لسرعة الإنبات', 'حوض دائم التهوية وصامت لدوران المياه والمحافظة عليها', 'زراعة نظيفة وممتعة بدون تربة لحماية المطبخ من الأوساخ', 'مؤشرات ذكية تبلغ بالاقتراب من جفاف الحوض أو ملئه']
  },
  {
    id: 'prod-24',
    name: 'Al-Maeda Smart Arabic Coffee Maker',
    nameAr: 'صانعة ومحضرة القهوة العربية الذكية المائدة',
    description: 'Reinvent dullah brewing tradition with safe app controls, automated cardamom spicing schedules, and active warm preservation.',
    descriptionAr: 'حضّر قهوة المذاق القطري والأصيل بجودة استثنائية، تمتاز بنظام ذكي لإضافة الهيل في التوقيت المثالي وتسخين ذاتي يمتد لساعات.',
    category: 'Smart Home',
    categoryAr: 'الأجهزة المنزلية الذكية',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    rating: 4.9,
    reviewsCount: 52,
    featured: true,
    specs: ['Authentic Qatar Golden Dallah Form Design', 'Automated Automated Cardamom Release Mechanism', 'Companion App for Preset Temperature & Timing', 'Constant Warming Base Plate Holds Up To 6 Hours'],
    specsAr: ['تصميم تقليدي فاخر مستوحى من الدلة الذهبية القطرية الأصلية', 'إناء مخصص لإسقاط وإضافة الهيل والزعفران في دقيقة دقيقة', 'تطبيق ذكي لتهيئة كمية المياه والحرارة والتحضير الفوري', 'قاعدة تسخين وتثبيت حرارة تبقي دافئة لمدة تصل إلى ٦ ساعات كاملة']
  },
  {
    id: 'prod-25',
    name: 'PureBreeze Air Purifier Pro',
    nameAr: 'منقي الهواء الذكي الفائق بيوربريز',
    description: 'Advanced workspace air purifier cleaning up to 90sqm rooms using True HEPA H14 blocks and whisper silent fans.',
    descriptionAr: 'منقي هواء متطور للمساحات الواسعة والمكاتب، ينظف في غضون دقائق مع فلتر HEPA H14 الطبي وسماعات عزل فائقة.',
    category: 'Smart Home',
    categoryAr: 'الأجهزة المنزلية الذكية',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    rating: 4.7,
    reviewsCount: 20,
    featured: false,
    specs: ['Medical Grade True H14 HEPA Block Filters', 'Whisper-Quiet Sleep Mode (Rated Only 21 Decibels)', 'Automated Laser Air Quality Sensor Reader Suite', 'Up To 90 Square Meters of Complete Room Cleansing'],
    specsAr: ['فلاتر طبية قوية تحجز 99.97٪ من ذرات الغبار والبكتيريا', 'نمط هادئ للغاية ومخصص للنوم الهادئ بمعدل ٢١ ديسيبل مريح', 'حساس ليزر لقراءة رتبة التلوث بدقة وإظهار مؤشرات النقاء', 'قدرة كاملة على تغطية وتنظيف صلوات ومساحات تسعين متراً مربعاً']
  },
  {
    id: 'prod-26',
    name: 'Apex Ergonomic Precision Mouse',
    nameAr: 'ماوس أليت إيرغونومك الارتجاجي الدقيق',
    description: 'High-end productivity mouse crafted to fit the hand comfortably with dual scrolling modes and cross-device wireless transfers.',
    descriptionAr: 'ماوس مكتبي فخم عالي الكفاءة، مصمم لحماية مفاصل اليد والراحة الكبرى مع درجات عالية للتمرير واستخدام أجهزة متعددة.',
    category: 'Peripherals',
    categoryAr: 'الملحقات والأجهزة الطرفية',
    price: 449,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800',
    stock: 40,
    rating: 4.8,
    reviewsCount: 45,
    featured: false,
    specs: ['Comfortable Ergonomic Form factor', 'Incredible 26,000 DPI Custom Optical Tracker', 'Wireless dual connection via Bluetooth and 2.4G Hz', 'Ultra-long 150-hour quick recharge battery'],
    specsAr: ['انحناء جانبي مريح يدعم راحة اليد والساعد بشكل مثالي', 'حساس ضوئي فائق الاستجابة والتعرف بدقة ٢٦,٠٠٠ نقطة', 'اتصال مزدوج بالبلوثوت ومستقبل لاسلكي سريع للغاية ٢.٤ جيجا', 'بطارية تدوم لمائة وخمسين ساعة من الاستعمال بشحنة مريحة']
  },
  {
    id: 'prod-27',
    name: 'Atlas Solid Walnut Tech Stand',
    nameAr: 'حامل الشاشة والمنظم أطلس من خشب الجوز',
    description: 'Elevate your desk comfort with a heavy-duty display stand sculpted from solid sustainable walnut.',
    descriptionAr: 'ارتق بمستوى راحة جلوسك ومكتبك مع هذا الحامل المتين المصنع يدوياً من قطعة فاخرة من خشب الجوز الصديق للبيئة.',
    category: 'Peripherals',
    categoryAr: 'الملحقات والأجهزة الطرفية',
    price: 399,
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&q=80&w=800',
    stock: 18,
    rating: 4.9,
    reviewsCount: 22,
    featured: false,
    specs: ['Premium Handmade Solid Walnut Wood Construction', 'Strong Aerospace-Grade Aluminum support base', 'Provides optimal monitor screen ergonomic height', 'Integrated base slots for cable and dock hiding'],
    specsAr: ['بناء مميز صلب وموثوق من خشب الجوز الطبيعي بنسبة ١٠٠٪', 'أرجل دعم متينة مصقولة من تيتانيوم وألمنيوم المركبات', 'يوفر زاوية مثالية لمستوى الشاشة لمنع آلام الرقبة والظهر', 'مكان تخزين وتنظيم سفلي للأسلاك وتجميع الملحقات']
  },
  {
    id: 'prod-28',
    name: 'Voyager Waterproof Leather Tech Folio',
    nameAr: 'حقيبة تنظيم وحفظ الأجهزة فوييجر الجلدية',
    description: 'Sleek luxury organization folder fashioned with waterproof Saffiano leather with rich organizational compartments.',
    descriptionAr: 'حقيبة ومنظم فاخر ومحمي من السوائل والسقوط مصمم بجلد سافيانو الممتاز ومكاتب متعددة للأسلاك والشواحن والأجهزة اللوحية.',
    category: 'Peripherals',
    categoryAr: 'الملحقات والأجهزة الطرفية',
    price: 299,
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=800',
    stock: 25,
    rating: 4.8,
    reviewsCount: 17,
    featured: false,
    specs: ['Waterproof Premium Saffiano Italian Leather Exterior', 'Rich Internal elastic band systems for cables/docks', 'Scratch-proof premium velvet protective lining', 'Sleek zippered pockets matching 11" thin screens'],
    specsAr: ['جلد سافيانو إيطالي فاخر مقاوم للمياه والأوساخ والاهتراء', 'نظام أحزمة مرنة مخصصة لتثبيت الأسلاك والبطاريات والأقلام', 'بطانة حريرية ناعمة مضادة للخدوش تماماً لمزيد من الراحة بالداخل', 'جيوب وسحاب عالي الاستجابة يتسع للأجهزة اللوحية قياس ١١ بوصة']
  },
  {
    id: 'prod-29',
    name: 'Aventador Sapphire Chronograph Leather Watch',
    nameAr: 'ساعة أفينتادور كرونوغراف الفاخرة بحجر الياقوت',
    description: 'Bespoke handcrafted automatic movement watch with surgical stainless-steel body, high-grade Italian leather strap, and deep blue sunray dial.',
    descriptionAr: 'ساعة يد ميكانيكية أوتوماتيكية مصنعة يدوياً، تمتاز بهيكل من الفولاذ المقاوم للصدأ بدرجة جراحية، وحزام جلدي إيطالي فاخر، وميناء بلون أزرق داكن ساحر.',
    category: "Men's Fashion",
    categoryAr: 'الركن الرجالي',
    price: 4599,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
    stock: 8,
    rating: 4.9,
    reviewsCount: 24,
    featured: true,
    specs: ['Swiss-Grade Automatic Caliber Movement', 'Genuine Full-Grain Soft Saffiano Leather', 'Scratch-Resistant Curved Sapphire Crystal Window', 'Waterproof Active Dynamic Seal (100m)'],
    specsAr: ['حركة سويسرية ميكانيكية أوتوماتيكية', 'جلد سافيانو إيطالي طبيعي ناعم ومقاوم', 'زجاج ياقوتي كريستال منحني فاخر مضاد للخدش', 'عازل داخلي كامل مقاوم للماء والغمر حتى ١٠٠ متر']
  },
  {
    id: 'prod-30',
    name: 'Elysium Premium Tailored Linen Blazer',
    nameAr: 'سترة إليسيوم الصيفية الفاخرة من الكتان الطبيعي',
    description: "Stay elegant and breezy in Qatar's warmth with this relaxed-cut lightweight linen blazer, crafted by luxury weavers for premium comfort.",
    descriptionAr: 'حافظ على أناقتك وانتعاشك في أجواء قطر الدافئة مع هذه السترة المصنوعة من الكتان العضوي الطبيعي خفيف الوزن بقصة عصرية فريدة.',
    category: "Men's Fashion",
    categoryAr: 'الركن الرجالي',
    price: 849,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    stock: 14,
    rating: 4.8,
    reviewsCount: 19,
    featured: false,
    specs: ['100% Certified Organic Premium Flax Linen', 'Perfect Tailored Semi-Structured Fit Panels', 'Breathable Lightweight Inner Silk Accents', 'Dual Interior Pockets for Phones and Cards'],
    specsAr: ['كتان طبيعي ناعم وعضوي بنسبة ١٠٠٪', 'قصة وتفصيل نصف مبني ناعم ومثالي للجسم', 'بطانة حريرية داخلية جيدة التهوية وخفيفة', 'جيوب داخلية مزدوجة مريحة للهاتف والبطاقات']
  },
  {
    id: 'prod-31',
    name: 'Orion Smart Interactive Coding Robot',
    nameAr: 'روبوت أوريون التفاعلي لتعليم البرمجة للأطفال',
    description: 'An intelligent modular STEM robot teaching kids basic logic, algorithmic reasoning, and pathfinding through fun interactive block games.',
    descriptionAr: 'روبوت تعليمي ذكي تفاعلي من فئة STEM يساعد الأطفال على تعلم التفكير المنطقي وأساسيات البرمجة من خلال ألعاب تركيبية ممتعة وبديهية.',
    category: 'Kids & Baby',
    categoryAr: 'عالم الأطفال والرضع',
    price: 589,
    image: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&q=80&w=800',
    stock: 10,
    rating: 4.7,
    reviewsCount: 15,
    featured: true,
    specs: ['Simple Visual Block-Coding Companion App', 'Obstacle-Avoiding LiDAR System Integrated', 'Robust Drop-Proof Food-Grade ABS Shell', 'Rechargeable Power Cell (Over 4h Active Fun)'],
    specsAr: ['تطبيق مصاحب سهل لتعلم البرمجة عبر القوالب المرئية', 'نظام كشف الحواجز ومستشعر ليزر ذكي مدمج', 'هيكل متين مقاوم للسقوط وخالٍ تماماً من المواد الضارة', 'بطارية قابلة للشحن توفر أكثر من ٤ ساعات متواصلة']
  },
  {
    id: 'prod-32',
    name: 'CloudComfort Organic Bamboo Bedding Set',
    nameAr: 'طقم ملاءات ومفارش سرير الأطفال من خيزران البامبو العضوي',
    description: 'Hypoallergenic ultra-soft regulatory bedding sheets crafted purely from organic bamboo fibers preventing toddler skin irritation.',
    descriptionAr: 'طقم مفارش لغرف نوم الأطفال مضاد تماماً للحساسية وفائق النعومة، مصنوع من ألياف البامبو العضوية لتوفير رعاية فائقة لبشرة طفلك.',
    category: 'Kids & Baby',
    categoryAr: 'عالم الأطفال والرضع',
    price: 329,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
    stock: 25,
    rating: 4.8,
    reviewsCount: 11,
    featured: false,
    specs: ['100% Organic Eco-Certified Bamboo Fibers', 'Naturally Hypoallergenic & Chemical-Free Dye', 'Thermal-Regulating Breathable Cool Fabric', 'Includes Fitted Sheet, Duvet & 2 Toddler Pillows'],
    specsAr: ['ألياف بامبو عضوية صديقة للبيئة بنسبة ١٠٠٪', 'خياطة مضادة للحساسية وألوان طبيعية آمنة', 'نسيج ينظم الحرارة ويبقي منتعشاً في الصيف وباهراً في الشتاء', 'يشتمل على ملاءة مطاطية وغطاء لحاف ووسادتين صغار']
  },
  {
    id: 'prod-33',
    name: 'Aura VPN Secure Premium Lifetime Pass',
    nameAr: 'اشتراك أورا في بي إن مدى الحياة لحماية الخصوصية',
    description: 'Enjoy high-octane global connections with military-grade encryption, zero logging databases, and dedicated media channels.',
    descriptionAr: 'استمتع باتصال عالمي فائق السرعة والأمان بفضل تشفير عالي الكفاءة، مع الحفاظ الكامل على الخصوصية بعدم تسجيل أي أنشطة.',
    category: 'Digital & Software',
    categoryAr: 'المنتدى الرقمي والاشتراكات',
    price: 499,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    stock: 99,
    rating: 4.9,
    reviewsCount: 47,
    featured: true,
    specs: ['Ultra-Fast Multi-Gigabit Global Connection Hubs', 'Pristine Zero-Logs Policy Backed Internally', 'Connect Up to 10 Devices Concurrently', 'Instant Digital Activation Key Delivery via Email'],
    specsAr: ['سيرفرات فائقة السرعة لمختلف دول العالم', 'سياسة صارمة تمنع تسجيل أي بيانات تصفح', 'إمكانية تشغيل ١٠ أجهزة في نفس اللحظة بأمان تام', 'توصيل رقمي فوري لرمز التفعيل عبر بريدك الإلكتروني']
  },
  {
    id: 'prod-34',
    name: 'PixelArts Creative Designer Suite Subscription',
    nameAr: 'رخصة برنامج بيكسل آرتس الاحترافية للتصميم والإبداع',
    description: 'Unleash artistic brilliance with 1-Year access to advanced vector engines, real-time filters, and dynamic typography presets.',
    descriptionAr: 'أطلق العنان لقدراتك الفنية مع اشتراك لمدة عام في نظام تصميم المتجهات والرسم الرقمي الأكثر كفاءة وموثوقية.',
    category: 'Digital & Software',
    categoryAr: 'المنتدى الرقمي والاشتراكات',
    price: 899,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    stock: 150,
    rating: 4.8,
    reviewsCount: 38,
    featured: false,
    specs: ['Professional Vector Illustration Tools Design', 'Real-Time Collaborative Live Space Panels', 'Includes 1TB Cloud Drive Vault & Assets Library', 'Windows, Mac, and iOS Tablet Multi-Deployment'],
    specsAr: ['أدوات رسم متجهات احترافية ومتقدمة للرسامين والمصممين', 'مساحة عمل مشتركة وتفاعلية تتيح العمل مع فريقك مباشرة', 'تشتمل على مساحة سحابية بسعة ١ تيرابايت ومكتبة عناصر هائلة', 'ترقية وتوافق تام مع أنظمة ويندوز، ماك، وتابلت الآيباد والموبايل']
  },
  {
    id: 'prod-35',
    name: 'Barista Craft Pro Touch Espresso Station',
    nameAr: 'آلة صانعة الإسبريسو باريستا كرافت برو باللمس',
    description: 'Ultimate micro-screen coffee masterpiece features automatic grinding levels, dual-boiler temperature stability, and silky milk texturing.',
    descriptionAr: 'محطة قهوة منزلية متكاملة ومصقولة بالكامل مع شاشة ذكية تقدم درجات طحن مختلفة لتبخير وصب إسبريسو غني ولذيذ.',
    category: 'Home & Living',
    categoryAr: 'المنزل والديكور',
    price: 3599,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
    stock: 6,
    rating: 4.9,
    reviewsCount: 52,
    featured: true,
    specs: ['Intelligent Precision Cone Burr Grinder Cores', 'Double Thermoblock Continuous Boiling Engines', 'Touch-Screen Beverage Setup Mode Configurations', 'High-Flow Commercial Grade Steam Wand Structure'],
    specsAr: ['مطحنة مخروطية مدمجة وشديدة الدقة للحبوب الطازجة', 'نظام تسخين مزدوج للحفاظ على درجة حرارة مياه مثالية', 'شاشة تحكم تعمل باللمس لاختيار وتهيئة كوبك المفضل وبدقة', 'عصا تبخير احترافية عالية القوة لرغوة حليب حريرية متناسقة']
  },
  {
    id: 'prod-36',
    name: 'AeroPure Smart Hydro-Sonic Air Humidifier',
    nameAr: 'مرطب الهواء الذكي آيروبيور بتقنية الأمواج الصوتية المائية',
    description: 'Create an oasis of clear respiration with interactive cold mist projection, quiet ultrasonic engine, and calming customizable LED core lights.',
    descriptionAr: 'اصنع واحة منعشة داخل منزلك مع مرطب الجو الذكي بالرذاذ البارد الصامت مع إضاءة خافتة تعين على الاسترخاء والهدوء.',
    category: 'Home & Living',
    categoryAr: 'المنزل والديكور',
    price: 249,
    image: 'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?auto=format&fit=crop&q=80&w=800',
    stock: 22,
    rating: 4.6,
    reviewsCount: 22,
    featured: false,
    specs: ['Large Capacity 4.5L Water Tank Space', 'Whisper-Quiet Ultrasonic Ultrasonic Cold Mist Projection', 'Cozy Multi-Color Ambient LED Night Rings', 'Companion Smartphone App Scheduling and Auto-Shutoff'],
    specsAr: ['خزان مياه كبير بسعة ٤.٥ لتر للاستخدام المتواصل لفترة طويلة', 'رذاذ بارد هادئ للغاية بالموجات فوق الصوتية لا يسبب أي إزعاج', 'إضاءة ليلية دافئة متعددة الألوان تساهم في تلطيف مظهر الطاولة', 'تطبيق ذكي لضبط مواعيد العمل والإيقاف التلقائي عند نفاد المياه']
  }
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  { code: 'DOHA10', type: 'percent', value: 10 },
  { code: 'WELCOMEQAR', type: 'fixed', value: 150, minSpend: 1000 },
  { code: 'RAMADANTECH', type: 'percent', value: 15, minSpend: 500 },
];

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'customer' | 'vendor';
  createdAt: string;
}
