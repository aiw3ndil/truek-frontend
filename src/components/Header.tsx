'use client';

import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const auth = useAuth();

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <ul className="menu">
          <li className="menu-text">
            <Link href="/">Truek</Link>
          </li>
        </ul>
      </div>
      <div className="top-bar-right">
        <ul className="menu">
          <li>
            <LanguageSwitcher />
          </li>
          {auth && (
            <>
              {auth.isAuthenticated() ? (
                <>
                  <li>
                    <Link href="/profile" className="button">
                      {auth.user?.name || 'Profile'}
                    </Link>
                  </li>
                  <li>
                    <button onClick={auth.logout} className="button">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login" className="button">
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
