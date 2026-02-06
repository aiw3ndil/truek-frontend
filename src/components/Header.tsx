'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';

export default function Header() {
  const auth = useAuth();
  const { t } = useLocale();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="top-bar desert-gradient" style={{ padding: '0.5rem 1rem', borderBottom: '2px solid var(--color-terracotta)', boxShadow: '0 4px 10px rgba(96, 56, 8, 0.1)' }}>
      <div className="top-bar-left">
        <ul className="menu" style={{ background: 'transparent' }}>
          <li className="menu-text" style={{ padding: 0 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--color-clay)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px 12px 0 12px'
              }}>
                <span style={{ color: 'var(--color-sand)', fontSize: '1.5rem', fontWeight: 'bold' }}>T</span>
              </div>
              <span className="display-font" style={{ fontSize: '1.5rem', color: 'var(--color-clay)' }}>Truek</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="top-bar-right">
        <ul className="menu" style={{ background: 'transparent', alignItems: 'center' }}>
          <li>
            <LanguageSwitcher />
          </li>
          {auth && (
            <>
              {auth.isAuthenticated() ? (
                <li
                  ref={profileMenuRef}
                  style={{ marginLeft: '1rem', position: 'relative' }}
                >
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="button clear"
                    style={{ color: 'var(--color-clay)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '8px' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-sand)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid var(--color-terracotta)'
                    }}>
                      {auth.user?.picture ? (
                        <img src={auth.user.picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '1rem', color: 'var(--color-terracotta)', fontWeight: 'bold' }}>
                          {(auth.user?.name || auth.user?.username || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span>{auth.user?.name || auth.user?.username || 'User'}</span>
                    <span>▾</span>
                  </button>
                  {isProfileMenuOpen && (
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
                        minWidth: '180px',
                        zIndex: 10
                      }}
                    >
                      <Link href="/profile" onClick={() => setIsProfileMenuOpen(false)} style={{ display: 'block', padding: '0.5rem 1rem', color: 'var(--color-clay)', fontWeight: '600', borderRadius: '8px', marginBottom: '0.2rem' }} onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.background = 'rgba(188, 108, 37, 0.1)'} onMouseOut={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.background = 'transparent'}>
                        {t.header_menu?.profile || "Profile"}
                      </Link>
                      <div style={{ borderTop: '1px solid var(--color-sand)', margin: '0.2rem 0' }}></div>
                      <button
                        onClick={() => {
                          auth.logout();
                          setIsProfileMenuOpen(false);
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.5rem 1rem',
                          color: 'var(--color-clay)',
                          fontWeight: '600',
                          borderRadius: '8px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(188, 108, 37, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {t.header_menu?.logout || "Logout"}
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                <li style={{ marginLeft: '1rem' }}>
                  <Link href="/login" className="oasis-button">
                    {t.header_menu?.login || "Login"}
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

