/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Ticket,
  ChevronDown,
  RotateCcw,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Hash,
  Database,
  BarChart4,
  Briefcase,
  DollarSign
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Product, Order, PromoCode, QATAR_MUNICIPALITIES } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  promos: PromoCode[];
  currentLang: 'en' | 'ar';
  onUpdateProducts: (updated: Product[]) => void;
  onUpdateOrders: (updated: Order[]) => void;
  onUpdatePromos: (updated: PromoCode[]) => void;
}

export default function AdminPanel({
  products,
  orders,
  promos,
  currentLang,
  onUpdateProducts,
  onUpdateOrders,
  onUpdatePromos,
}: AdminPanelProps) {
  const isRtl = currentLang === 'ar';
  const t = TRANSLATIONS[currentLang];

  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'orders' | 'promos'>('dashboard');

  // Product CRUD states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New product form states
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [category, setCategory] = useState('Smartphones');
  const [categoryAr, setCategoryAr] = useState('الهواتف الذكية');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [image, setImage] = useState('');
  const [specs, setSpecs] = useState('');
  const [specsAr, setSpecsAr] = useState('');

  // Coupon form states
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'percent' | 'fixed'>('percent');
  const [newPromoValue, setNewPromoValue] = useState<number>(0);
  const [newPromoMinSpend, setNewPromoMinSpend] = useState<number>(0);

  // Dynamic calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const successOrdersCount = orders.filter((o) => o.status === 'Delivered').length || 1;
  const averagePurchaseValue = totalRevenue / (orders.filter((o) => o.status !== 'Cancelled').length || 1);

  // Process chart data for sales trend representation over the last 30 days (grouped by date)
  const chartData = React.useMemo(() => {
    const dailyData: Record<string, number> = {};
    orders
      .filter((o) => o.status !== 'Cancelled')
      .forEach((order) => {
        // Format timestamp safely
        const dateStr = order.createdAt.split('T')[0] || order.createdAt;
        dailyData[dateStr] = (dailyData[dateStr] || 0) + order.total;
      });

    const result = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      
      const sales = dailyData[dateStr] || 0;
      
      // Shorten date for presentation (e.g. May 21)
      const formattedName = currentLang === 'ar'
        ? `${dd}/${mm}`
        : `${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getDate()}`;
        
      result.push({
        date: dateStr,
        name: formattedName,
        Revenue: sales,
      });
    }
    return result;
  }, [orders, currentLang]);

  // Handle manual inventory stock adjust
  const handleStockAdjust = (productId: string, delta: number) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        const nextStock = Math.max(0, p.stock + delta);
        return { ...p, stock: nextStock };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  const handlePriceAdjustKey = (productId: string, newPriceValue: number) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, price: Math.max(1, newPriceValue) };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  // Launch edit mode
  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setNameAr(product.nameAr);
    setDescription(product.description);
    setDescriptionAr(product.descriptionAr);
    setCategory(product.category);
    setCategoryAr(product.categoryAr);
    setPrice(product.price);
    setStock(product.stock);
    setImage(product.image);
    setSpecs(product.specs.join(', '));
    setSpecsAr(product.specsAr.join(', '));
    setIsAddingNew(false);
  };

  // Save edits or design new product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedSpecs = specs.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
    const formattedSpecsAr = specsAr.split(',').map((s) => s.trim()).filter((s) => s.length > 0);

    if (editingProduct) {
      // Update existing item
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name,
            nameAr,
            description,
            descriptionAr,
            category,
            categoryAr,
            price,
            stock,
            image,
            specs: formattedSpecs,
            specsAr: formattedSpecsAr,
          };
        }
        return p;
      });
      onUpdateProducts(updated);
      setEditingProduct(null);
    } else {
      // Create new one
      const newId = `prod-${Date.now()}`;
      const newProduct: Product = {
        id: newId,
        name,
        nameAr,
        description,
        descriptionAr,
        category,
        categoryAr,
        price,
        stock,
        image: image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
        rating: 5.0,
        reviewsCount: 1,
        featured: false,
        specs: formattedSpecs.length > 0 ? formattedSpecs : ['Premium Gadget Quality Config'],
        specsAr: formattedSpecsAr.length > 0 ? formattedSpecsAr : ['مواصفات ممتازة وجودة مدرجة'],
      };
      onUpdateProducts([newProduct, ...products]);
      setIsAddingNew(false);
    }

    // Reset fields
    setName('');
    setNameAr('');
    setDescription('');
    setDescriptionAr('');
    setCategory('Smartphones');
    setCategoryAr('الهواتف الذكية');
    setPrice(0);
    setStock(0);
    setImage('');
    setSpecs('');
    setSpecsAr('');
  };

  // Drop product item
  const handleDeleteProduct = (productId: string) => {
    if (confirm(isRtl ? 'هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً من قاعدة البيانات؟' : 'Are you sure you want to permanently delete this product from the listing?')) {
      const filtered = products.filter((p) => p.id !== productId);
      onUpdateProducts(filtered);
    }
  };

  // Modify simulated order delivery milestone
  const handleUpdateOrderStatus = (orderId: string, nextStatus: Order['status']) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        // If restoring stock from cancelled order
        const wasCancelled = o.status === 'Cancelled';
        const isCancelling = nextStatus === 'Cancelled';

        if (isCancelling && !wasCancelled) {
          // Re-add stocks back to products database
          const readdedProducts = products.map((p) => {
            const boughtItem = o.items.find((bi) => bi.productId === p.id);
            if (boughtItem) {
              return { ...p, stock: p.stock + boughtItem.quantity };
            }
            return p;
          });
          onUpdateProducts(readdedProducts);
        } else if (wasCancelled && !isCancelling) {
          // Deduct stocks back if restoring
          const deductedProducts = products.map((p) => {
            const boughtItem = o.items.find((bi) => bi.productId === p.id);
            if (boughtItem) {
              return { ...p, stock: Math.max(0, p.stock - boughtItem.quantity) };
            }
            return p;
          });
          onUpdateProducts(deductedProducts);
        }

        return { ...o, status: nextStatus };
      }
      return o;
    });
    onUpdateOrders(updated);
  };

  // Build coupon variables
  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    const codeUpper = newPromoCode.trim().toUpperCase();
    if (promos.some((p) => p.code === codeUpper)) {
      alert(isRtl ? 'كود الخصم هذا موجود بالفعل!' : 'This promo code already exists in the registry!');
      return;
    }

    const newCode: PromoCode = {
      code: codeUpper,
      type: newPromoType,
      value: newPromoValue,
      ...(newPromoMinSpend > 0 ? { minSpend: newPromoMinSpend } : {}),
    };

    onUpdatePromos([...promos, newCode]);
    setNewPromoCode('');
    setNewPromoValue(0);
    setNewPromoMinSpend(0);
  };

  // Delete coupon
  const handleDeletePromo = (code: string) => {
    onUpdatePromos(promos.filter((p) => p.code !== code));
  };

  // Get status color coding
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock className="h-3.5 w-3.5" /> };
      case 'Sourced':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Briefcase className="h-3.5 w-3.5" /> };
      case 'Out for Delivery':
        return { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: <Truck className="h-3.5 w-3.5" /> };
      case 'Delivered':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle className="h-3.5 w-3.5" /> };
      case 'Cancelled':
        return { bg: 'bg-red-50 text-red-700 border-red-200', icon: <XCircle className="h-3.5 w-3.5" /> };
    }
  };

  return (
    <div id="admin-workspace-base" className={`bg-slate-50 min-h-screen p-4 md:p-8 ${isRtl ? 'rtl text-right' : 'ltr text-left'}`}>
      
      {/* 2. Admin Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 shadow-xs">
        <div>
          <span className="text-[10px] bg-[#8A1538] text-white font-black px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1">
            <Database className="h-3 w-3" />
            {isRtl ? 'وضع المسؤول المنفرد' : 'Single Vendor Mode'}
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight mt-2 leading-none">
            {t.adminTitle}
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-1 leading-relaxed">
            {t.adminSubtitle}
          </p>
        </div>

        {/* Operational navigation rail */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl self-stretch md:self-auto justify-start">
          {(['dashboard', 'inventory', 'orders', 'promos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIsAddingNew(false);
                setEditingProduct(null);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition-all duration-200 flex-1 md:flex-initial ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab === 'dashboard'
                ? t.tabDashboard
                : tab === 'inventory'
                ? t.tabInventory
                : tab === 'orders'
                ? t.tabOrders
                : t.tabPromos}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Core Dashboard Mode */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Summary Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Box 1: Revenue */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide block">
                  {t.metricRevenue}
                </span>
                <span className="text-2xl font-black text-slate-950 tracking-tight block">
                  QAR {totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>

            {/* Box 2: Total Orders */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide block">
                  {t.metricOrders}
                </span>
                <span className="text-2xl font-black text-slate-950 tracking-tight block">
                  {orders.length}
                </span>
              </div>
              <div className="w-12 h-12 bg-[#8A1538]/5 rounded-xl flex items-center justify-center text-[#8A1538]">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>

            {/* Box 3: Average Order value */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide block">
                  {t.metricAverageOrder}
                </span>
                <span className="text-2xl font-black text-slate-950 tracking-tight block">
                  QAR {Math.round(averagePurchaseValue).toLocaleString()}
                </span>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>

            {/* Box 4: Low Stocks Alert */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide block">
                  {t.metricLowStock}
                </span>
                <span className={`text-2xl font-black tracking-tight block ${lowStockCount > 0 ? 'text-amber-600' : 'text-slate-950'}`}>
                  {lowStockCount}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Column */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <BarChart4 className="h-5 w-5 text-[#8A1538]" />
                  <h3 className="text-sm font-black text-slate-950 tracking-tight uppercase">
                    {t.latestSalesTrends}
                  </h3>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-tight">
                  {isRtl ? 'آخر ٣٠ يوماً' : 'Last 30 Days'}
                </span>
              </div>

              {/* Secure Graphic stage */}
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      minTickGap={15}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false}
                      tickFormatter={(v) => `${v}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                      labelStyle={{ fontWeight: 'bold', color: '#94a3b8' }}
                      formatter={(value: any) => [`QAR ${value.toLocaleString()}`, isRtl ? 'المبيعات' : 'Sales']}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconType="plainline" 
                      iconSize={14}
                      wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                    />
                    <Line 
                      name={isRtl ? 'مبيعات الأجهزة اليومية (ر.ق)' : 'Daily Gadget Sales (QAR)'}
                      type="monotone" 
                      dataKey="Revenue" 
                      stroke="#8A1538" 
                      strokeWidth={3} 
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Low Stocks & Critical warnings lists */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="text-sm font-black text-slate-950 tracking-tight uppercase">
                  {t.stockLevelAlert}
                </h3>
              </div>

              {lowStockCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                  <p className="text-xs font-semibold text-slate-800">
                    {isRtl ? 'جميع المنتجات لديها وحدات مخزون ممتازة!' : 'All stocks are fully replenished!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {products
                    .filter((p) => p.stock <= 5)
                    .map((product) => (
                      <div
                        key={product.id}
                        className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg bg-slate-100"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-950 line-clamp-1">
                              {isRtl ? product.nameAr : product.name}
                            </h4>
                            <span className="text-[10px] text-red-600 font-bold block">
                              {product.stock === 0 ? t.outOfStock : `${product.stock} ${isRtl ? 'وحدات متبقية' : 'units left'}`}
                            </span>
                          </div>
                        </div>

                        {/* Direct Stock replenishment togglers */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStockAdjust(product.id, 5)}
                            className="bg-white border border-slate-200 hover:border-slate-800 px-2.5 py-1 text-[10px] font-black rounded-lg transition-transform active:scale-95 text-slate-700"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => handleStockAdjust(product.id, 15)}
                            className="bg-[#8A1538] hover:bg-[#a11b44] text-white px-2.5 py-1 text-[10px] font-black rounded-lg transition-transform active:scale-95"
                          >
                            +15
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Recent order list on dashboard */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">
              {t.recentOrders}
            </h3>
            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">{t.noOrders}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">{t.orderId}</th>
                      <th className="py-3 px-4">{t.customer}</th>
                      <th className="py-3 px-4">{t.date}</th>
                      <th className={`py-3 px-4 ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'البلدية وقيمة الشحن' : 'Destination'}</th>
                      <th className="py-3 px-4 text-right">{t.cartTotal}</th>
                      <th className="py-3 px-4 text-center">{t.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => {
                      const badge = getStatusBadge(order.status);
                      const muni = QATAR_MUNICIPALITIES.find((m) => m.id === order.municipality);
                      return (
                        <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-600">#{order.id.slice(0, 8)}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-950">{order.customerName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{order.customerPhone}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-medium">{order.createdAt.split('T')[0]}</td>
                          <td className="py-3.5 px-4 text-slate-700">
                            <div className="font-semibold">{isRtl ? muni?.nameAr : muni?.name}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{order.deliveryAddress}</div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-extrabold text-[#8A1538]">QAR {order.total.toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wide ${badge.bg}`}>
                              {badge.icon}
                              <span>{isRtl ? (order.status === 'Pending' ? 'معلق' : order.status === 'Sourced' ? 'مجهز للتوصيل' : order.status === 'Out for Delivery' ? 'مع المندوب' : order.status === 'Delivered' ? 'تم التوصيل' : 'ملغي') : order.status}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Inventory control panel tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-base font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#8A1538]" />
              <span>{isRtl ? 'إدارة كتالوج المنتجات والمستودع' : 'Stock Logistics Registry'}</span>
            </h3>

            {!isAddingNew && !editingProduct && (
              <button
                onClick={() => setIsAddingNew(true)}
                className="px-4 py-2.5 bg-[#8A1538] hover:bg-[#a11b44] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>{t.addNewProduct}</span>
              </button>
            )}
          </div>

          {/* Product form stage (Edit/New) */}
          {(isAddingNew || editingProduct) && (
            <form onSubmit={handleSaveProduct} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6 shadow-md max-w-4xl mx-auto">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <span className="text-sm font-black text-slate-950 uppercase">
                  {editingProduct ? t.editProduct : t.addNewProduct}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingProduct(null);
                  }}
                  className="text-slate-400 hover:text-slate-800 text-xs font-bold"
                >
                  {t.cancel}
                </button>
              </div>

              {/* Title Fields English and Arabic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">{t.productNameEn} *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Titan Gaming Rig X"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 focus:border-slate-800 bg-slate-50/50 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5 text-right">
                  <label className="text-xs font-bold text-slate-700 block">{t.productNameAr} *</label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    placeholder="مثال: كمبيوتر ألعاب تايتان الفائق"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 focus:border-slate-800 bg-slate-50/50 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Description fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">{t.productDescEn} *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter thorough details of technical components, display parameters..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 focus:border-slate-800 bg-slate-50/50 rounded-lg focus:outline-none resize-none"
                  />
                </div>
                <div className="space-y-1.5 text-right">
                  <label className="text-xs font-bold text-slate-700 block">{t.productDescAr} *</label>
                  <textarea
                    rows={3}
                    required
                    dir="rtl"
                    placeholder="أدخل التفاصيل والخصائص الفنية والذكية للسلعة المعروضة..."
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 focus:border-slate-800 bg-slate-50/50 rounded-lg focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Pricing, Stocks, Classifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">{t.productCategory} *</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      // Auto-map simple category tags to Arabic counterpart
                      const mapping: Record<string, string> = {
                        'Smartphones': 'الهواتف الذكية',
                        'Wearables': 'الأجهزة القابلة للارتداء',
                        'Audio': 'الصوتيات والسمعيات',
                        'Displays': 'الشاشات واللوحات',
                        'Peripherals': 'الملحقات والأجهزة الطرفية',
                        'Consoles': 'منصات الألعاب والترفيه',
                        'Smart Home': 'الأجهزة المنزلية الذكية',
                        "Women's Collection": 'مجموعة الأناقة النسائية',
                        "Men's Fashion": 'الركن الرجالي',
                        'Kids & Baby': 'عالم الأطفال والرضع',
                        'Digital & Software': 'المنتدى الرقمي والاشتراكات',
                        'Home & Living': 'المنزل والديكور'
                      };
                      setCategoryAr(mapping[e.target.value] || 'أخرى');
                    }}
                    className="w-full text-xs p-2.5 border border-slate-200 focus:border-slate-800 bg-slate-50 rounded-lg focus:outline-none"
                  >
                    <option value="Smartphones">Smartphones</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Audio">Audio</option>
                    <option value="Displays">Displays</option>
                    <option value="Peripherals">Peripherals</option>
                    <option value="Consoles">Consoles</option>
                    <option value="Smart Home">Smart Home</option>
                    <option value="Women's Collection">Women's Collection</option>
                    <option value="Men's Fashion">Men's Fashion</option>
                    <option value="Kids & Baby">Kids & Baby</option>
                    <option value="Digital & Software">Digital & Software</option>
                    <option value="Home & Living">Home & Living</option>
                  </select>
                </div>

                <div className="space-y-1.5 bg-slate-50/50 rounded-xl p-2.5 border border-slate-100 flex flex-col justify-center">
                  <label className="text-xs font-bold text-slate-700 block">{t.productPrice} (QAR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full text-xs p-1 px-2 border border-slate-200 focus:border-slate-800 rounded-lg focus:outline-none bg-white font-bold"
                  />
                </div>

                <div className="space-y-1.5 bg-slate-50/50 rounded-xl p-2.5 border border-slate-100 flex flex-col justify-center">
                  <label className="text-xs font-bold text-slate-700 block">{t.productStock} *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock === undefined ? '' : stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full text-xs p-1 px-2 border border-slate-200 focus:border-slate-800 rounded-lg focus:outline-none bg-white font-bold"
                  />
                </div>
              </div>

              {/* Specs high points list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {t.productSpecsEn} <span className="text-[10px] text-slate-400">(Comma separated)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="CNC Titanium body, 120Hz display, Custom mechanical keys"
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 focus:border-slate-800 bg-slate-50/50 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5 text-right">
                  <label className="text-xs font-bold text-slate-700 block">
                    {t.productSpecsAr} <span className="text-[10px] text-slate-400">(مفصولة بفواصل)</span>
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="هيكل مائل متين، شاشة تصفح سريعة، مفاتيح آلية مريحة"
                    value={specsAr}
                    onChange={(e) => setSpecsAr(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 focus:border-slate-800 bg-slate-50/50 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Product Visual Asset image url */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">{t.productImage}</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 focus:border-slate-800 bg-slate-50/50 rounded-lg focus:outline-none"
                />
              </div>

              {/* Config submit action */}
              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-[#8A1538] text-white text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  {t.save}
                </button>
              </div>
            </form>
          )}

          {/* Listing Grid */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">{isRtl ? 'صورة وبطاقة المنتج' : 'Product Listing'}</th>
                    <th className="py-3 px-4">{isRtl ? 'التصنيف' : 'Classification'}</th>
                    <th className="py-3 px-4 text-center">{t.productPrice}</th>
                    <th className="py-3 px-4 text-center">{isRtl ? 'المخزون المتوفر' : 'Stock Inventory'}</th>
                    <th className="py-3 px-4 text-center">{t.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-cover rounded-lg bg-slate-50 border border-slate-100"
                        />
                        <div>
                          <div className="font-extrabold text-slate-950">{isRtl ? product.nameAr : product.name}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                            {isRtl ? product.descriptionAr : product.description}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold text-[10px] tracking-wide">
                          {isRtl ? product.categoryAr : product.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-slate-900">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 font-normal">QAR</span>
                          <input
                            type="number"
                            value={product.price || ''}
                            onChange={(e) => handlePriceAdjustKey(product.id, Number(e.target.value))}
                            className="w-16 text-center text-xs font-extrabold border border-transparent hover:border-slate-200 focus:border-slate-800 rounded-sm focus:outline-none h-6 pb-0.5"
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStockAdjust(product.id, -1)}
                            disabled={product.stock === 0}
                            className="bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 px-2 py-0.5 font-black text-xs rounded-lg transition-transform active:scale-90 h-6 w-6 flex items-center justify-center disabled:opacity-30"
                          >
                            -
                          </button>
                          
                          <span className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded-md min-w-[32px] ${
                            product.stock === 0
                              ? 'bg-red-50 text-red-500 font-black'
                              : product.stock <= 5
                              ? 'bg-amber-50 text-amber-500 font-black animate-pulse'
                              : 'bg-slate-50 text-slate-800'
                          }`}>
                            {product.stock}
                          </span>

                          <button
                            onClick={() => handleStockAdjust(product.id, 1)}
                            className="bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 px-2 py-0.5 font-black text-xs rounded-lg transition-transform active:scale-90 h-6 w-6 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => startEditProduct(product)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                            title={t.editProduct}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                            title={t.deleteProduct}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Distribution Pipelines (Orders module) */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-xs">
          <h3 className="text-base font-black text-slate-900 tracking-tight uppercase flex items-center gap-2 border-b border-slate-100 pb-3">
            <Hash className="h-5 w-5 text-[#8A1538]" />
            <span>{isRtl ? 'قائمة الطلبات المباشرة لوجستياً' : 'Live Order Log & Logistics Status'}</span>
          </h3>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
              <ShoppingBag className="h-12 w-12 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">{t.noOrders}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">{t.orderId}</th>
                    <th className="py-3 px-4">{t.customer}</th>
                    <th className="py-3 px-4">{isRtl ? 'الطلب والتوقيت والخصم' : 'Order Specification'}</th>
                    <th className="py-3 px-4">{isRtl ? 'منطقة وعنوان الديليفري' : 'Logistics Destination'}</th>
                    <th className="py-3 px-4 text-right">QAR {isRtl ? 'الإجمالي' : 'Total'}</th>
                    <th className="py-3 px-4 text-center">{t.status}</th>
                    <th className="py-3 px-4 text-center">{t.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const badge = getStatusBadge(order.status);
                    const muni = QATAR_MUNICIPALITIES.find((m) => m.id === order.municipality);
                    return (
                      <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                        
                        {/* Order ID */}
                        <td className="py-4 px-4 font-mono font-bold text-slate-600">
                          #{order.id.slice(0, 10)}
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-4">
                          <div className="font-extrabold text-slate-950">{order.customerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{order.customerPhone}</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{order.customerEmail}</div>
                        </td>

                        {/* Specs checklist */}
                        <td className="py-4 px-4 space-y-1">
                          <div className="text-[11px] font-sans font-bold max-w-[180px]">
                            {order.items.map((item) => `${isRtl ? item.nameAr : item.name} (x${item.quantity})`).join(', ')}
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase flex gap-1.5 flex-wrap">
                            <span>{order.createdAt.split('T')[0]}</span>
                            <span>•</span>
                            <span className="text-slate-500 font-bold">{order.paymentMethod.toUpperCase()}</span>
                            {order.discountCode && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-600 font-bold">COUPON: {order.discountCode}</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-4 px-4 text-slate-700">
                          <div className="font-extrabold text-slate-900">{isRtl ? muni?.nameAr : muni?.name}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{order.deliveryAddress}</div>
                        </td>

                        {/* Sum price */}
                        <td className="py-4 px-4 text-right font-black text-[#8A1538]">
                          QAR {order.total.toLocaleString()}
                        </td>

                        {/* Status badge */}
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wide ${badge.bg}`}>
                            {badge.icon}
                            <span>{isRtl ? (order.status === 'Pending' ? 'معلق' : order.status === 'Sourced' ? 'مجهز للتوصيل' : order.status === 'Out for Delivery' ? 'مع المندوب' : order.status === 'Delivered' ? 'تم التوصيل' : 'ملغي') : order.status}</span>
                          </span>
                        </td>

                        {/* Pipeline Actions dropdown */}
                        <td className="py-4 px-4 text-center">
                          <div className="relative inline-block text-left">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold py-1.5 px-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-800"
                            >
                              <option value="Pending">{isRtl ? 'تعديل: معلق' : 'Set: Pending'}</option>
                              <option value="Sourced">{isRtl ? 'تعديل: مجهز' : 'Set: Sourced'}</option>
                              <option value="Out for Delivery">{isRtl ? 'تعديل: مع المندوب' : 'Set: Out for Delivery'}</option>
                              <option value="Delivered">{isRtl ? 'تعديل: متصل' : 'Set: Delivered'}</option>
                              <option value="Cancelled">{isRtl ? 'تعديل: إلغاء' : 'Set: Cancelled'}</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 6. Coupons database panel */}
      {activeTab === 'promos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Create section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-xs h-fit">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Ticket className="h-5 w-5 text-[#8A1538]" />
              <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                {t.createPromo}
              </h3>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isRtl ? 'رمز الكوبون' : 'Coupon Code'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. QATAR50"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 focus:border-slate-800 bg-slate-50/50 rounded-lg focus:outline-none uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {t.promoType}
                </label>
                <select
                  value={newPromoType}
                  onChange={(e) => setNewPromoType(e.target.value as 'percent' | 'fixed')}
                  className="w-full text-xs p-2.5 border border-slate-200 focus:border-[#8A1538] bg-slate-50 rounded-lg focus:outline-none"
                >
                  <option value="percent">Percentage Off (%)</option>
                  <option value="fixed">Fixed Reduction QAR (ر.ق)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {t.promoValue} *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newPromoValue || ''}
                  onChange={(e) => setNewPromoValue(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-200 focus:border-slate-800 bg-slate-50/50 rounded-lg focus:outline-none font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {t.minSpend} <span className="text-[9px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={newPromoMinSpend || ''}
                  onChange={(e) => setNewPromoMinSpend(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-200 focus:border-slate-800 bg-slate-50/50 rounded-lg focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#8A1538] hover:bg-[#a11b44] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                {isRtl ? 'إصدار القسيمة وحفظها' : 'Publish & Store Coupon'}
              </button>
            </form>
          </div>

          {/* List Database Section */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-slate-950 tracking-tight uppercase border-b border-slate-100 pb-3">
              {t.activePromos}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">{isRtl ? 'رمز الكوبون' : 'Promo Code'}</th>
                    <th className="py-3 px-4">{t.promoType}</th>
                    <th className="py-3 px-4 text-center">{t.promoValue}</th>
                    <th className="py-3 px-4 text-center">{t.minSpend}</th>
                    <th className="py-3 px-4 text-center">{t.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {promos.map((promo) => (
                    <tr key={promo.code} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-black text-[#8A1538]">
                        {promo.code}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                          {promo.type === 'percent' ? 'Percentage Off' : 'Flat Discount'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900">
                        {promo.type === 'percent' ? `${promo.value}%` : `QAR ${promo.value}`}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500 font-mono">
                        {promo.minSpend ? `QAR ${promo.minSpend}` : '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeletePromo(promo.code)}
                          className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
