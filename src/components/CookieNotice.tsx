'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: 'var(--color-clay)',
        color: 'white',
        padding: '1.5rem',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '600px',
        margin: '0 auto',
        border: '1px solid var(--color-sand)'
      }}
    >
      <p style={{ margin: 0, textAlign: 'center', fontSize: '0.95rem' }}>
        {t.cookie_notice?.message || "We use cookies to improve your experience on our oasis."}
      </p>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link 
          href="/privacy" 
          style={{ 
            color: 'var(--color-sand)', 
            fontSize: '0.85rem',
            textDecoration: 'underline'
          }}
        >
          {t.cookie_notice?.privacy_policy || "Privacy Policy"}
        </Link>
        <button 
          onClick={acceptCookies}
          className="oasis-button"
          style={{ 
            padding: '0.5rem 1.5rem', 
            fontSize: '0.9rem',
            backgroundColor: 'var(--color-terracotta)',
            borderColor: 'var(--color-terracotta)'
          }}
        >
          {t.cookie_notice?.accept || "Accept"}
        </button>
      </div>
    </div>
  );
}
