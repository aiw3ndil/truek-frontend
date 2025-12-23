'use client';

import { useLocale } from '@/context/LocaleContext';

export default function TermsPage() {
  const { t } = useLocale();

  return (
    <div>
      <h1>{t.terms_page.title}</h1>
      <hr />
      <h2>{t.terms_page.heading}</h2>
      <p>{t.terms_page.paragraph}</p>
    </div>
  );
}
