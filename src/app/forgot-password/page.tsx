'use client';

import { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import Link from 'next/link';
import { forgotPassword } from '@/services/auth';

export default function ForgotPasswordPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (error) {
      setError((error as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-center" style={{ marginBottom: '2rem', color: 'var(--color-clay)' }}>{t.forgot_password.title}</h1>
        
        {success ? (
          <div className="text-center">
            <div className="callout success" style={{ borderRadius: '12px', marginBottom: '1.5rem', backgroundColor: '#d4edda', color: '#155724', padding: '1rem' }}>
              {t.forgot_password.success_message}
            </div>
            <Link href="/login" className="oasis-button" style={{ display: 'inline-block', width: '100%', textDecoration: 'none', textAlign: 'center' }}>
              {t.forgot_password.back_to_login}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ marginBottom: '1.5rem', color: '#666', lineHeight: '1.5' }}>
              {t.forgot_password.description}
            </p>
            
            {error && <div className="callout alert" style={{ borderRadius: '12px', marginBottom: '1.5rem', backgroundColor: '#f8d7da', color: '#721c24', padding: '1rem' }}>{error}</div>}
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t.forgot_password.email_label}</label>
              <input
                type="email"
                className="search-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                style={{ width: '100%', padding: '0.8rem' }}
              />
            </div>
            
            <button type="submit" className="oasis-button" disabled={loading} style={{ width: '100%', marginBottom: '1.5rem' }}>
              {loading ? t.items.saving : t.forgot_password.submit_button}
            </button>
            
            <div className="text-center">
              <Link href="/login" style={{ color: 'var(--color-terracotta)', fontWeight: 'bold' }}>
                {t.forgot_password.back_to_login}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
