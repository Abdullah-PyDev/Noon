-- SUPABASE POSTGRESQL INITIAL SCHEMAS AND SEEDSFOR QATAR EXOTIC GADGETS
-- Copy and run this script inside your Supabase Project SQL Editor (https://supabase.com)

-- 1. Create PRODUCTS Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    description TEXT,
    "descriptionAr" TEXT,
    category TEXT,
    "categoryAr" TEXT,
    price NUMERIC NOT NULL,
    image TEXT,
    stock INTEGER DEFAULT 0,
    rating NUMERIC DEFAULT 4.5,
    "reviewsCount" INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    specs JSONB DEFAULT '[]'::jsonb,
    "specsAr" JSONB DEFAULT '[]'::jsonb,
    reviews JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create PROMOS Table
CREATE TABLE IF NOT EXISTS promos (
    code TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'percent' or 'fixed'
    value NUMERIC NOT NULL,
    "minSpend" NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create ORDERS Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    municipality TEXT,
    "deliveryAddress" TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL,
    "discountCode" TEXT,
    "discountAmount" NUMERIC DEFAULT 0,
    "deliveryFee" NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending' | 'Sourced' | 'Out for Delivery' | 'Delivered' | 'Cancelled'
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Set row security permissions (Optional, enables anonymous access if needed)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products & promos
DROP POLICY IF EXISTS "Allow public read-only access to products" ON products;
CREATE POLICY "Allow public read-only access to products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read-only access to promos" ON promos;
CREATE POLICY "Allow public read-only access to promos" ON promos FOR SELECT USING (true);

-- Allow public read & insert access to orders so clients can place and track orders
DROP POLICY IF EXISTS "Allow public select on orders" ON orders;
CREATE POLICY "Allow public select on orders" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on orders" ON orders;
CREATE POLICY "Allow public insert on orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on orders" ON orders;
CREATE POLICY "Allow public update on orders" ON orders FOR UPDATE USING (true);

-- Also allow all operations for service role bypass (e.g. backend synchronization)
DROP POLICY IF EXISTS "Full service access to products" ON products;
CREATE POLICY "Full service access to products" ON products FOR ALL USING (true);

DROP POLICY IF EXISTS "Full service access to promos" ON promos;
CREATE POLICY "Full service access to promos" ON promos FOR ALL USING (true);

DROP POLICY IF EXISTS "Full service access to orders" ON orders;
CREATE POLICY "Full service access to orders" ON orders FOR ALL USING (true);

-- 5. Seed Initial Catalog Data
INSERT INTO products (id, name, "nameAr", description, "descriptionAr", category, "categoryAr", price, image, stock, rating, "reviewsCount", featured, specs, "specsAr")
VALUES 
(
  'prod-1', 
  'Futura Vision Pro VR Headset', 
  'نظارة الواقع الافتراضي فيوتشرا فيجن برو', 
  'Experience standard-shattering augmented reality with dual 4K micro-OLED microdisplays, responsive eye tracking, and high-fidelity directional spatial audio.',
  'اختبر واقعاً معززاً مبهراً مع شاشات ميكرو ديسبلاي مزدوجة بدقة 4K وتتبع متقدم لحركة العين وصوت مكاني مذهل ذو دقة متناهية.',
  'Wearables', 
  'الأجهزة القابلة للارتداء',
  12999,
  'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=800',
  8,
  4.9,
  24,
  true,
  '["Dual 4K Micro-OLED Displays", "M2 + R1 Spatial Processing Silicon", "Intuitive Eye & Voice Tracking", "Dynamic Spatial Soundstage"]'::jsonb,
  '["شاشات Micro-OLED مزدوجة بدقة 4K", "معالجات M2 + R1 الفائقة", "تتبع ذكي لحركة العين والصوت", "صوت مكاني ديناميكي محيطي"]'::jsonb
),
(
  'prod-2',
  'Optima Curved OLED Tech Monitor 34"',
  'شاشة أوبتيما المنحنية بتقنية أوليد ٣٤ بوصة',
  'Ultra-wide 240Hz OLED gaming monitor with 0.03ms response time, infinite contrast, and gorgeous HDR True Black 400 profiles.',
  'شاشة ألعاب أوليد فائقة العرض بتردد ٢٤٠ هرتز ومعدل استجابة ٠.٠٣ مللي ثانية وتباين لانهائي مع دعم كامل ومذهل لتقنية HDR.',
  'Displays', 
  'الشاشات واللوحات',
  3899,
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
  12,
  4.8,
  42,
  true,
  '["34-inch 1800R Deep Curve", "True OLED-level Infinite Contrast", "Sizzling 240Hz Refresh Rate", "Lightning 0.03ms Pixel Response"]'::jsonb,
  '["انحناء عميق بقوة 1800R مقاس ٣٤ بوصة", "تباين أوليد حقيقي ولانهائي", "معدل تحديث فائق بقوة ٢٤٠ هرتز", "سرعة استجابة فائقة بقيمة 0.03 مللي ثانية"]'::jsonb
),
(
  'prod-3',
  'Acoustic-X ANC Over-Ear Headphones',
  'سماعات الرأس أكوستيك-إكس عازلة الضوضاء',
  'Industry-leading Active Noise Cancellation with customized auto-isolation chips, touch sensors, and up to 40 hours of lossless audio playback.',
  'تقنية إلغاء الضوضاء النشطة الرائدة في الصناعة مع معالجة ذكية للعزل التلقائي، ومستشعرات لمس، وما يصل إلى ٤٠ ساعة من تشغيل الصوت بلا فقدان.',
  'Audio',
  'الصوتيات والسمعيات',
  1349,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
  25,
  4.7,
  88,
  true,
  '["Custom Level Hybrid Dual ANC", "40mm Premium Dome Driver Arrays", "High-Res Audio LDAC Codec Support", "Ultra-Comfort Cloud Cushions"]'::jsonb,
  '["نظام إلغاء ضوضاء هجين ثنائي ممتاز", "مكبرات صوت داخلية متميزة مقاس 40 مم", "دعم ترميز LDAC عالي الدقة للصوت", "وسائد أذن مريحة للغاية تشبه السحاب"]'::jsonb
),
(
  'prod-4',
  'Titan Tech Flagship Pro (512GB)',
  'هاتف تايتن تيك فلاغشيب برو (٥١٢ جيجابايت)',
  'Impeccably detailed aerospace-grade titanium frame housing a 3nm neural engine, triple optical zooms, and a dynamic island screen layout.',
  'هيكل مذهل للغاية من التيتانيوم المخصص للمركبات الفضائية يضم محركاً عصبياً بدقة ٣ نانومتر، وثلاث كاميرات زووم بصري وشاشة ديناميكية رائعة.',
  'Smartphones',
  'الهواتف الذكية',
  4899,
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
  15,
  4.9,
  104,
  true,
  '["Aerospace-grade Polished Titanium", "3nm Next-Gen Octa-core Processor", "Advanced Pro triple focal zoom", "Super Retina 120Hz Refresh Screen"]'::jsonb,
  '["هيكل تيتانيوم مصقول فائق المتانة", "معالج ثماني النواة بدقة ٣ نانومتر اليوم", "نظام تصوير احترافي زووم ثلاثي متطور", "شاشة سوبر ريتنا بمعدل تحديث ١٢٠ هرتز"]'::jsonb
),
(
  'prod-5',
  'Al-Anabi Mechanical Custom Keyboard',
  'لوحة مفاتيح العنابي الميكانيكية الفاخرة',
  'Special Qatari Edition mechanical keyboard featuring custom burgundy-maroon hot-swappable switches, keycaps with Arabic-English legends, and a solid aluminum chassis.',
  'إصدار قطري خاص من لوحة المفاتيح الميكانيكية تتميز بمفاتيح حمراء داكنة قابلة للتبديل السريع، وأغطية بمفاتيح ثنائية اللغة (عربي-إنجليزي)، وهيكل متين من الألمنيوم.',
  'Peripherals',
  'الملحقات والأجهزة الطرفية',
  749,
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800',
  30,
  4.9,
  31,
  true,
  '["Solid CNC Milled Aluminum Frame", "Custom Swappable Linear Maroon Switches", "Arabic + English PBT Keycaps", "Gasket Mounted Sound-Dampened Body"]'::jsonb,
  '["هيكل متين مصنوع بالكامل من الألومنيوم CNC", "مفاتيح حمراء خطية قابلة للتبديل متطورة", "أغطية مفاتيح PBT ثنائية اللغة عربي + إنجليزي", "جسم مزود بحشوات كاتمة للأصوات المرتفعة"]'::jsonb
),
(
  'prod-29',
  'Aventador Sapphire Chronograph Leather Watch',
  'ساعة أفينتادور كرونوغراف الفاخرة بحجر الياقوت',
  'Bespoke handcrafted automatic movement watch with surgical stainless-steel body, high-grade Italian leather strap, and deep blue sunray dial.',
  'ساعة يد ميكانيكية أوتوماتيكية مصنعة يدوياً، تمتاز بهيكل من الفولاذ المقاوم للصدأ بدرجة جراحية، وحزام جلدي إيطالي فاخر، وميناء بلون أزرق داكن ساحر.',
  'Men''s Fashion',
  'الركن الرجالي',
  4599,
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
  8,
  4.9,
  24,
  true,
  '["Swiss-Grade Automatic Caliber Movement", "Genuine Full-Grain Soft Saffiano Leather", "Scratch-Resistant Curved Sapphire Crystal Window", "Waterproof Active Dynamic Seal (100m)"]'::jsonb,
  '["حركة سويسرية ميكانيكية أوتوماتيكية", "جلد سافيانو إيطالي طبيعي ناعم ومقاوم", "زجاج ياقوتي كريستال منحني فاخر مضاد للخدش", "عازل داخلي كامل مقاوم للماء والغمر حتى ١٠٠ متر"]'::jsonb
),
(
  'prod-30',
  'Elysium Premium Tailored Linen Blazer',
  'سترة إليسيوم الصيفية الفاخرة من الكتان الطبيعي',
  'Stay elegant and breezy in Qatar''s warmth with this relaxed-cut lightweight linen blazer, crafted by luxury weavers for premium comfort.',
  'حافظ على أناقتك وانتعاشك في أجواء قطر الدافئة مع هذه السترة المصنوعة من الكتان العضوي الطبيعي خفيف الوزن بقصة عصرية فريدة.',
  'Men''s Fashion',
  'الركن الرجالي',
  849,
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
  14,
  4.8,
  19,
  false,
  '["100% Certified Organic Premium Flax Linen", "Perfect Tailored Semi-Structured Fit Panels", "Breathable Lightweight Inner Silk Accents", "Dual Interior Pockets for Phones and Cards"]'::jsonb,
  '["كتان طبيعي ناعم وعضوي بنسبة ١٠٠٪", "قصة وتفصيل نصف مبني ناعم ومثالي للجسم", "بطانة حريرية داخلية جيدة التهوية وخفيفة", "جيوب داخلية مزدوجة مريحة للهاتف والبطاقات"]'::jsonb
),
(
  'prod-31',
  'Orion Smart Interactive Coding Robot',
  'روبوت أوريون التفاعلي لتعليم البرمجة للأطفال',
  'An intelligent modular STEM robot teaching kids basic logic, algorithmic reasoning, and pathfinding through fun interactive block games.',
  'روبوت تعليمي ذكي تفاعلي من فئة STEM يساعد الأطفال على تعلم التفكير المنطقي وأساسيات البرمجة من خلال ألعاب تركيبية ممتعة وبديهية.',
  'Kids & Baby',
  'عالم الأطفال والرضع',
  589,
  'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&q=80&w=800',
  10,
  4.7,
  15,
  true,
  '["Simple Visual Block-Coding Companion App", "Obstacle-Avoiding LiDAR System Integrated", "Robust Drop-Proof Food-Grade ABS Shell", "Rechargeable Power Cell (Over 4h Active Fun)"]'::jsonb,
  '["تطبيق مصاحب سهل لتعلم البرمجة عبر القوالب المرئية", "نظام كشف الحواجز ومستشعر ليزر ذكي مدمج", "هيكل متين مقاوم للسقوط وخالٍ تماماً من المواد الضارة", "بطارية قابلة للشحن توفر أكثر من ٤ ساعات متواصلة"]'::jsonb
),
(
  'prod-32',
  'CloudComfort Organic Bamboo Bedding Set',
  'طقم ملاءات ومفارش سرير الأطفال من خيزران البامبو العضوي',
  'Hypoallergenic ultra-soft regulatory bedding sheets crafted purely from organic bamboo fibers preventing toddler skin irritation.',
  'طقم مفارش لغرف نوم الأطفال مضاد تماماً للحساسية وفائق النعومة، مصنوع من ألياف البامبو العضوية لتوفير رعاية فائقة لبشرة طفلك.',
  'Kids & Baby',
  'عالم الأطفال والرضع',
  329,
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
  25,
  4.8,
  11,
  false,
  '["100% Organic Eco-Certified Bamboo Fibers", "Naturally Hypoallergenic & Chemical-Free Dye", "Thermal-Regulating Breathable Cool Fabric", "Includes Fitted Sheet, Duvet & 2 Toddler Pillows"]'::jsonb,
  '["ألياف بامبو عضوية صديقة للبيئة بنسبة ١٠٠٪", "خياطة مضادة للحساسية وألوان طبيعية آمنة", "نسيج ينظم الحرارة ويبقي منتعشاً في الصيف وباهراً في الشتاء", "يشتمل على ملاءة مطاطية وغطاء لحاف ووسادتين صغار"]'::jsonb
),
(
  'prod-33',
  'Aura VPN Secure Premium Lifetime Pass',
  'اشتراك أورا في بي إن مدى الحياة لحماية الخصوصية',
  'Enjoy high-octane global connections with military-grade encryption, zero logging databases, and dedicated media channels.',
  'استمتع باتصال عالمي فائق السرعة والأمان بفضل تشفير عالي الكفاءة، مع الحفاظ الكامل على الخصوصية بعدم تسجيل أي أنشطة.',
  'Digital & Software',
  'المنتدى الرقمي والاشتراكات',
  499,
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
  99,
  4.9,
  47,
  true,
  '["Ultra-Fast Multi-Gigabit Global Connection Hubs", "Pristine Zero-Logs Policy Backed Internally", "Connect Up to 10 Devices Concurrently", "Instant Digital Activation Key Delivery via Email"]'::jsonb,
  '["سيرفرات فائقة السرعة لمختلف دول العالم", "سياسة صارمة تمنع تسجيل أي بيانات تصفح", "إمكانية تشغيل ١٠ أجهزة في نفس اللحظة بأمان تام", "توصيل رقمي فوري لرمز التفعيل عبر بريدك الإلكتروني"]'::jsonb
),
(
  'prod-34',
  'PixelArts Creative Designer Suite Subscription',
  'رخصة برنامج بيكسل آرتس الاحترافية للتصميم والإبداع',
  'Unleash artistic brilliance with 1-Year access to advanced vector engines, real-time filters, and dynamic typography presets.',
  'أطلق العنان لقدراتك الفنية مع اشتراك لمدة عام في نظام تصميم المتجهات والرسم الرقمي الأكثر كفاءة وموثوقية.',
  'Digital & Software',
  'المنتدى الرقمي والاشتراكات',
  899,
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
  150,
  4.8,
  38,
  false,
  '["Professional Vector Illustration Tools Design", "Real-Time Collaborative Live Space Panels", "Includes 1TB Cloud Drive Vault & Assets Library", "Windows, Mac, and iOS Tablet Multi-Deployment"]'::jsonb,
  '["أدوات رسم متجهات احترافية ومتقدمة للرسامين والمصممين", "مساحة عمل مشتركة وتفاعلية تتيح العمل مع فريقك مباشرة", "تشتمل على مساحة سحابية بسعة ١ تيرابايت ومكتبة عناصر هائلة", "ترقية وتوافق تام مع أنظمة ويندوز، ماك، وتابلت الآيباد والموبايل"]'::jsonb
),
(
  'prod-35',
  'Barista Craft Pro Touch Espresso Station',
  'آلة صانعة الإسبريسو باريستا كرافت برو باللمس',
  'Ultimate micro-screen coffee masterpiece features automatic grinding levels, dual-boiler temperature stability, and silky milk texturing.',
  'محطة قهوة منزلية متكاملة ومصقولة بالكامل مع شاشة ذكية تقدم درجات طحن مختلفة لتبخير وصب إسبريسو غني ولذيذ.',
  'Home & Living',
  'المنزل والديكور',
  3599,
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
  6,
  4.9,
  52,
  true,
  '["Intelligent Precision Cone Burr Grinder Cores", "Double Thermoblock Continuous Boiling Engines", "Touch-Screen Beverage Setup Mode Configurations", "High-Flow Commercial Grade Steam Wand Structure"]'::jsonb,
  '["مطحنة مخروطية مدمجة وشديدة الدقة للحبوب الطازجة", "نظام تسخين مزدوج للحفاظ على درجة حرارة مياه مثالية", "شاشة تحكم تعمل باللمس لاختيار وتهيئة كوبك المفضل وبدقة", "عصا تبخير احترافية عالية القوة لرغوة حليب حريرية متناسقة"]'::jsonb
),
(
  'prod-36',
  'AeroPure Smart Hydro-Sonic Air Humidifier',
  'مرطب الهواء الذكي آيروبيور بتقنية الأمواج الصوتية المائية',
  'Create an oasis of clear respiration with interactive cold mist projection, quiet ultrasonic engine, and calming customizable LED core lights.',
  'اصنع واحة منعشة داخل منزلك مع مرطب الجو الذكي بالرذاذ البارد الصامت مع إضاءة خافتة تعين على الاسترخاء والهدوء.',
  'Home & Living',
  'المنزل والديكور',
  249,
  'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?auto=format&fit=crop&q=80&w=800',
  22,
  4.6,
  22,
  false,
  '["Large Capacity 4.5L Water Tank Space", "Whisper-Quiet Ultrasonic Ultrasonic Cold Mist Projection", "Cozy Multi-Color Ambient LED Night Rings", "Companion Smartphone App Scheduling and Auto-Shutoff"]'::jsonb,
  '["خزان مياه كبير بسعة ٤.٥ لتر للاستخدام المتواصل لفترة طويلة", "رذاذ بارد هادئ للغاية بالموجات فوق الصوتية لا يسبب أي إزعاج", "إضاءة ليلية دافئة متعددة الألوان تساهم في تلطيف مظهر الطاولة", "تطبيق ذكي لضبط مواعيد العمل والإيقاف التلقائي عند نفاد المياه"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Promo Codes
INSERT INTO promos (code, type, value, "minSpend")
VALUES 
('DOHA10', 'percent', 10, NULL),
('WELCOMEQAR', 'fixed', 150, 1000),
('RAMADANTECH', 'percent', 15, 500)
ON CONFLICT (code) DO NOTHING;

-- Seed Sample Historic Order
INSERT INTO orders (id, "customerName", "customerPhone", "customerEmail", municipality, "deliveryAddress", items, subtotal, "discountCode", "discountAmount", "deliveryFee", total, "paymentMethod", status, "createdAt")
VALUES
(
  'QAR-ORD-890214-DOH',
  'Mubarak Al-Kaabi',
  '55423189',
  'mubarak.kaabi@qatar.net.qa',
  'rayyan',
  'Villa 12, Street 890, Zone 53',
  '[
    {"productId": "prod-3", "name": "Acoustic-X ANC Over-Ear Headphones", "nameAr": "سماعات الرأس أكوستيك-إكس عازلة الضوضاء", "price": 1349, "quantity": 1},
    {"productId": "prod-5", "name": "Al-Anabi Mechanical Custom Keyboard", "nameAr": "لوحة مفاتيح العنابي الميكانيكية الفاخرة", "price": 749, "quantity": 2}
  ]'::jsonb,
  2847,
  'DOHA10',
  284,
  20,
  2583,
  'card',
  'Delivered',
  NOW() - INTERVAL '3 days'
),
(
  'QAR-ORD-215093-WES',
  'Fatima Al-Thani',
  '33890211',
  'f.althani@amad.gov.qa',
  'westbay',
  'Kempinski Residences, West Bay, Suite 3402',
  '[
    {"productId": "prod-1", "name": "Futura Vision Pro VR Headset", "nameAr": "نظارة الواقع الافتراضي فيوتشرا فيجن برو", "price": 12999, "quantity": 1}
  ]'::jsonb,
  12999,
  'DOHA10',
  1300,
  15,
  11714,
  'qpay',
  'Out for Delivery',
  NOW() - INTERVAL '1 day'
),
(
  'QAR-ORD-093214-LUS',
  'Khalid Al-Muhannadi',
  '77012354',
  'khalid.m@qatarair.com.qa',
  'lusail',
  'Marina District, Tower 3, Floor 18',
  '[
    {"productId": "prod-4", "name": "Titan Tech Flagship Pro (512GB)", "nameAr": "هاتف تايتن تيك فلاغشيب برو (٥١٢ جيجابايت)", "price": 4899, "quantity": 1}
  ]'::jsonb,
  4899,
  'WELCOMEQAR',
  150,
  20,
  4769,
  'card',
  'Pending',
  NOW() - INTERVAL '30 seconds'
)
ON CONFLICT (id) DO NOTHING;


-- 6. Create USERS Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT, -- plain text fallback or password hash
    "fullName" TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer', -- 'customer' | 'vendor'
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security policies for user sync
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select on users" ON users;
CREATE POLICY "Allow public select on users" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on users" ON users;
CREATE POLICY "Allow public insert on users" ON users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on users" ON users;
CREATE POLICY "Allow public update on users" ON users FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Full service access to users" ON users;
CREATE POLICY "Full service access to users" ON users FOR ALL USING (true);

-- Seed Initial Admin-Vendor Profile (demo account matches SEED_USERS)
-- Clean up existing record to avoid email unique constraint and primary key conflicts
DELETE FROM users WHERE id = 'user-vendor-1' OR email = 'vendor@gadgets.qa';

INSERT INTO users (id, email, password, "fullName", role, "createdAt")
VALUES ('user-vendor-1', 'vendor@gadgets.qa', 'admin', 'Doha Tech Vendor', 'vendor', NOW());

