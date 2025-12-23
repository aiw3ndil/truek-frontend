'use client';

import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';

export default function Home() {
  const { t } = useLocale();

  return (
    <div className="grid-x grid-padding-x align-center">
      <div className="cell large-10 text-center">
        <h1>{t.page.title}</h1>
      </div>
      <div className="cell large-8 text-center">
        <p>{t.page.description}</p>
      </div>
      <div className="cell large-8" style={{ margin: '2rem 0' }}>
        <Image
          src="/bazaar.png"
          alt={t.page.bazaar_alt}
          width={1024}
          height={768}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
}
