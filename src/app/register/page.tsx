'use client';

import { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import Link from 'next/link';
import { register } from '@/services/auth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(username, email, password);
      router.push('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="grid-x grid-padding-x align-center">
      <div className="cell large-6">
        <div className="card">
          <div className="card-divider">
            <h1>{t.register.title}</h1>
          </div>
          <div className="card-section">
            <form onSubmit={handleSubmit}>
              {error && <div className="callout alert">{error}</div>}
              <label>
                {t.register.username_label}
                <input
                  type="text"
                  placeholder="your_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <label>
                {t.register.email_label}
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                {t.register.password_label}
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label>
                {t.register.password_confirmation_label}
                <input
                  type="password"
                  placeholder="********"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
              </label>
              <button type="submit" className="button">
                {t.register.submit_button}
              </button>
            </form>
            <p>
              {t.register.already_have_account_text}{' '}
              <Link href="/login">{t.register.login_link}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
