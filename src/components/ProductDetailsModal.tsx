/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { X, Star, CheckCircle, ShieldCheck, ShoppingBag, Truck, MessageSquare, User as UserIcon, Calendar } from 'lucide-react';
import { Product, User } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface ProductDetailsModalProps {
  product: Product | null;
  currentLang: 'en' | 'ar';
  onClose: () => void;
  onAddToCart: (productId: string) => void;
  currentUser?: User | null;
  onProductUpdated?: (updatedProduct: Product) => void;
}

const LOCAL_T = {
  en: {
    reviewsSection: 'Customer Reviews',
    noReviews: 'No reviews yet. Be the first to leave a review!',
    writeReview: 'Write a Review',
    yourName: 'Your Name',
    yourRating: 'Your Rating',
    yourComment: 'Your Comment',
    commentPlaceholder: 'Share your experience with this product...',
    namePlaceholder: 'Enter your name...',
    submitBtn: 'Submit Review',
    submittingBtn: 'Submitting Review...',
    successNotice: 'Review submitted successfully!',
    errorMissing: 'Please fill out all fields and select a rating.',
  },
  ar: {
    reviewsSection: 'آراء وتقييمات العملاء',
    noReviews: 'لا توجد تقييمات بعد. كن أول من يكتب تقييماً!',
    writeReview: 'اكتب تقييماً ومراجعة',
    yourName: 'اسمك الكريم',
    yourRating: 'تقييمك بالنجوم',
    yourComment: 'تعليقك وتجربتك',
    commentPlaceholder: 'شاركنا تفاصيل تجربتك لهذا المنتج...',
    namePlaceholder: 'أدخل اسمك...',
    submitBtn: 'تقديم المراجعة والتقييم',
    submittingBtn: 'جاري إرسال التقييم...',
    successNotice: 'تم تقديم مراجعتك بنجاح! شكراً لك.',
    errorMissing: 'يرجى تعبئة كافة الحقول وتحديد التقييم بالنجوم.',
  }
};

