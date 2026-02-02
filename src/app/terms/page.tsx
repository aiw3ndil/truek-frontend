'use client';

import { useLocale } from '@/context/LocaleContext';

export default function TermsPage() {
  const { t } = useLocale();

  return (
    <div className="terms-container" style={{
      backgroundColor: '#2b1d0e',
      minHeight: '100vh',
      padding: '4rem 1rem'
    }}>
      <div className="grid-container">
        <div className="grid-x grid-padding-x align-center">
          <div className="cell large-10">
            <div className="card-organic" style={{ padding: '4rem' }}>
              <h1 className="display-font" style={{ fontSize: '3rem', marginBottom: '2rem', color: 'var(--color-clay)' }}>{t.terms_page.title}</h1>
              <div style={{ borderTop: '2px solid var(--color-sand)', paddingTop: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--color-terracotta)' }}>{t.terms_page.heading}</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.9 }}>
                  {t.terms_page.paragraph}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
