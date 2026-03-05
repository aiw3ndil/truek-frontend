'use client';

import { useState, Suspense } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/services/auth';
import Link from 'next/link';

function ResetPasswordForm() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError(t.reset_password.error_invalid);
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password, passwordConfirmation);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      const msg = (error as Error).message;
      if (msg === 'expired') {
        setError(t.reset_password.error_expired);
      } else if (msg === 'invalid') {
        setError(t.reset_password.error_invalid);
      } else {
        setError(msg || t.reset_password.error_generic);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="callout alert" style={{ borderRadius: '12px', marginBottom: '1.5rem', backgroundColor: '#f8d7da', color: '#721c24', padding: '1rem' }}>
          {t.reset_password.error_invalid}
        </div>
        <Link href="/login" style={{ color: 'var(--color-terracotta)', fontWeight: 'bold' }}>
          {t.forgot_password.back_to_login}
        </Link>
      </div>
    );
  }

  return (
    <div className="card-organic" style={{ maxWidth: '450px', width: '100%', padding: '3rem' }}>
      <h1 className="text-center" style={{ marginBottom: '2rem', color: 'var(--color-clay)' }}>{t.reset_password.title}</h1>
      
      {success ? (
        <div className="text-center">
          <div className="callout success" style={{ borderRadius: '12px', marginBottom: '1.5rem', backgroundColor: '#d4edda', color: '#155724', padding: '1rem' }}>
            {t.reset_password.success_message}
          </div>
          <p>{t.forgot_password.back_to_login}...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="callout alert" style={{ borderRadius: '12px', marginBottom: '1.5rem', backgroundColor: '#f8d7da', color: '#721c24', padding: '1rem' }}>{error}</div>}
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t.reset_password.new_password_label}</label>
            <input
              type="password"
              className="search-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              style={{ width: '100%', padding: '0.8rem' }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t.reset_password.confirm_password_label}</label>
            <input
              type="password"
              className="search-input"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="********"
              style={{ width: '100%', padding: '0.8rem' }}
            />
          </div>
          
          <button type="submit" className="oasis-button" disabled={loading} style={{ width: '100%', marginBottom: '1.5rem' }}>
            {loading ? t.items.saving : t.reset_password.submit_button}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="login-container" style={{
      backgroundColor: '#2b1d0e',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
