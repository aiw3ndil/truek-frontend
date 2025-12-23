import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <ul className="menu">
          <li className="menu-text">Truek</li>
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
