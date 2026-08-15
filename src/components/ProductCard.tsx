/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { Product } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface ProductCardProps {
  key?: string;
  product: Product;
  currentLang: 'en' | 'ar';
  onAddToCart: (productId: string) => void;
  onOpenDetails: (product: Product) => void;
}

export default function ProductCard({
  product,
  currentLang,
  onAddToCart,
  onOpenDetails,
}: ProductCardProps) {
  const isRtl = currentLang === 'ar';
  const t = TRANSLATIONS[currentLang];
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white rounded-xl border border-zinc-200/80 hover:border-zinc-900 hover:-translate-y-1 shadow-xs transition-all duration-400 overflow-hidden"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-zinc-50 overflow-hidden">
        <img
          src={product.image}
          alt={isRtl ? product.nameAr : product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />

        {/* Floating Category Tag */}
        <span
          className={`absolute top-3 ${
            isRtl ? 'right-3' : 'left-3'
          } bg-zinc-900/90 backdrop-blur-md text-white text-[9px] font-mono tracking-widest px-2.5 py-1 rounded-sm uppercase`}
        >
          {isRtl ? product.categoryAr : product.category}
        </span>

        {/* Out Of Stock/Low Stock Overlays */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center p-4">
            <span className="bg-zinc-900 text-white text-[10px] font-mono tracking-wider px-3.5 py-2 rounded-sm shadow-xs uppercase">
              {t.outOfStock}
            </span>
          </div>
        ) : isLowStock ? (
          <span
            className={`absolute bottom-3 ${
              isRtl ? 'right-3' : 'left-3'
            } bg-amber-500/90 backdrop-blur-md text-white text-[9px] font-mono tracking-widest px-2.5 py-1 rounded-sm animate-pulse`}
          >
            {t.lowStock} ({product.stock})
          </span>
        ) : (
          <span
            className={`absolute bottom-3 ${
              isRtl ? 'right-3' : 'left-3'
            } bg-zinc-900/10 backdrop-blur-md text-zinc-900 text-[9px] font-mono tracking-widest px-2.5 py-1 rounded-sm border border-zinc-900/20`}
          >
            {t.inStock}
          </span>
        )}

        {/* Hover Action Overlays */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-center justify-center gap-3">
          <button
            onClick={() => onOpenDetails(product)}
            className="p-3 bg-zinc-900 text-white hover:bg-[#8A1538] rounded-full transition-all shadow-md scale-90 group-hover:scale-100 active:scale-95 duration-200 cursor-pointer"
            aria-label="View product specs"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Info Core */}
      <div className={`p-5 flex-1 flex flex-col justify-between ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="space-y-2 flex-1">
          {/* Ratings */}
          <div className={`flex items-center gap-1 text-amber-500 ${isRtl ? 'justify-start flex-row-reverse' : ''}`}>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-2.5 w-2.5 ${
                    i < Math.floor(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-zinc-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Product Title - Display Font */}
          <h3
            onClick={() => onOpenDetails(product)}
            className="text-15px font-display font-semibold text-zinc-900 tracking-tight line-clamp-1 hover:text-[#8A1538] transition-colors cursor-pointer"
          >
            {isRtl ? product.nameAr : product.name}
          </h3>

          {/* Product Description snippet - Sans font */}
          <p className="text-11px text-zinc-500 line-clamp-2 leading-relaxed font-light">
            {isRtl ? product.descriptionAr : product.description}
          </p>
        </div>

        {/* Price & Action Footer - Minimal Display Font */}
        <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-400 font-mono uppercase tracking-widest">
              {isRtl ? 'القيمة' : 'Price'}
            </span>
            <span className="text-base font-display font-medium text-zinc-900 tracking-tight">
              {isRtl ? (
                <>
                  <span className="text-xs font-mono text-[#8A1538] mr-1">{t.qarSign}</span>
                  {product.price.toLocaleString()}
                </>
              ) : (
                <>
                  <span className="text-11px font-mono text-[#8A1538] mr-1">{t.priceQar}</span>
                  {product.price.toLocaleString()}
                </>
              )}
            </span>
            
            {/* noon express badge indicator */}
            {!isOutOfStock && product.stock > 1 && (
              <div className="mt-1 flex items-center">
                <span className="bg-[#feee00] text-zinc-950 font-sans font-extrabold text-[8px] px-1.5 py-0.5 rounded-xs tracking-tighter uppercase inline-flex items-center gap-0.5 border border-[#feee00] shadow-3xs leading-none">
                  <span className="italic font-black text-black">noon</span> express
                </span>
              </div>
            )}
          </div>

          <button
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product.id)}
            className={`px-3.5 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              isOutOfStock
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200/55'
                : 'bg-zinc-900 hover:bg-[#feee00] hover:text-zinc-950 text-white active:scale-97 border border-transparent'
            }`}
          >
            <ShoppingBag className="h-3 w-3" />
            <span>{isOutOfStock ? t.outOfStock : t.addToCart}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
