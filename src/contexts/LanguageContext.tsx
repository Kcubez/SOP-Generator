'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '@/lib/i18n/en';
import mm from '@/lib/i18n/mm';
import type { Translations } from '@/lib/i18n/en';

type Language = 'en' | 'mm';

interface LanguageContextType {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const translations = { en, mm };

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  t: en,
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('sop-lang') as Language | null;
    if (saved && (saved === 'en' || saved === 'mm')) {
      setLangState(saved);
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('sop-lang', newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'mm' : 'en');
  }, [lang, setLang]);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, t, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
