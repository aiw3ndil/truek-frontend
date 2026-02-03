'use client';

import { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import Link from 'next/link';
import { login, loginWithGoogle } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      if (auth) {
        auth.login(data.token);
        router.push('/');
      }
    } catch (error) {
      setError((error as Error).message || 'An error occurred');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const data = await loginWithGoogle(tokenResponse.access_token);
        if (auth) {
          auth.login(data.token);
          router.push('/');
        }
      } catch (error) {
        setError((error as Error).message || 'An error occurred');
      }
    },
    onError: (error) => {
      setError(error.error_description || 'Failed to login with Google');
    },
  });

  return (
    <div className="login-container" style={{
      backgroundColor: '#2b1d0e',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="card-organic" style={{ maxWidth: '450px', width: '100%', padding: '3rem' }}>
        <h1 className="text-center" style={{ marginBottom: '2rem', color: 'var(--color-clay)' }}>{t.login.title}</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="callout alert" style={{ borderRadius: '12px', marginBottom: '1.5rem' }}>{error}</div>}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t.login.email_label}</label>
            <input
              type="email"
              className="search-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              style={{ width: '100%', padding: '0.8rem' }}
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t.login.password_label}</label>
            <input
              type="password"
              className="search-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              style={{ width: '100%', padding: '0.8rem' }}
            />
          </div>
          <button type="submit" className="oasis-button" style={{ width: '100%', marginBottom: '1.5rem' }}>
            {t.login.submit_button}
          </button>
        </form>

        <div className="text-center" style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
          <span style={{ fontSize: '0.9rem', color: '#888' }}>{t.login.or_text}</span>
          <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
        </div>

        <button onClick={() => googleLogin()} className="oasis-button" style={{ width: '100%', backgroundColor: '#fff', color: '#757575', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
          {t.login.google_login_button}
        </button>

        <p className="text-center" style={{ marginTop: '2rem', fontSize: '0.95rem' }}>
          {t.login.no_account_text}{' '}
          <Link href="/register" style={{ color: 'var(--color-terracotta)', fontWeight: 'bold' }}>{t.login.register_link}</Link>
        </p>
      </div>
    </div>
  );
}
