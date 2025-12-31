import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <ul className="menu">
          <li className="menu-text">
            <Link href="/">Truek</Link>
          </li>
        </ul>
      </div>
      <div className="top-bar-right">
        <ul className="menu">
          <li>
            <LanguageSwitcher />
          </li>
        </ul>
      </div>
    </header>
  );
}
