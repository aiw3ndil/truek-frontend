'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="footer" style={{ padding: '2rem 0', marginTop: '2rem', borderTop: '1px solid #e0e0e0' }}>
      <div className="grid-container">
        <div className="grid-x grid-padding-x">
          <div className="cell large-6">
            <p>&copy; {new Date().getFullYear()} Truek. {t.footer.copyright.split('. ')[1]}</p>
          </div>
          <div className="cell large-6" style={{textAlign: 'right'}}>
            <Link href="/terms">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
