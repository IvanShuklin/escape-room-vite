import { Link, NavLink, useLocation } from 'react-router-dom';

import { AppRoute } from '../../types/app-route';

type HeaderProps = {
  isAuthorized: boolean;
  onLogout: () => void;
};

type NavLinkClassNameProps = {
  isActive: boolean;
};

const getNavLinkClassName = ({ isActive }: NavLinkClassNameProps) =>
  `link${isActive ? ' active' : ''}`;

export default function Header({ isAuthorized, onLogout }: HeaderProps) {
  const { pathname } = useLocation();

  const handleLogoutClick = (evt: React.MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    onLogout();
  };

  return (
    <header className="header">
      <div className="container container--size-l">
        {pathname === AppRoute.Root ? (
          <span className="logo header__logo">
            <svg width="134" height="52" aria-hidden="true">
              <use xlinkHref="#logo" />
            </svg>
          </span>
        ) : (
          <Link className="logo header__logo" to={AppRoute.Root}>
            <svg width="134" height="52" aria-hidden="true">
              <use xlinkHref="#logo" />
            </svg>
          </Link>
        )}

        <nav className="main-nav header__main-nav">
          <ul className="main-nav__list">
            <li className="main-nav__item">
              <NavLink className={getNavLinkClassName} to={AppRoute.Root} end>
                Квесты
              </NavLink>
            </li>

            <li className="main-nav__item">
              <NavLink className={getNavLinkClassName} to={AppRoute.Contacts}>
                Контакты
              </NavLink>
            </li>

            {isAuthorized && (
              <li className="main-nav__item">
                <NavLink className={getNavLinkClassName} to={AppRoute.MyQuests}>
                  Мои бронирования
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="header__side-nav">
          {isAuthorized ? (
            <a
              className="btn btn--accent header__side-item"
              href="#"
              onClick={handleLogoutClick}
            >
              Выйти
            </a>
          ) : (
            <Link
              className="btn btn--accent header__side-item"
              to={AppRoute.Login}
            >
              Войти
            </Link>
          )}

          <a
            className="link header__side-item header__phone-link"
            href="tel:88003335599"
          >
            8 (000) 111-11-11
          </a>
        </div>
      </div>
    </header>
  );
}
