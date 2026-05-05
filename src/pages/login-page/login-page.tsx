import { FormEventHandler, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getAuthorizationStatus,
  getUserErrorMessage,
  getUserLoadingStatus,
} from '../../store/user/selectors';
import { loginAction } from '../../store/user/user-slice';
import { AppRoute } from '../../types/app-route';
import { AuthorizationStatus } from '../../types/auth';

type LocationState = {
  from?: {
    pathname: string;
  };
};

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const loadingStatus = useAppSelector(getUserLoadingStatus);
  const errorMessage = useAppSelector(getUserErrorMessage);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const locationState = location.state as LocationState | null;
  const redirectPath = locationState?.from?.pathname ?? AppRoute.Root;

  if (authorizationStatus === AuthorizationStatus.Auth) {
    return <Navigate to={AppRoute.Root} replace />;
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();

    void dispatch(loginAction({ email, password }))
      .unwrap()
      .then(() => {
        navigate(redirectPath, { replace: true });
      })
      .catch(() => undefined);
  };

  return (
    <>
      <Helmet>
        <title>Escape Room — вход</title>
      </Helmet>

      <main className="decorated-page login">
        <div className="decorated-page__decor" aria-hidden="true">
          <picture>
            <source
              type="image/webp"
              srcSet="/img/content/maniac/maniac-size-m.webp, /img/content/maniac/maniac-size-m@2x.webp 2x"
            />
            <img
              src="/img/content/maniac/maniac-size-m.jpg"
              srcSet="/img/content/maniac/maniac-size-m@2x.jpg 2x"
              width="1366"
              height="768"
              alt=""
            />
          </picture>
        </div>

        <div className="container container--size-l">
          <div className="login__form">
            <form
              className="login-form"
              action="#"
              method="post"
              onSubmit={handleSubmit}
            >
              <div className="login-form__inner-wrapper">
                <h1 className="title title--size-s login-form__title">Вход</h1>

                <div className="login-form__inputs">
                  <div className="custom-input login-form__input">
                    <label className="custom-input__label" htmlFor="email">
                      E&nbsp;&ndash;&nbsp;mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      required
                      placeholder="Адрес электронной почты"
                      autoComplete="username"
                      onChange={(evt) => setEmail(evt.target.value)}
                    />
                  </div>

                  <div className="custom-input login-form__input">
                    <label className="custom-input__label" htmlFor="password">
                      Пароль
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      required
                      placeholder="Пароль"
                      autoComplete="current-password"
                      onChange={(evt) => setPassword(evt.target.value)}
                    />
                  </div>
                </div>

                {errorMessage && (
                  <p className="login-form__error">{errorMessage}</p>
                )}

                <button
                  className="btn btn--accent btn--general login-form__submit"
                  type="submit"
                  disabled={loadingStatus === 'loading'}
                >
                  {loadingStatus === 'loading' ? 'Входим...' : 'Войти'}
                </button>
              </div>

              <label className="custom-checkbox login-form__checkbox">
                <input
                  type="checkbox"
                  id="id-order-agreement"
                  name="user-agreement"
                  required
                />
                <span className="custom-checkbox__icon">
                  <svg width="20" height="17" aria-hidden="true">
                    <use xlinkHref="#icon-tick" />
                  </svg>
                </span>
                <span className="custom-checkbox__label">
                  Я&nbsp;согласен с{' '}
                  <a
                    className="link link--active-silver link--underlined"
                    href="#"
                  >
                    правилами обработки персональных данных
                  </a>
                  &nbsp;и пользовательским соглашением
                </span>
              </label>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
