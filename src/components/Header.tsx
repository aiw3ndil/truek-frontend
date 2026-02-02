'use client';

import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const auth = useAuth();

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
                <>
                  <li style={{ marginLeft: '1rem' }}>
                    <Link href="/profile" className="oasis-button">
                      {auth.user?.name || 'Profile'}
                    </Link>
                  </li>
                  <li style={{ marginLeft: '0.5rem' }}>
                    <button onClick={auth.logout} style={{ background: 'transparent', border: 'none', color: 'var(--color-clay)', fontWeight: '600', cursor: 'pointer' }}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li style={{ marginLeft: '1rem' }}>
                  <Link href="/login" className="oasis-button">
                    Login
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

