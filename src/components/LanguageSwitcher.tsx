'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { Locale } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { t, setLocale, locale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher" ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className="button clear"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          color: 'var(--color-clay)',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.5rem 0.8rem',
          borderRadius: '8px',
          background: isOpen ? 'rgba(255,255,255,0.1)' : 'transparent'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>🌐</span>
        <span>{t.language[locale]}</span>
        <span style={{ fontSize: '0.8rem', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            background: '#FDF8ED',
            borderRadius: '12px',
            padding: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid var(--color-sand)',
            minWidth: '140px',
            zIndex: 20,
            marginTop: '0.5rem'
          }}
        >
          {(['en', 'es', 'fi'] as Locale[]).map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '0.6rem 1rem',
                color: locale === lang ? 'var(--color-terracotta)' : 'var(--color-clay)',
                fontWeight: locale === lang ? 'bold' : '600',
                borderRadius: '8px',
                background: locale === lang ? 'rgba(188, 108, 37, 0.05)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(188, 108, 37, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = locale === lang ? 'rgba(188, 108, 37, 0.05)' : 'transparent'}
            >
              {t.language[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
