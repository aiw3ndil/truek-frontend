'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const auth = useAuth();
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth) {
      await auth.register(username, email, password, passwordConfirmation);
    }
  };

  return (
    <div className="register-container" style={{
      backgroundColor: '#2b1d0e',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="card-organic" style={{ maxWidth: '500px', width: '100%', padding: '3rem' }}>
        <h1 className="text-center" style={{ marginBottom: '2rem', color: 'var(--color-clay)' }}>{t.register.title}</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>{t.register.username_label}</label>
            <input
              type="text"
              className="search-input"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '0.8rem' }}
            />
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>{t.register.email_label}</label>
            <input
              type="email"
              className="search-input"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.8rem' }}
            />
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>{t.register.password_label}</label>
            <input
              type="password"
              className="search-input"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.8rem' }}
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>{t.register.password_confirmation_label}</label>
            <input
              type="password"
              className="search-input"
              placeholder="********"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              style={{ width: '100%', padding: '0.8rem' }}
            />
          </div>
          <button type="submit" className="oasis-button" style={{ width: '100%', marginBottom: '1rem' }}>
            {t.register.submit_button}
          </button>
        </form>
        <p className="text-center" style={{ marginTop: '2rem', fontSize: '0.95rem' }}>
          {t.register.already_have_account_text}{' '}
          <Link href="/login" style={{ color: 'var(--color-terracotta)', fontWeight: 'bold' }}>{t.register.login_link}</Link>
        </p>
      </div>
    </div>
  );
}
