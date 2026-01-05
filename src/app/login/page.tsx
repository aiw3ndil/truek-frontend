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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      auth.login(data.token);
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const data = await loginWithGoogle(tokenResponse.access_token);
        auth.login(data.token);
        router.push('/');
      } catch (error) {
        setError(error.message);
      }
    },
    onError: (error) => {
      setError(error.error_description || 'Failed to login with Google');
    },
  });

  return (
    <div className="grid-x grid-padding-x align-center">
      <div className="cell large-6">
        <div className="card">
          <div className="card-divider">
            <h1>{t.login.title}</h1>
          </div>
          <div className="card-section">
            <form onSubmit={handleSubmit}>
              {error && <div className="callout alert">{error}</div>}
              <label>
                {t.login.email_label}
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                {t.login.password_label}
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <button type="submit" className="button">
                {t.login.submit_button}
              </button>
            </form>
            <div className="or-divider">
              <span className="or-text">{t.login.or_text}</span>
            </div>
            <button onClick={() => googleLogin()} className="button expanded">
              {t.login.google_login_button}
            </button>
            <p>
              {t.login.no_account_text}{' '}
              <Link href="/register">{t.login.register_link}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
