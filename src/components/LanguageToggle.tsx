/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  currentLang: 'en' | 'ar';
  onToggle: () => void;
}

export default function LanguageToggle({ currentLang, onToggle }: LanguageToggleProps) {
  return (
    <button
      id="btn-language-toggle"
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold tracking-wider rounded-lg border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-all duration-200 text-slate-700 capitalize shadow-xs"
      aria-label="Toggle language"
    >
      <Globe className="h-3.5 w-3.5 text-[#8A1538]" />
      <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
