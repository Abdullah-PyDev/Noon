/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Zap, Award, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

interface HeroProps {
  currentLang: 'en' | 'ar';
}

export default function Hero({ currentLang }: HeroProps) {
  const isRtl = currentLang === 'ar';
  const t = TRANSLATIONS[currentLang];
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200',
      titleEn: 'Next-Generation Elite Digital Gadgets',
      titleAr: 'الجيل القادم من النخبة الرقمية',
      descrEn: 'Pioneering space-grade high-fidelity consumer electronics crafted for luxury, precision, and state-of-the-art experiences in Qatar.',
      descrAr: 'إلكترونيات استهلاكية مبتكرة وراقية مصنوعة للرفاهية ودقة متناهية لتلائم ذوقك الرفيع في دولة قطر.',
      badgeEn: 'Limited Stock Available',
      badgeAr: 'تتوفر كميات محدودة',
      taglineEn: 'Explore Future Tech',
      taglineAr: 'اكتشف تقنيات المستقبل'
    },
    {
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
      titleEn: 'National Al-Anabi Custom Keyboards',
      titleAr: 'لوحات مفاتيح ميكانيكية بإصدار العنابي الوطني',
      descrEn: 'Engineered with custom dual-legend Arabic keycaps and solid anodized aluminum casing in rich Qatari burgundy.',
      descrAr: 'مصممة خصيصاً بنظام ثنائي اللغة عربي-إنجليزي وهيكل ألومنيوم صلب بلون العنابي الداكن الوطني ليتطابق مع تطلعاتك.',
      badgeEn: 'Special Qatar Edition',
      badgeAr: 'إصدار قطري خاص',
      taglineEn: 'Shop Al-Anabi Custom',
      taglineAr: 'تسوق إصدار العنابي المميز'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div id="hero-banner-container" className="relative bg-zinc-950 overflow-hidden rounded-xl border border-zinc-800 shadow-xl min-h-[420px] md:min-h-[485px]">
      {/* Background Images with transition */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-40 scale-100' : 'opacity-0 scale-101 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <img
            src={slide.image}
            alt="Hero Tech Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
        </div>
      ))}

      {/* Hero Slide Content Wrapper */}
      <div className={`relative z-10 flex flex-col justify-end p-8 md:p-14 min-h-[420px] md:min-h-[485px] text-white ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#feee00] text-zinc-950 text-[9px] font-sans font-black uppercase tracking-widest px-3 py-1 rounded-sm animate-pulse shadow-xs border border-yellow-300">
              <Sparkles className="h-3 w-3 text-black fill-black" />
              {isRtl ? slides[currentSlide].badgeAr : slides[currentSlide].badgeEn}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight leading-tight">
            {isRtl ? slides[currentSlide].titleAr : slides[currentSlide].titleEn}
          </h2>

          <p className="text-zinc-300 text-xs md:text-sm font-light leading-relaxed max-w-xl">
            {isRtl ? slides[currentSlide].descrAr : slides[currentSlide].descrEn}
          </p>

          <div className="pt-3 flex flex-wrap gap-2 md:gap-4">
            <a
              href="#products-list-anchor"
              className="px-5 py-2.5 bg-[#feee00] hover:bg-white text-zinc-950 hover:text-black font-sans font-bold uppercase text-xs tracking-wider rounded-sm transition-all duration-300 shadow-md flex items-center gap-2"
            >
              <span>{isRtl ? slides[currentSlide].taglineAr : slides[currentSlide].taglineEn}</span>
              {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Bullets */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-none transition-all duration-300 cursor-pointer ${
              index === currentSlide ? 'w-6 bg-[#feee00]' : 'w-1.5 bg-white/40 hover:bg-white'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Mini Services Ribbon */}
      <div className="absolute top-6 right-6 hidden md:flex items-center gap-4 bg-zinc-950/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-zinc-800 text-[10px] text-zinc-300 font-mono tracking-wide">
        <div className="flex items-center gap-1.5 border-r border-zinc-800/80 pr-3 last:border-0 last:pr-0">
          <Zap className="h-3 w-3 text-[#feee00]" />
          <span>{isRtl ? 'توصيل متاح نفس اليوم' : 'SAME-DAY DISPATCH'}</span>
        </div>
        <div className="flex items-center gap-1.5 border-r border-zinc-800/80 pr-3 last:border-0 last:pr-0">
          <ShieldCheck className="h-3 w-3 text-emerald-500" />
          <span>{isRtl ? 'ضمان قطر ١٠٠٪' : '100% QATAR COMPLIANT'}</span>
        </div>
      </div>
    </div>
  );
}
