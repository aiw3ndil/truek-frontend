'use client';

import { useLocale } from '@/context/LocaleContext';
import { Locale } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { t, setLocale } = useLocale();

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  return (
    <div className="language-switcher">
      <button
        type="button"
        className="button dropdown"
        data-toggle="language-dropdown"
      >
        {t.language.change}
      </button>
      <div className="dropdown-pane" id="language-dropdown" data-dropdown>
        <a href="#" onClick={() => changeLanguage('en')}>
          {t.language.en}
        </a>
        <a href="#" onClick={() => changeLanguage('es')}>
          {t.language.es}
        </a>
        <a href="#" onClick={() => changeLanguage('fi')}>
          {t.language.fi}
        </a>
      </div>
    </div>
  );
}