export default function ProductDetailsModal({
  product,
  currentLang,
  onClose,
  onAddToCart,
  currentUser,
  onProductUpdated,
}: ProductDetailsModalProps) {
  const isRtl = currentLang === 'ar';
  const t = TRANSLATIONS[currentLang];
  const localT = LOCAL_T[currentLang];

  const [reviewerName, setReviewerName] = useState('');
  const [ratingInput, setRatingInput] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Synchronize name fields with auth state
  useEffect(() => {
    if (product) {
      setReviewerName(currentUser?.fullName || '');
      setRatingInput(0);
      setCommentInput('');
      setErrorNotice('');
      setSuccessNotice(false);
    }
  }, [product, currentUser]);

  if (!product) return null;

  const isOutOfStock = product.stock === 0;

  // Safe helper to normalize reviews array
  const getReviews = () => {
    if (!product || !product.reviews) return [];
    if (typeof product.reviews === 'string') {
      try {
        return JSON.parse(product.reviews);
      } catch (e) {
        return [];
      }
    }
    return product.reviews;
  };

  const reviews = getReviews();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!reviewerName.trim() || ratingInput === 0 || !commentInput.trim()) {
      setErrorNotice(localT.errorMissing);
      return;
    }

    setSubmitting(true);
    setErrorNotice('');

    try {
      const response = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerName: reviewerName.trim(),
          rating: ratingInput,
          comment: commentInput.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.product) {
          setSuccessNotice(true);
          setCommentInput('');
          setRatingInput(0);
          
          if (onProductUpdated) {
            onProductUpdated(data.product);
          }
        } else {
          setErrorNotice(isRtl ? 'فشل حفظ التقييم.' : 'Failed to save review.');
        }
      } else {
        setErrorNotice(isRtl ? 'حدث خطأ في النظام.' : 'Server or network error.');
      }
    } catch (err) {
      setErrorNotice(isRtl ? 'عذراً، حدث خطأ أثناء الاتصال بالخادم.' : 'Error contacting the server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/75 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div
        id="product-detail-modal"
        className="relative bg-white w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl border border-zinc-200/80 flex flex-col md:flex-row transition-all duration-300 max-h-[90vh] md:max-h-[85vh] cursor-default font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${
            isRtl ? 'left-4' : 'right-4'
          } z-20 p-2 text-zinc-450 hover:text-zinc-950 bg-white/90 hover:bg-white backdrop-blur-xs rounded-lg border border-zinc-200 transition-colors pointer-events-auto cursor-pointer`}
          aria-label="Close details"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Side: Dynamic Visual Stage */}
        <div className="w-full md:w-1/2 relative bg-zinc-50 min-h-[250px] md:min-h-full">
          <img
            src={product.image}
            alt={isRtl ? product.nameAr : product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover max-h-[300px] md:max-h-none absolute inset-0"
          />
          <span
            className={`absolute top-4 ${
              isRtl ? 'right-4' : 'left-4'
            } bg-zinc-900/95 backdrop-blur-md text-white text-[9px] font-mono tracking-widest px-2.5 py-1 rounded-sm uppercase`}
          >
            {isRtl ? product.categoryAr : product.category}
          </span>
        </div>

        {/* Right Side: Informative specs sheet & reviews */}
        <div
          className={`w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto ${
            isRtl ? 'text-right' : 'text-left'
          }`}
        >
          <div className="space-y-6">
            {/* Rating summary */}
            <div className={`flex items-center gap-1.5 text-amber-500 ${isRtl ? 'justify-start flex-row-reverse' : ''}`}>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-zinc-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                {product.rating} ({product.reviewsCount} {t.reviews})
              </span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-zinc-950 tracking-tight leading-tight">
                {isRtl ? product.nameAr : product.name}
              </h2>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#8A1538] block mt-1.5">
                {isRtl ? product.categoryAr : product.category}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-500 leading-relaxed font-light">
              {isRtl ? product.descriptionAr : product.description}
            </p>

            {/* Specifications Matrix */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                {t.techSpecs}
              </h3>
              <ul className="space-y-1.5 text-xs text-zinc-700 font-light">
                {(isRtl ? product.specsAr : product.specs).map((spec, index) => (
                  <li key={index} className="flex items-start gap-2 leading-relaxed">
                    <CheckCircle className="h-3.5 w-3.5 text-[#8A1538] flex-shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Special Trust Banner */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-1.5 p-2 bg-zinc-50 rounded-lg border border-zinc-200/50">
                <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span className="text-[9px] md:text-10px text-zinc-700 font-mono tracking-wide uppercase">
                  {isRtl ? 'ضمان محلي معتمد' : 'Original Warranty'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-zinc-50 rounded-lg border border-zinc-200/50">
                <Truck className="h-4 w-4 text-[#8A1538] flex-shrink-0" />
                <span className="text-[9px] md:text-10px text-zinc-700 font-mono tracking-wide uppercase">
                  {isRtl ? 'شحن فائق السرعة' : 'Doha Quick Ship'}
                </span>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="pt-6 border-t border-zinc-100 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#8A1538]" />
                <span>{localT.reviewsSection}</span>
                <span className="text-xs font-mono font-normal text-zinc-400">
                  ({reviews.length})
                </span>
              </h3>

              {/* Existing Reviews list container */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {reviews.length === 0 ? (
                  <p className="text-xs text-zinc-400 font-light italic">
                    {localT.noReviews}
                  </p>
                ) : (
                  reviews.map((rev: any) => (
                    <div 
                      key={rev.id} 
                      className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/40 space-y-1.5 text-xs text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-zinc-850 flex items-center gap-1">
                          <UserIcon className="h-3 w-3 text-zinc-400" />
                          {rev.reviewerName}
                        </span>
                        <span className="text-[9px] text-zinc-400 flex items-center gap-1 font-mono">
                          <Calendar className="h-3 w-3 text-zinc-350" />
                          {new Date(rev.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-QA' : 'en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-zinc-250'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-zinc-650 font-light leading-relaxed whitespace-pre-line">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Submit a review form */}
              <form onSubmit={handleSubmitReview} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3 font-sans">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  {localT.writeReview}
                </h4>

                {errorNotice && (
                  <p className="text-[11px] text-red-650 font-medium">
                    {errorNotice}
                  </p>
                )}

                {successNotice && (
                  <p className="text-[11px] text-emerald-650 font-medium flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {localT.successNotice}
                  </p>
                )}

                {/* Rating selection (Stars) */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-450 block">
                    {localT.yourRating} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        type="button"
                        key={stars}
                        onClick={() => {
                          setRatingInput(stars);
                          setSuccessNotice(false);
                        }}
                        className="text-zinc-300 hover:text-amber-400 transition-colors cursor-pointer p-0.5"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            stars <= ratingInput ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name field */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-450 block">
                    {localT.yourName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    disabled={!!currentUser}
                    placeholder={localT.namePlaceholder}
                    value={reviewerName}
                    onChange={(e) => {
                      setReviewerName(e.target.value);
                      setSuccessNotice(false);
                    }}
                    className="w-full text-xs bg-white border border-zinc-200 focus:border-[#8A1538] outline-none rounded-lg p-2 text-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all font-sans"
                  />
                </div>

                {/* Comment area */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-450 block">
                    {localT.yourComment} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    maxLength={300}
                    rows={2}
                    placeholder={localT.commentPlaceholder}
                    value={commentInput}
                    onChange={(e) => {
                      setCommentInput(e.target.value);
                      setSuccessNotice(false);
                    }}
                    className="w-full text-xs bg-white border border-zinc-200 focus:border-[#8A1538] outline-none rounded-lg p-2.5 text-zinc-800 font-sans resize-none transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#8A1538] hover:bg-zinc-900 text-white text-[10px] uppercase font-mono tracking-wider py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? localT.submittingBtn : localT.submitBtn}
                </button>
              </form>
            </div>
          </div>

          {/* Sizing & Checkout CTA */}
          <div className="pt-5 mt-5 border-t border-zinc-100 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-400 font-mono uppercase tracking-widest">
                {isRtl ? 'سعر الوحدة' : 'Total Price'}
              </span>
              <span className="text-xl font-display font-medium text-zinc-950 tracking-tight">
                {isRtl ? (
                  <>
                    <span className="text-xs font-mono text-[#8A1538] mr-1">{t.qarSign}</span>
                    {product.price.toLocaleString()}
                  </>
                ) : (
                  <>
                    <span className="text-xs font-mono text-[#8A1538] mr-1">{t.priceQar}</span>
                    {product.price.toLocaleString()}
                  </>
                )}
              </span>
            </div>

            <button
              disabled={isOutOfStock}
              onClick={() => {
                onAddToCart(product.id);
                onClose();
              }}
              className={`px-5 py-2.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
                isOutOfStock
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border-zinc-200'
                  : 'bg-zinc-900 border-zinc-900 hover:bg-[#8A1538] hover:border-[#8A1538] text-white active:scale-97'
              }`}
            >
              <ShoppingBag className="h-3 w-3" />
              <span>{isOutOfStock ? t.outOfStock : t.addToCart}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
