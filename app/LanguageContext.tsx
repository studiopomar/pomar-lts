'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, TranslationSchema } from './i18n/translations';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'pt',
  setLanguage: () => {},
  t: translations.pt,
  dir: 'ltr',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('pomar_lang') as Language;
      if (savedLang && ['pt', 'en', 'ar', 'ru', 'ja'].includes(savedLang)) {
        setLanguageState(savedLang);
      }
    } catch {
      // ignore localStorage errors in SSR/private browsing
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('pomar_lang', lang);
    } catch {
      // ignore
    }
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    if (dir === 'rtl') {
      document.body.classList.add('rtl-layout');
    } else {
      document.body.classList.remove('rtl-layout');
    }
  }, [language, dir]);

  const currentTranslation = translations[language] || translations.pt;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: currentTranslation, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
