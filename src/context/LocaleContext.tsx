'use client';

import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { translations, Locale } from '@/lib/i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations.en;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('es');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    localStorage.setItem('locale', newLocale);
    setLocale(newLocale);
  };

  const t = translations[locale];

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
