import { Link, NavLink, Outlet } from 'react-router-dom';

import { AppRoute } from '../../types/app-route';

type AppLayoutProps = {
  isAuthorized: boolean;
};

export default function AppLayout({ isAuthorized }: AppLayoutProps) {
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

          {isAuthorized ? (
            <button className="btn header__side-nav" type="button">
              Выйти
            </button>
          ) : (
            <Link className="btn header__side-nav" to={AppRoute.Login}>
              Войти
            </Link>
          )}
        </div>
      </header>

      <Outlet />
    </>
  );
}
