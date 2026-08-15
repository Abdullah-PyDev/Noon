/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  SlidersHorizontal,
  Search,
  Check,
  Building,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  ShieldAlert,
  Clock,
  Printer,
  Download,
  ChevronLeft,
  LogIn,
  LogOut,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Product, CartItem, Order, PromoCode, INITIAL_PRODUCTS, INITIAL_PROMO_CODES, QATAR_MUNICIPALITIES, User } from './types';
import { TRANSLATIONS } from './utils/translations';
import LanguageToggle from './components/LanguageToggle';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import UserTracker from './components/UserTracker';
import AuthModal from './components/AuthModal';
import { Truck, ChevronDown, Grid, Tag, Laptop, Tv, Gamepad, Smartphone, Cpu, Home as HomeIcon, Smile, Shirt, Heart, Briefcase, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Pre-seeded historical simulation orders to make the merchant commands immediately highly interactive and visual
const PRE_SEEDED_ORDERS: Order[] = [
  {
    id: 'QAR-ORD-890214-DOH',
    customerName: 'Mubarak Al-Kaabi',
    customerPhone: '55423189',
    customerEmail: 'mubarak.kaabi@qatar.net.qa',
    municipality: 'rayyan',
    deliveryAddress: 'Villa 12, Street 890, Zone 53',
    items: [
      { productId: 'prod-3', name: 'Acoustic-X ANC Over-Ear Headphones', nameAr: 'سماعات الرأس أكوستيك-إكس عازلة الضوضاء', price: 1349, quantity: 1 },
      { productId: 'prod-5', name: 'Al-Anabi Mechanical Custom Keyboard', nameAr: 'لوحة مفاتيح العنابي الميكانيكية الفاخرة', price: 749, quantity: 2 }
    ],
    subtotal: 2847,
    discountAmount: 284,
    discountCode: 'DOHA10',
    deliveryFee: 20,
    total: 2583,
    paymentMethod: 'card',
    status: 'Delivered',
    createdAt: '2026-05-18T10:30:00Z',
  },
  {
    id: 'QAR-ORD-215093-WES',
    customerName: 'Fatima Al-Thani',
    customerPhone: '33890211',
    customerEmail: 'f.althani@amad.gov.qa',
    municipality: 'westbay',
    deliveryAddress: 'Kempinski Residences, West Bay, Suite 3402',
    items: [
      { productId: 'prod-1', name: 'Futura Vision Pro VR Headset', nameAr: 'نظارة الواقع الافتراضي فيوتشرا فيجن برو', price: 12999, quantity: 1 }
    ],
    subtotal: 12999,
    discountAmount: 1300,
    discountCode: 'DOHA10',
    deliveryFee: 15,
    total: 11714,
    paymentMethod: 'qpay',
    status: 'Out for Delivery',
    createdAt: '2026-05-20T14:45:00Z',
  },
  {
    id: 'QAR-ORD-093214-LUS',
    customerName: 'Khalid Al-Muhannadi',
    customerPhone: '77012354',
    customerEmail: 'khalid.m@qatarair.com.qa',
    municipality: 'lusail',
    deliveryAddress: 'Marina District, Tower 3, Floor 18',
    items: [
      { productId: 'prod-4', name: 'Titan Tech Flagship Pro (512GB)', nameAr: 'هاتف تايتن تيك فلاغشيب برو (٥١٢ جيجابايت)', price: 4899, quantity: 1 },
      { productId: 'prod-6', name: 'Chrono-Sport Hybrid Smart Watch', nameAr: 'ساعة كرونو الرياضية الذكية المتطورة', price: 2199, quantity: 1 }
    ],
    subtotal: 7098,
    discountAmount: 150,
    discountCode: 'WELCOMEQAR',
    deliveryFee: 20,
    total: 6968,
    paymentMethod: 'card',
    status: 'Pending',
    createdAt: '2026-05-21T09:15:00Z',
  }
];

export default function App() {
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en');
  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'tracking'>('store');

  // Core Data Persistent states
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Read cached user session on load, verifying with backend HTTPOnly cookie
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const result = await response.json();
          if (result.user) {
            setCurrentUser(result.user);
            localStorage.setItem('qgadget_user', JSON.stringify(result.user));
            return;
          }
        }
      } catch (e) {
        console.warn('Backend reachability check on mount failed, referring to localStorage cache.', e);
      }

      // No valid cookie session returned or server offline, try strict validation of local cache
      const cachedUser = localStorage.getItem('qgadget_user');
      if (cachedUser) {
        try {
          setCurrentUser(JSON.parse(cachedUser));
        } catch (e) {
          localStorage.removeItem('qgadget_user');
        }
      }
    };
    checkSession();
  }, []);

  // Beautiful category icons, descriptions, and styling backgrounds
  const CATEGORY_META = React.useMemo(() => {
    return {
      'Wearables': { icon: Heart, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', descEn: 'Premium smartwatches and fitness tracking bands', descAr: 'ساعات ذكية متطورة وأساور رياضية' },
      'Displays': { icon: Tv, color: 'text-sky-600 bg-sky-50 border-sky-100', descEn: 'Immersive OLED displays, high-refresh screens', descAr: 'شاشات أوليد وشاشات عرض عالية الجودة' },
      'Audio': { icon: Phone, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', descEn: 'Hi-Fi earbuds, studio headphones, and speakers', descAr: 'سماعات رأس لاسلكية ومكبرات صوت فائقة النقاء' },
      'Smartphones': { icon: Smartphone, color: 'text-[#e11d48] bg-rose-50 border-rose-100', descEn: 'Next-gen flagship phones and accessories', descAr: 'أحدث الهواتف الذكية وملحقاتها المتطورة' },
      'Peripherals': { icon: Laptop, color: 'text-amber-600 bg-amber-50 border-amber-100', descEn: 'Sleek mechanical keyboards and optical mice', descAr: 'لوحات مفاتيح ميكانيكية وفأرات ألعاب فائقة' },
      'Consoles': { icon: Gamepad, color: 'text-pink-600 bg-pink-50 border-pink-100', descEn: 'Powerful next-gen gaming units and gamepads', descAr: 'أجهزة ألعاب الجيل الجديد وأذرع التحكم الحديثة' },
      'Smart Home': { icon: Cpu, color: 'text-purple-600 bg-purple-50 border-purple-100', descEn: 'Intelligent automation systems and ambient tech', descAr: 'أنظمة الأتمتة المنزلية والأجهزة الذكية المترابطة' },
      "Women's Collection": { icon: Sparkles, color: 'text-violet-600 bg-violet-50 border-violet-100', descEn: 'Chic lifestyle devices and luxury wearables', descAr: 'مستلزمات وإكسسوارات الأناقة والجمال المتطورة' },
      "Men's Fashion": { icon: Shirt, color: 'text-blue-600 bg-blue-50 border-blue-100', descEn: 'Tailored style, automated watches & fine apparel', descAr: 'ساعات أوتوماتيكية وملابس أنيقة تليق بالرجال' },
      'Kids & Baby': { icon: Smile, color: 'text-teal-600 bg-teal-50 border-teal-100', descEn: 'STEM coding toys, organic bedding and soft care', descAr: 'روبوتات برمجية وألعاب ذكية مفيدة للأطفال' },
      'Digital & Software': { icon: Briefcase, color: 'text-cyan-600 bg-cyan-50 border-cyan-100', descEn: 'Premium VPN keys, lifetime software licenses', descAr: 'اشتراكات برمجية ورخص رقمية فورية وآمنة' },
      'Home & Living': { icon: HomeIcon, color: 'text-orange-600 bg-orange-50 border-orange-100', descEn: 'Smart air humidifiers, touch espresso makers', descAr: 'صانعات القهوة الفاخرة وأجهزة ترطيب الهواء الذكية' }
    } as Record<string, { icon: React.ComponentType<any>; color: string; descEn: string; descAr: string }>;
  }, []);

  // Dropdown states for category overlays
  const [isHeaderCategoryDropdownOpen, setIsHeaderCategoryDropdownOpen] = useState(false);
  const [isCatalogCategoryDropdownOpen, setIsCatalogCategoryDropdownOpen] = useState(false);

  // Interactive Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // checkout completed receipt popup
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);

  // Load and fetch from our full-stack Express backend APIs
  const fetchAllData = async () => {
    setIsRefreshingOrders(true);
    try {
      // 1. Fetch Products
      const productsRes = await fetch('/api/products');
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
        localStorage.setItem('qgadget_products', JSON.stringify(productsData));
      } else {
        throw new Error('Failed to fetch products');
      }

      // 2. Fetch Promos
      const promosRes = await fetch('/api/promos');
      if (promosRes.ok) {
        const promosData = await promosRes.json();
        setPromos(promosData);
        localStorage.setItem('qgadget_promos', JSON.stringify(promosData));
      } else {
        throw new Error('Failed to fetch promos');
      }

      // 3. Fetch Orders
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
        localStorage.setItem('qgadget_orders', JSON.stringify(ordersData));
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (err) {
      console.warn('Backend server is starting up or unreachable. Operating in offline fallback.', err);
      // Fallback cache loading if fetch fails
      const cachedProducts = localStorage.getItem('qgadget_products');
      setProducts(cachedProducts ? JSON.parse(cachedProducts) : INITIAL_PRODUCTS);

      const cachedPromos = localStorage.getItem('qgadget_promos');
      setPromos(cachedPromos ? JSON.parse(cachedPromos) : INITIAL_PROMO_CODES);

      const cachedOrders = localStorage.getItem('qgadget_orders');
      setOrders(cachedOrders ? JSON.parse(cachedOrders) : PRE_SEEDED_ORDERS);
    } finally {
      setIsRefreshingOrders(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Read cached cart value locally
    const cachedCart = localStorage.getItem('qgadget_cart');
    if (cachedCart) {
      setCart(JSON.parse(cachedCart));
    }
  }, []);

  // Synchronize orders and products dynamically in background every 4s to show real-time live progressions and stock changes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const fetchedOrders = await res.json();
          setOrders(fetchedOrders);
          localStorage.setItem('qgadget_orders', JSON.stringify(fetchedOrders));
        }

        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const fetchedProducts = await prodRes.json();
          setProducts(fetchedProducts);
          localStorage.setItem('qgadget_products', JSON.stringify(fetchedProducts));
        }
      } catch (err) {
        // Fail silently in background
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Save states and push changes dynamically code-wide
  const handleUpdateProducts = async (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('qgadget_products', JSON.stringify(updatedProducts));
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProducts),
      });
    } catch (err) {
      console.error('Failed to sync products with backend', err);
    }
  };

  const handleUpdateOrders = async (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('qgadget_orders', JSON.stringify(updatedOrders));
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrders),
      });
    } catch (err) {
      console.error('Failed to sync orders with backend', err);
    }
  };

  const handleUpdatePromos = async (updatedPromos: PromoCode[]) => {
    setPromos(updatedPromos);
    localStorage.setItem('qgadget_promos', JSON.stringify(updatedPromos));
    try {
      await fetch('/api/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPromos),
      });
    } catch (err) {
      console.error('Failed to sync promos with backend', err);
    }
  };

  // Synchronize language and browser direction
  useEffect(() => {
    const isRtl = currentLang === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    document.title = isRtl ? 'قطر للإلكترونيات الرقمية ' : 'Qatar Digital Gadgets';
  }, [currentLang]);

  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  // Categories extracted dynamically from products lists to ensure updates carry over instantly
  const productCategories = React.useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return unique;
  }, [products]);

  // Handle Cart updates
  const handleAddToCart = (productId: string) => {
    const matchedProduct = products.find((p) => p.id === productId);
    if (!matchedProduct || matchedProduct.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      let updated: CartItem[];

      if (existing) {
        // Cap item inclusion by available inventory
        const nextQuantity = Math.min(matchedProduct.stock, existing.quantity + 1);
        updated = prev.map((item) =>
          item.productId === productId ? { ...item, quantity: nextQuantity } : item
        );
      } else {
        updated = [...prev, { productId, quantity: 1 }];
      }

      localStorage.setItem('qgadget_cart', JSON.stringify(updated));
      return updated;
    });

    // Provide visual success prompt
    const cardEl = document.getElementById(`product-card-${productId}`);
    if (cardEl) {
      cardEl.classList.add('ring-2', 'ring-emerald-500', 'scale-98');
      setTimeout(() => {
        cardEl.classList.remove('ring-2', 'ring-emerald-500', 'scale-98');
      }, 600);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const matchedProduct = products.find((p) => p.id === productId);
    if (!matchedProduct) return;

    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    setCart((prev) => {
      const cappedQty = Math.min(matchedProduct.stock, quantity);
      const updated = prev.map((item) =>
        item.productId === productId ? { ...item, quantity: cappedQty } : item
      );
      localStorage.setItem('qgadget_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => {
      const filtered = prev.filter((item) => item.productId !== productId);
      localStorage.setItem('qgadget_cart', JSON.stringify(filtered));
      return filtered;
    });
  };

  // Form check and submit completed pipeline
  const handleCheckoutComplete = async (orderDetails: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    // 1. Generate Invoice ID
    const nextRef = `QAR-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...orderDetails,
      id: nextRef,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // 2. Commit to database locally
    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    localStorage.setItem('qgadget_orders', JSON.stringify(nextOrders));

    // 3. Deduct stock levels in products
    const nextProducts = products.map((p) => {
      const purchased = orderDetails.items.find((item) => item.productId === p.id);
      if (purchased) {
        return { ...p, stock: Math.max(0, p.stock - purchased.quantity) };
      }
      return p;
    });
    handleUpdateProducts(nextProducts);

    // 4. Empty local cart
    setCart([]);
    localStorage.removeItem('qgadget_cart');

    // 5. Hide drawer panel
    setIsCartOpen(false);

    // 6. Show receipt pop
    setConfirmedOrder(newOrder);

    // 7. POST order directly to backend
    try {
      const resp = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (resp.ok) {
        const result = await resp.json();
        if (result.products) {
          setProducts(result.products);
          localStorage.setItem('qgadget_products', JSON.stringify(result.products));
        }
      }
    } catch (err) {
      console.error('Failed to register checkout order with backend database', err);
    }
  };

  // Filter products by searching strings & category selections
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;
      const lowerQuery = searchQuery.toLowerCase();
      const stringMatch =
        p.name.toLowerCase().includes(lowerQuery) ||
        p.nameAr.includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.descriptionAr.includes(lowerQuery);
      return categoryMatch && stringMatch;
    });
  }, [products, selectedCategory, searchQuery]);

  const exportOrderPDF = (order: Order) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Colors matching the styling of Qatar Digital Gadgets (#8A1538 maroon)
      const maroonColor = [138, 21, 56]; 
      const darkColor = [15, 23, 42];
      const lightGray = [241, 245, 249];

      doc.setProperties({
        title: `QG-Receipt-${order.id}`,
        subject: 'Invoice Receipt',
        creator: 'Qatar Digital Gadgets'
      });

      // Top Header Visual Bar
      doc.setFillColor(maroonColor[0], maroonColor[1], maroonColor[2]);
      doc.rect(0, 0, 210, 15, 'F');

      // Title & Subtitle Branding
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(maroonColor[0], maroonColor[1], maroonColor[2]);
      doc.text('QATAR DIGITAL GADGETS', 15, 32);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(115, 115, 115);
      doc.text('Premium Consumer Electronics & Custom Peripherals', 15, 38);

      // Meta Info (Right-aligned context)
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('ORDER RECEIPT', 140, 32);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(115, 115, 115);
      doc.text(`Order ID: #${order.id}`, 140, 38);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 43);

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(15, 48, 195, 48);

      // Customer credentials & shipping target
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(maroonColor[0], maroonColor[1], maroonColor[2]);
      doc.text('CUSTOMER INFORMATION', 15, 56);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(`Name: ${order.customerName}`, 15, 62);
      doc.text(`Phone: +974 ${order.customerPhone}`, 15, 67);
      doc.text(`Email: ${order.customerEmail}`, 15, 72);

      // Delivery data
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(maroonColor[0], maroonColor[1], maroonColor[2]);
      doc.text('DELIVERY LOGISTICS', 115, 56);

      const matchedMuni = QATAR_MUNICIPALITIES.find((m) => m.id === order.municipality);
      const deliveryTimeStr = matchedMuni?.deliveryTime || '1-2 Days';
      const muniStr = matchedMuni?.name || order.municipality;

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(`Municipality: ${muniStr}`, 115, 62);
      doc.text(`Address: ${order.deliveryAddress}`, 115, 67);
      doc.text(`Window: ${deliveryTimeStr}`, 115, 72);

      // Table Header of Purchased Products
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 78, 195, 78);

      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(15, 84, 180, 8, 'F');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('Item / Gadget Name', 18, 89);
      doc.text('Qty', 115, 89);
      doc.text('Unit Price', 135, 89);
      doc.text('Total', 165, 89);

      let itemY = 98;
      order.items.forEach((item, index) => {
        if (index % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(15, itemY - 4, 180, 6.5, 'F');
        }
        
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text(item.name, 18, itemY);
        doc.text(String(item.quantity), 115, itemY);
        doc.text(`QAR ${item.price.toLocaleString()}`, 135, itemY);
        doc.setFont('Helvetica', 'bold');
        doc.text(`QAR ${(item.price * item.quantity).toLocaleString()}`, 165, itemY);

        itemY += 7.5;
      });

      doc.setDrawColor(226, 232, 240);
      doc.line(15, itemY, 195, itemY);
      itemY += 6;

      // Price Calculations alignment on the rightside
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(115, 115, 115);

      doc.text('Subtotal:', 120, itemY);
      doc.text(`QAR ${order.subtotal.toLocaleString()}`, 165, itemY);
      itemY += 5;

      if (order.discountAmount > 0) {
        doc.setTextColor(16, 185, 129); // green color
        doc.text('Discount:', 120, itemY);
        doc.text(`- QAR ${order.discountAmount.toLocaleString()}`, 165, itemY);
        itemY += 5;
      }

      doc.setTextColor(115, 115, 115);
      doc.text('Delivery Fee:', 120, itemY);
      doc.text(`QAR ${order.deliveryFee.toLocaleString()}`, 165, itemY);
      itemY += 6;

      // Outer total summary rectangle
      doc.setFillColor(254, 242, 244);
      doc.rect(118, itemY - 4.5, 77, 8, 'F');
      doc.setDrawColor(maroonColor[0], maroonColor[1], maroonColor[2]);
      doc.rect(118, itemY - 4.5, 77, 8, 'S');

      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(maroonColor[0], maroonColor[1], maroonColor[2]);
      doc.text('Total Paid Amount:', 121, itemY + 1);
      doc.text(`QAR ${order.total.toLocaleString()}`, 165, itemY + 1);

      // Footnote greeting at the bottom
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Shukran / Thank you for shopping with Qatar Digital Gadgets!', 105, 275, { align: 'center' });
      doc.text('Website support & inquiries: ops@digitalgadgets.qa | Corniche - Doha', 105, 280, { align: 'center' });

      // Save output
      doc.save(`Invoice_Receipt_${order.id}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF receipt', err);
    }
  };

  return (
    <div id="qatar-gadgets-root" className="min-h-screen bg-zinc-50 font-sans selection:bg-[#feee00]/55 selection:text-zinc-950">
      
      {/* 1. noon.com structured Header Banner */}
      <header id="qatar-noon-header" className="sticky top-0 z-40 bg-white border-b border-zinc-200/80 shadow-xs">
        
        {/* Tier 1: Utility Ribbon (Noon grey/white delivery indicator bar) */}
        <div className="bg-zinc-50 border-b border-zinc-250/50 py-1.5 px-4 text-[10px] md:text-11px text-zinc-500 font-sans select-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Delivery address status indicator */}
            <div 
              className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-950 transition-colors" 
              onClick={() => setIsCartOpen(true)}
              title={isRtl ? 'تعديل بلدية التوصيل' : 'Change delivery municipality'}
            >
              <MapPin className="h-3.5 w-3.5 text-zinc-950" />
              <span>
                {isRtl ? 'يوصل إلى' : 'Deliver to'} <strong className="text-zinc-900 font-bold underline decoration-zinc-400 decoration-dotted">{isRtl ? 'الدوحة، قطر' : 'Doha, Qatar'}</strong>
              </span>
              <ChevronDown className="h-3 w-3 text-zinc-455" />
            </div>

            {/* Middle Noon-style flash promo teaser */}
            <div className="hidden lg:flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#8A1538] uppercase animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8A1538]"></span>
              <span>{isRtl ? 'تخفيضات العنابي الكبرى: أدخل كوبون "QATAR"' : 'GRAND QATAR SALE ACTIVE! INSERT PROMO CODE: QATAR'}</span>
            </div>

            {/* Language switches and orders tracker navigation shortcuts */}
            <div className="flex items-center gap-4">
              <LanguageToggle
                currentLang={currentLang}
                onToggle={() => setCurrentLang((prev) => (prev === 'en' ? 'ar' : 'en'))}
              />
              
              <button 
                onClick={() => {
                  setCurrentView('tracking');
                  setIsCartOpen(false);
                }}
                className="hover:text-zinc-950 transition-colors cursor-pointer flex items-center gap-1.5 font-medium leading-none"
              >
                <Truck className="h-3.5 w-3.5 text-[#8A1538]" />
                <span>{isRtl ? 'طلب تتبع' : 'Track Orders'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Tier 2: Noon Patent Yellow Strip with Logo, Central Prominent Search, and Cart actions */}
        <div className="bg-[#feee00] py-3 px-4 text-zinc-950">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            
            {/* noon-style logo representation */}
            <div 
              className="flex items-center gap-2 cursor-pointer shrink-0"
              onClick={() => {
                setCurrentView('store');
                setSelectedCategory('All');
              }}
            >
              <div className="bg-black text-[#feee00] px-3.5 py-1.5 rounded-sm font-sans font-black text-sm md:text-base tracking-tighter uppercase select-none">
                {isRtl ? 'نون إلكترونيات' : 'noon gadgets'}
              </div>
              <div className="hidden sm:block leading-none">
                <span className="text-[9px] font-mono tracking-widest text-black/80 font-black uppercase">QATAR</span>
              </div>
            </div>

            {/* Patent Noon prominent wide search input field with center alignment */}
            <div className="flex-1 max-w-2xl w-full mx-1 md:mx-6">
              <div className="relative w-full shadow-2xs">
                <Search className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-2.5 h-4.5 w-4.5 text-zinc-450 pointer-events-none`} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full text-xs ${isRtl ? 'pl-4 pr-11' : 'pl-11 pr-4'} py-2.5 bg-white border border-transparent rounded-xs focus:outline-none focus:ring-1 focus:ring-black text-zinc-900 shadow-inner font-sans tracking-tight`}
                />
              </div>
            </div>

            {/* Quick user panel credentials & direct shopping bag selectors */}
            <div className="flex items-center gap-3 md:gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t border-black/5 pt-2 md:pt-0 md:border-0">
              
              {/* User authentication portal details */}
              <div className="flex items-center gap-2">
                {currentUser ? (
                  <div id="active-user-session-badge" className="flex items-center gap-2 bg-transparent">
                    <div className={`h-6 w-6 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-mono font-bold uppercase shrink-0`}>
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <div className="flex flex-col text-left rtl:text-right leading-none shrink-0">
                      <span className="text-[8px] text-zinc-800 tracking-tight block uppercase leading-none">{isRtl ? 'أهلاً بك،' : 'Hello,'}</span>
                      <span className="text-[10px] font-bold text-zinc-900 max-w-[80px] truncate block leading-none mt-0.5">{currentUser.fullName}</span>
                    </div>
                    <button
                      id="user-logout-trigger-btn"
                      onClick={async () => {
                        setCurrentUser(null);
                        localStorage.removeItem('qgadget_user');
                        if (currentView === 'admin') {
                          setCurrentView('store');
                        }
                        try {
                          await fetch('/api/auth/logout', { method: 'POST' });
                        } catch (e) {
                          console.warn('Backend logout call failed:', e);
                        }
                      }}
                      className="p-1 hover:text-[#8A1538] text-zinc-800 hover:bg-white/40 rounded transition-all shrink-0 cursor-pointer"
                      title={isRtl ? 'تسجيل الخروج' : 'Log Out'}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    id="header-login-trigger"
                    onClick={() => setIsAuthOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded hover:bg-black/5 transition-all text-xs font-bold text-zinc-900 cursor-pointer active:scale-95"
                    title={isRtl ? 'تسجيل الدخول' : 'Sign In'}
                  >
                    <UserIcon className="h-4 w-4 text-zinc-900" />
                    <span>{isRtl ? 'تسجيل الدخول' : 'Login'}</span>
                  </button>
                )}
              </div>

              {/* View Switches & Administrative core triggers */}
              <div className="flex items-center gap-2">
                {currentView !== 'store' && (
                  <button
                    onClick={() => {
                      setCurrentView('store');
                      setIsCartOpen(false);
                      setSelectedProductForModal(null);
                    }}
                    className="px-2.5 py-1.5 rounded bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-mono tracking-wider uppercase transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="h-3 w-3" />
                    <span>{isRtl ? 'المتجر الإلكتروني' : 'Store'}</span>
                  </button>
                )}

                {currentView !== 'admin' && (!currentUser || currentUser.role !== 'customer') && (
                  <button
                    onClick={() => {
                      setCurrentView('admin');
                      setIsCartOpen(false);
                      setSelectedProductForModal(null);
                    }}
                    className="px-2.5 py-1.5 rounded bg-black text-[#feee00] hover:bg-zinc-900 text-[10px] font-mono tracking-wider uppercase transition-all flex items-center gap-1 cursor-pointer animate-pulse border border-[#feee00]/20"
                  >
                    <SlidersHorizontal className="h-3 w-3" />
                    <span>{isRtl ? 'التاجر' : 'Vendor'}</span>
                  </button>
                )}

                {/* noon custom white-cart-box wrapper trigger */}
                <button
                  id="shopping-cart-badge-trigger"
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center gap-2 px-3 py-1.5 bg-white border border-transparent hover:border-black rounded-xs shadow-xs hover:shadow-sm transition-all duration-200 active:scale-95 h-9 bg-white cursor-pointer select-none text-zinc-950 font-sans"
                  aria-label="Open Cart"
                >
                  <div className="relative">
                    <ShoppingBag className="h-4.5 w-4.5 text-zinc-900" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-black text-[#feee00] text-[8px] font-black rounded-full h-3.5 w-3.5 flex items-center justify-center animate-bounce">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold tracking-tight hidden sm:inline">{isRtl ? 'العربة' : 'Cart'}</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Tier 3: Category horizontal row sub-navigation (Noon style departments) */}
        <div className="bg-white border-b border-zinc-200/50 py-2 px-4 font-sans text-xs relative z-40">
          <div className="max-w-7xl mx-auto flex items-center gap-6 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            
            {/* Elegant Dropdown department trigger */}
            <div className="relative">
              <button 
                onClick={() => setIsHeaderCategoryDropdownOpen(!isHeaderCategoryDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-lg font-bold cursor-pointer transition-all border border-zinc-200/60 active:scale-95"
              >
                <Grid className="h-3.5 w-3.5 text-zinc-800" />
                <span>{isRtl ? 'تصفح الأقسام' : 'Browse Departments'}</span>
                <ChevronDown className={`h-3 w-3 text-zinc-600 transition-transform duration-200 ${isHeaderCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Header Dropdown Menu Overlay */}
              <AnimatePresence>
                {isHeaderCategoryDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-45 bg-zinc-900/10 backdrop-blur-xs" 
                      onClick={() => setIsHeaderCategoryDropdownOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute ${isRtl ? 'right-0' : 'left-0'} mt-2 w-80 bg-white rounded-xl shadow-2xl border border-zinc-200/80 p-4 z-50 text-zinc-800 grid grid-cols-1 gap-1.5`}
                    >
                      <div className="border-b border-zinc-100 pb-2 mb-1.5 flex items-center justify-between">
                        <span className="font-bold text-xs text-zinc-500 tracking-wider uppercase">{isRtl ? 'تصفح الأقسام والمنتجات' : 'SHOP BY DEPARTMENT'}</span>
                        <span className="text-[10px] font-mono text-zinc-400 font-bold">{productCategories.length} {isRtl ? 'قسم' : 'Hubs'}</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setCurrentView('store');
                          setSelectedCategory('All');
                          setIsHeaderCategoryDropdownOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full p-2 rounded-lg text-left transition-all ${
                          selectedCategory === 'All' ? 'bg-[#feee00]/20 text-zinc-950 font-semibold' : 'hover:bg-zinc-50'
                        }`}
                      >
                        <div className="bg-zinc-100 text-zinc-700 p-1.5 rounded-md border border-zinc-200 flex items-center justify-center shrink-0">
                          <Grid className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'جميع المنتجات المتوفرة' : 'Show All Available Products'}</div>
                          <div className={`text-[9px] text-zinc-400 capitalize ${isRtl ? 'text-right' : 'text-left'}`}>
                            {isRtl ? 'شاهد كل مخزون قطر الرقمي الفاخر' : 'Explore the full premium catalog'}
                          </div>
                        </div>
                      </button>

                      {productCategories.map((cat) => {
                        const count = products.filter(p => p.category === cat).length;
                        const samplePr = products.find((p) => p.category === cat);
                        const meta = CATEGORY_META[cat] || { icon: Tag, color: 'text-zinc-600 bg-zinc-50 border-zinc-100', descEn: 'Explore lifestyle smart options', descAr: 'استكشف الخيارات والتقنيات العصرية' };
                        const CatIcon = meta.icon;

                        return (
                          <button
                            key={cat}
                            onClick={() => {
                              setCurrentView('store');
                              setSelectedCategory(cat);
                              setIsHeaderCategoryDropdownOpen(false);
                              // Smooth scroll to catalog
                              const anchor = document.getElementById('products-list-anchor');
                              if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`flex items-center gap-3 w-full p-2 rounded-lg text-left transition-all cursor-pointer ${
                              selectedCategory === cat ? 'bg-zinc-900 text-white font-semibold' : 'hover:bg-zinc-50 text-zinc-800'
                            }`}
                          >
                            <div className={`p-1.5 rounded-md border flex items-center justify-center shrink-0 ${selectedCategory === cat ? 'bg-zinc-800 border-zinc-700 text-[#feee00]' : meta.color}`}>
                              <CatIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-xs font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>
                                {isRtl && samplePr ? samplePr.categoryAr : cat}
                              </div>
                              <div className={`text-[9px] truncate text-zinc-400 ${isRtl ? 'text-right' : 'text-left'}`}>
                                {isRtl ? meta.descAr : meta.descEn}
                              </div>
                            </div>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                              selectedCategory === cat ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-500'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* QUICK LINK: ALL */}
            <button
              onClick={() => {
                setCurrentView('store');
                setSelectedCategory('All');
              }}
              className={`hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer ${
                selectedCategory === 'All' && currentView === 'store' ? 'text-zinc-950 font-extrabold border-b-2 border-zinc-950 pb-0.5' : ''
              }`}
            >
              <span>{isRtl ? 'جميع المنتجات' : 'All Products'}</span>
            </button>

            {productCategories.slice(0, 4).map((cat) => {
              const samplePr = products.find((p) => p.category === cat);
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setCurrentView('store');
                    setSelectedCategory(cat);
                  }}
                  className={`hover:text-zinc-950 transition-colors cursor-pointer hidden sm:inline ${
                    selectedCategory === cat && currentView === 'store' ? 'text-zinc-950 font-extrabold border-b-2 border-zinc-950 pb-0.5' : ''
                  }`}
                >
                  {isRtl && samplePr ? samplePr.categoryAr : cat}
                </button>
              );
            })}

            <div className="flex-1"></div>

            {/* noon express promotional message */}
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
              <span className="bg-[#feee00] text-zinc-950 px-1.5 py-0.5 font-sans font-black text-[8px] rounded-xs border border-yellow-300">
                <span className="italic font-black text-black">noon</span> express
              </span>
              <span>{isRtl ? 'توصيل متاح لمختلف جهات الدوحة والريان' : 'Local Qatar Delivery'}</span>
            </div>

          </div>
        </div>

      </header>

      {/* 2. Customer Storefront Layout */}
      {currentView === 'store' ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in font-sans">
          
          {/* Hero Banner Component */}
          <Hero currentLang={currentLang} />

          {/* Bilingual Search input on Small / Mobile devices */}
          <div className="lg:hidden relative w-full">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3.5 h-4 w-4 text-zinc-400 pointer-events-none`} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs ${isRtl ? 'pl-4 pr-10' : 'pl-10 pr-4'} py-3.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 font-mono`}
            />
          </div>

          {/* Catalog Operations: Filtering & Grid list */}
          <div className="space-y-6 animate-fade-in">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200/60 pb-4">
              <div className="space-y-1">
                <h2 id="products-list-anchor" className="text-lg md:text-xl font-display font-medium text-zinc-950 tracking-tight leading-none uppercase">
                  {t.bestSellers}
                </h2>
                <p className="text-xs text-zinc-400 font-light">
                  {isRtl ? 'تصفح تشكيلتنا المجهزة بأرقى قطع وضمانات الاستخدام' : 'Refined quality collection matching our Qatar clienteles expectations'}
                </p>
              </div>

              {/* Grid count indicators */}
              <span className="text-[10px] uppercase font-medium text-zinc-400 font-mono tracking-widest leading-none">
                {filteredProducts.length} {isRtl ? 'منتجاً تم العثور عليه' : 'devices discovered'}
              </span>
            </div>

            {/* Interactive Responsive Filter Deck (Horizontal + Dropdown Selection) */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-zinc-50/70 p-4 rounded-2xl border border-zinc-200/50">
              
              {/* Category Dropdown Picker Component */}
              <div className="relative flex-1 md:max-w-xs">
                <label className="block text-[9px] uppercase tracking-wider font-extrabold text-zinc-400 mb-1.5 font-mono">
                  {isRtl ? 'تصفية حسب سريعة الأقسام' : 'Filter by Department'}
                </label>
                
                <button
                  onClick={() => setIsCatalogCategoryDropdownOpen(!isCatalogCategoryDropdownOpen)}
                  className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-zinc-200 hover:border-zinc-950 transition-all cursor-pointer rounded-xl shadow-xs focus:ring-1 focus:ring-zinc-950 active:scale-98"
                >
                  <div className="flex items-center gap-2.5">
                    {(() => {
                      if (selectedCategory === 'All') {
                        return (
                          <>
                            <div className="p-1 bg-zinc-100 rounded-lg text-zinc-900 flex items-center justify-center shrink-0">
                              <Grid className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-bold text-zinc-900">{isRtl ? 'جميع الأقسام الفاخرة' : 'All Departments'}</span>
                          </>
                        );
                      }
                      const meta = CATEGORY_META[selectedCategory] || { icon: Tag, color: 'text-zinc-600 bg-zinc-50 border-zinc-100' };
                      const ActiveIcon = meta.icon;
                      const samplePr = products.find((p) => p.category === selectedCategory);
                      return (
                        <>
                          <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${meta.color}`}>
                            <ActiveIcon className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-semibold text-zinc-900">
                            {isRtl && samplePr ? samplePr.categoryAr : selectedCategory}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${isCatalogCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Options list overlay */}
                <AnimatePresence>
                  {isCatalogCategoryDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsCatalogCategoryDropdownOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute ${isRtl ? 'right-0' : 'left-0'} mt-2 w-full min-w-[280px] bg-white rounded-xl shadow-2xl border border-zinc-200/80 p-2 z-50 text-zinc-800 flex flex-col gap-1 max-h-80 overflow-y-auto`}
                      >
                        <button
                          onClick={() => {
                            setSelectedCategory('All');
                            setIsCatalogCategoryDropdownOpen(false);
                          }}
                          className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-all text-left cursor-pointer ${
                            selectedCategory === 'All' ? 'bg-zinc-900 text-white font-semibold' : 'hover:bg-zinc-50'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${selectedCategory === 'All' ? 'bg-zinc-800 border-zinc-700 text-[#feee00]' : 'bg-zinc-100 border-zinc-200 text-zinc-700'}`}>
                            <Grid className="h-4 w-4" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className={`text-xs font-bold ${isRtl ? 'text-right overflow-hidden truncate' : 'text-left'}`}>{isRtl ? 'جميع الأقسام الفاخرة' : 'All Departments'}</div>
                            <div className={`text-[9px] text-zinc-450 ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'شاهد كل المخزون المتاح في المتجر' : 'Display all premium items'}</div>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md shrink-0 ${selectedCategory === 'All' ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-105 text-zinc-500 bg-zinc-100'}`}>
                            {products.length}
                          </span>
                        </button>

                        {productCategories.map((cat) => {
                          const count = products.filter(p => p.category === cat).length;
                          const samplePr = products.find((p) => p.category === cat);
                          const meta = CATEGORY_META[cat] || { icon: Tag, color: 'text-zinc-600 bg-zinc-50 border-zinc-100', descEn: 'Explore technology options', descAr: 'استكشف التشكيلات الذكية' };
                          const CatIcon = meta.icon;

                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                setSelectedCategory(cat);
                                setIsCatalogCategoryDropdownOpen(false);
                              }}
                              className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-all text-left cursor-pointer ${
                                selectedCategory === cat ? 'bg-zinc-900 text-white font-semibold' : 'hover:bg-zinc-50 text-zinc-800'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${selectedCategory === cat ? 'bg-zinc-800 border-zinc-700 text-[#feee00]' : meta.color}`}>
                                <CatIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <div className={`text-xs font-bold truncate ${isRtl ? 'text-right' : 'text-left'}`}>
                                  {isRtl && samplePr ? samplePr.categoryAr : cat}
                                </div>
                                <div className={`text-[9px] truncate text-zinc-400 ${isRtl ? 'text-right' : 'text-left'}`}>
                                  {isRtl ? meta.descAr : meta.descEn}
                                </div>
                              </div>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md shrink-0 ${selectedCategory === cat ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-500'}`}>
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Fast-access Horizontal tag pills styled for lightning-fast click actions on large screens */}
              <div className="flex-1 overflow-x-auto scrollbar-none flex items-center gap-2 py-1 lg:justify-end select-none">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer border ${
                    selectedCategory === 'All'
                      ? 'bg-zinc-950 border-zinc-950 text-white shadow-xs font-bold'
                      : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-950 hover:text-zinc-950'
                  }`}
                >
                  {isRtl ? 'كل المنتجات' : 'ALL COLLECTION'}
                </button>

                {productCategories.map((cat) => {
                  const samplePr = products.find((p) => p.category === cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer border ${
                        selectedCategory === cat
                          ? 'bg-zinc-950 border-zinc-950 text-white shadow-xs font-semibold'
                          : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-950 hover:text-zinc-950'
                      }`}
                    >
                      {isRtl && samplePr ? samplePr.categoryAr : cat}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Catalog Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 py-16 px-6 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                  <Search className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800">
                    {isRtl ? 'البحث لم يسفر عن نتائج' : 'No Devices Discovered'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                    {isRtl 
                      ? 'يرجى مراجعة التهجئة أو استخدام فئات تصفح أخرى للاطلاع على المخزن.' 
                      : 'Try refactoring search words or choosing different categories.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currentLang={currentLang}
                    onAddToCart={handleAddToCart}
                    onOpenDetails={(p) => setSelectedProductForModal(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      ) : currentView === 'tracking' ? (
        <UserTracker
          orders={orders}
          currentLang={currentLang}
          onBackToStore={() => setCurrentView('store')}
          onRefresh={fetchAllData}
          isRefreshing={isRefreshingOrders}
        />
      ) : (
        /* Merchant admin portal */
        currentUser && currentUser.role === 'vendor' ? (
          <AdminPanel
            products={products}
            orders={orders}
            promos={promos}
            currentLang={currentLang}
            onUpdateProducts={handleUpdateProducts}
            onUpdateOrders={handleUpdateOrders}
            onUpdatePromos={handleUpdatePromos}
          />
        ) : (
          <div id="unauthorized-merchant-view" className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
            <div className="bg-white rounded-3xl border border-rose-100 p-8 shadow-md space-y-4">
              <div className="h-14 w-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <ShieldAlert className="h-7 w-7 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  {isRtl ? 'بوابة إدارة التاجر مقيدة ومحمية' : 'Merchant Access Restricted'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  {isRtl
                    ? 'الوصول إلى لوحة التحكم وتحليلات المبيعات وتعديل الأسعار يتطلب حساب تاجر مصادق عليه.'
                    : 'Viewing live inventory levels, coupons, and sales pipeline logs requires authorized vendor clearance.'}
                </p>
              </div>

              {/* Login actions in Access Denied screen */}
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  id="admin-auth-fallback-login-btn"
                  onClick={() => setIsAuthOpen(true)}
                  className="w-full py-3 bg-[#8A1538] hover:bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-97 shadow-md cursor-pointer"
                >
                  {isRtl ? 'تسجيل دخول كتاجر الآن' : 'Log In with Vendor Credentials'}
                </button>
                <button
                  id="admin-auth-fallback-home-btn"
                  onClick={() => setCurrentView('store')}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {isRtl ? 'العودة لواجهة المتجر' : 'Return to General Storefront'}
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {/* 3. Global Footer Banner info details */}
      <footer className="bg-zinc-950 text-white mt-16 py-12 border-t border-zinc-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Identity details */}
          <div className="space-y-4 font-sans">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#feee00] text-black font-sans font-black rounded-sm flex items-center justify-center select-none text-xs tracking-tighter border border-[#feee00]/50">
                noon
              </div>
              <span className="text-sm font-sans font-bold uppercase tracking-widest text-[#feee00]">
                {t.brandName}
              </span>
            </div>
            <p className="text-11px text-zinc-400 leading-relaxed font-light">
              {isRtl 
                ? 'الوجهة الفاخرة المعتمدة في دولة قطر لأرقى الأجهزة الذكية والأجهزة الطرفية المخصصة. ملتزمون بتوزيع فائق السرعة وجودة تليق بتطلعات عملائنا.'
                : 'Qatars registered single-vendor premium electronics destination. Backed with instant localized municipality shipping pipelines and full coverage warranty.'}
            </p>
          </div>

          {/* Quick links & areas */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              {isRtl ? 'مناطق التوصيل السريع لقطر' : 'Our Distribution Footprint'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-11px text-zinc-350">
              {QATAR_MUNICIPALITIES.slice(0, 6).map((muni) => (
                <div key={muni.id} className="flex items-center gap-2 font-light">
                  <div className="h-1 w-1 bg-[#feee00] rounded-none"></div>
                  <span>{isRtl ? muni.nameAr : muni.name.split('/')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              {isRtl ? 'قنوات تواصل عملاء الدوحة' : 'Doha Support Desk'}
            </h4>
            <ul className="space-y-2.5 text-11px text-zinc-350 font-light">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#feee00]" />
                <span className="font-mono tracking-wide">+974 4455 9900</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#feee00]" />
                <span className="font-mono tracking-wide">ops@digitalgadgets.qa</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#feee00]" />
                <span>Corniche Street, Zone 60, Doha, Qatar</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-zinc-850 text-center text-[10px] text-zinc-500 font-mono tracking-wide uppercase">
          <p>© {new Date().getFullYear()} {isRtl ? 'قطر للإلكترونيات الرقمية. جميع الحقوق محفوظة.' : 'Qatar Digital Gadgets. All rights reserved.'}</p>
        </div>
      </footer>

      {/* 4. Sliding Cart Drawer overlay trigger */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        products={products}
        promos={promos}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentLang={currentLang}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckoutComplete={handleCheckoutComplete}
      />

      {/* 5. Immersive Product specs pop dialog */}
      <ProductDetailsModal
        product={selectedProductForModal}
        currentLang={currentLang}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
        currentUser={currentUser}
        onProductUpdated={(updatedProduct) => {
          setSelectedProductForModal(updatedProduct);
          const updatedProducts = products.map((p) => p.id === updatedProduct.id ? updatedProduct : p);
          setProducts(updatedProducts);
          localStorage.setItem('qgadget_products', JSON.stringify(updatedProducts));
        }}
      />

      {/* 6. High-fidelity Interactive Success Invoice modal */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col p-6 md:p-8 space-y-6 relative max-h-[90vh] md:max-h-[85vh]">
            
            {/* Stamp logo icon */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                <Check className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-black text-slate-950 tracking-tight leading-none uppercase">
                {t.orderCompletedTitle}
              </h2>
              <span className="text-[10px] bg-slate-100 font-mono font-bold text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider mt-1.5 block">
                {t.orderNo}: #{confirmedOrder.id}
              </span>
            </div>

            {/* Receipt Summary body */}
            <div className="space-y-4 text-xs overflow-y-auto pr-1">
              <p className="text-center text-slate-500 leading-relaxed font-normal">
                {t.orderCompletedDesc}
              </p>

              {/* Delivery info segment */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#8A1538] block">
                  {isRtl ? 'تفاصيل ومعلومات التوصيل لقطر' : 'Delivery Destination Credentials'}
                </span>
                
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">{t.buyerName}:</span>
                    <span className="font-bold text-slate-900">{confirmedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">{t.buyerPhone}:</span>
                    <span className="font-bold text-slate-900 font-mono">+974 {confirmedOrder.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">{t.buyerEmail}:</span>
                    <span className="font-medium text-slate-900 truncate max-w-[150px]">{confirmedOrder.customerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">{isRtl ? 'البلدية المستهدفة' : 'Qatar Municipality'}:</span>
                    <span className="font-bold text-slate-900">
                      {isRtl 
                        ? QATAR_MUNICIPALITIES.find((m) => m.id === confirmedOrder.municipality)?.nameAr
                        : QATAR_MUNICIPALITIES.find((m) => m.id === confirmedOrder.municipality)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">{isRtl ? 'عنوان الشارع' : 'Street Line'}:</span>
                    <span className="font-medium text-slate-900 max-w-[180px] text-right truncate">
                      {confirmedOrder.deliveryAddress}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">{t.estimateDelivery}:</span>
                    <span className="font-black text-emerald-600">
                      {isRtl 
                        ? QATAR_MUNICIPALITIES.find((m) => m.id === confirmedOrder.municipality)?.deliveryTimeAr
                        : QATAR_MUNICIPALITIES.find((m) => m.id === confirmedOrder.municipality)?.deliveryTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items detail list */}
              <div className="border-t border-b border-dashed border-slate-200 py-3 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                  {isRtl ? 'القطع والمنتجات المشتراة' : 'Doha Sourced Gadgets'}
                </span>

                <div className="space-y-1.5">
                  {confirmedOrder.items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-slate-800">
                      <span>
                        {isRtl ? item.nameAr : item.name} <span className="text-slate-400 font-bold font-mono">x{item.quantity}</span>
                      </span>
                      <span className="font-mono font-semibold">
                        QAR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Math summaries */}
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>{t.cartSubtotal}</span>
                  <span className="font-medium text-slate-900">QAR {confirmedOrder.subtotal.toLocaleString()}</span>
                </div>
                {confirmedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>{t.cartDiscount}</span>
                    <span>- QAR {confirmedOrder.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t.cartShipping}</span>
                  <span className="font-medium text-slate-900">QAR {confirmedOrder.deliveryFee}</span>
                </div>
                <div className="flex justify-between text-slate-950 pt-1.5 border-t border-slate-100 font-black">
                  <span>{t.cartTotal}</span>
                  <span className="text-[#8A1538]">QAR {confirmedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Close actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2 font-mono">
              <div className="flex gap-2">
                <button
                  id="print-invoice-btn"
                  onClick={() => {
                    window.print();
                  }}
                  className="p-3 border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-100 transition-all rounded-lg text-zinc-700 font-medium cursor-pointer"
                  title="Print digital invoice"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  id="pdf-download-btn"
                  onClick={() => exportOrderPDF(confirmedOrder)}
                  className="p-3 border border-zinc-200 hover:border-[#8A1538] hover:bg-[#8A1538]/5 transition-all rounded-lg text-[#8A1538] flex items-center justify-center cursor-pointer"
                  title={isRtl ? 'تحميل كملف PDF' : 'Download PDF Receipt'}
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setConfirmedOrder(null);
                    setCurrentView('tracking');
                  }}
                  className="px-4 py-3 bg-[#8A1538]/10 text-[#8A1538] hover:bg-[#8A1538]/20 transition-all rounded-lg text-[10px] tracking-wider uppercase font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Truck className="h-4 w-4" />
                  <span>{isRtl ? 'تتبع حالة الشحنة' : 'Track Status Live'}</span>
                </button>
              </div>
              <button
                onClick={() => setConfirmedOrder(null)}
                className="flex-1 py-3 bg-zinc-900 border border-zinc-900 hover:bg-[#8A1538] hover:border-[#8A1538] text-white rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all text-center cursor-pointer active:scale-97 text-xs"
              >
                {t.continueShopping}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal Portal Overlay */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem('qgadget_user', JSON.stringify(user));
        }}
        currentLang={currentLang}
      />
    </div>
  );
}
