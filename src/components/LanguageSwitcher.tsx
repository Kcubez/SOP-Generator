'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { value: 'en' as const, label: 'EN', flag: '/flags/en.png' },
    { value: 'mm' as const, label: 'MM', flag: '/flags/mm.png' },
  ];

  const current = options.find(o => o.value === lang) || options[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
      >
        <Image
          src={current.flag}
          alt={current.label}
          width={20}
          height={14}
          className="rounded-sm object-cover"
        />
        <span className="text-xs font-medium text-slate-300">{current.label}</span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-28 rounded-xl bg-slate-800 border border-white/10 shadow-xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                setLang(option.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-all ${
                lang === option.value
                  ? 'bg-violet-500/15 text-violet-300'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Image
                src={option.flag}
                alt={option.label}
                width={22}
                height={16}
                className="rounded-sm object-cover"
              />
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
