import { Link, NavLink, Outlet } from 'react-router-dom';

import Footer from '../footer/footer';
import { AppRoute } from '../../types/app-route';

type AppLayoutProps = {
  isAuthorized: boolean;
  onLogout: () => void;
};

export default function AppLayout({ isAuthorized, onLogout }: AppLayoutProps) {
  return (
    <>
      <header className="header">
        <div className="container container--size-l">
          <Link className="logo header__logo" to={AppRoute.Root}>
            <svg width="134" height="52" aria-hidden="true">
              <use xlinkHref="#logo" />
            </svg>
          </Link>

          <nav className="main-nav header__main-nav">
            <ul className="main-nav__list">
              <li className="main-nav__item">
                <NavLink className="link" to={AppRoute.Root}>
                  Квесты
                </NavLink>
              </li>
              <li className="main-nav__item">
                <NavLink className="link" to={AppRoute.Contacts}>
                  Контакты
                </NavLink>
              </li>

              {isAuthorized && (
                <li className="main-nav__item">
                  <NavLink className="link" to={AppRoute.MyQuests}>
                    Мои бронирования
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          <div className="header__side-nav">
            {isAuthorized ? (
              <Link
                className="btn btn--accent header__side-item"
                to={'#'}
                onClick={onLogout}
              >
                Выйти
              </Link>
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
              href="tel:88001111111"
            >
              8 (000) 111-11-11
            </a>
          </div>
        </div>
      </header>

      <Outlet />

      <Footer />
    </>
  );
}
