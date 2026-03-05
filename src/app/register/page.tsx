'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import Link from 'next/link';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { loginWithGoogle } from '@/services/auth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const { t } = useLocale();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (auth) {
      try {
        await auth.register(username, email, password, passwordConfirmation);
      } catch (err: any) {
        setError(err.message || 'Registration failed');
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const data = await loginWithGoogle(credentialResponse.credential);
        if (auth) {
          auth.login(data.token);
          router.push('/');
        }
      } catch (err: any) {
        setError(err.message || 'Google login failed');
      }
    } else {
      setError('Google login failed: no credential received');
    }
  };

  const handleGoogleError = () => {
    setError('Failed to register with Google');
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
          {error && <div className="callout alert" style={{ borderRadius: '12px', marginBottom: '1.5rem' }}>{error}</div>}
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

        <div className="text-center" style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
          <span style={{ fontSize: '0.9rem', color: '#888' }}>{t.login.or_text}</span>
          <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <p className="text-center" style={{ marginTop: '2rem', fontSize: '0.95rem' }}>
          {t.register.already_have_account_text}{' '}
          <Link href="/login" style={{ color: 'var(--color-terracotta)', fontWeight: 'bold' }}>{t.register.login_link}</Link>
        </p>
      </div>
    </div>
  );
}
