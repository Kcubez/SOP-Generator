'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

type LanguageOption = {
  value: 'english' | 'myanmar';
  label: string;
  flag: string;
};

interface LanguageDropdownProps {
  label: string;
  value: 'english' | 'myanmar';
  onChange: (value: 'english' | 'myanmar') => void;
  options: LanguageOption[];
}

export default function LanguageDropdown({
  label,
  value,
  onChange,
  options,
}: LanguageDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value) || options[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div>
      <label className="form-label flex items-center gap-2">
        <Globe className="h-4 w-4 text-violet-400" />
        {label} <span className="text-red-400">*</span>
      </label>
      <div className="relative" ref={ref}>
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          className="w-full flex items-center justify-between gap-3 bg-[rgba(15,23,42,0.6)] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 font-medium cursor-pointer outline-none transition-all duration-200 hover:border-white/20 focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
        >
          <span className="flex items-center gap-2.5">
            <span className="text-lg leading-none">{selected.flag}</span>
            <span>{selected.label}</span>
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-slate-800/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150 cursor-pointer ${
                  value === option.value
                    ? 'bg-violet-500/15 text-violet-200'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{option.flag}</span>
                  <span>{option.label}</span>
                </span>
                {value === option.value && <Check className="h-4 w-4 text-violet-400" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
