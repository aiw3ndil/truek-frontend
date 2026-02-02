'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="footer" style={{
      backgroundColor: '#2b1d0e',
      color: 'var(--color-sand)',
      padding: '2rem 0 2rem',
      marginTop: '0',
      borderTop: 'none'
    }}>
      <div className="grid-container">
        <div className="grid-x grid-padding-x">
          <div className="cell large-4 medium-6">
            <h4 style={{ color: 'var(--color-sand)', marginBottom: '1.5rem' }}>Truek</h4>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
              {t.page.description}
            </p>
          </div>
          <div className="cell large-4 medium-6">
            <h4 style={{ color: 'var(--color-sand)', marginBottom: '1.5rem' }}>Links</h4>
            <ul style={{ listStyle: 'none', margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/terms" style={{ color: 'var(--color-sand)' }}>{t.footer.terms}</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/privacy" style={{ color: 'var(--color-sand)' }}>Privacidad</Link></li>
            </ul>
          </div>
          <div className="cell large-4 medium-12">
            <h4 style={{ color: 'var(--color-sand)', marginBottom: '1.5rem' }}>Contacto</h4>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
              Email: info@truek.com<br />
              Linkedin: @truek-bazaar
            </p>
          </div>
        </div>
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(244, 228, 188, 0.1)', textAlign: 'center', fontSize: '0.8rem', opacity: 0.6 }}>
          <p>&copy; {new Date().getFullYear()} Truek. {t.footer.copyright.split('. ')[1]}</p>
        </div>
      </div>
    </footer>
  );
}

