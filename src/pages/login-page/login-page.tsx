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

      <main>
        <h1>Вход</h1>

        <form onSubmit={handleSubmit}>
          <p>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={email}
                required
                autoComplete="username"
                onChange={(evt) => setEmail(evt.target.value)}
              />
            </label>
          </p>

          <p>
            <label>
              Пароль
              <input
                type="password"
                name="password"
                value={password}
                required
                autoComplete="current-password"
                onChange={(evt) => setPassword(evt.target.value)}
              />
            </label>
          </p>

          {errorMessage && <p>{errorMessage}</p>}

          <button type="submit" disabled={loadingStatus === 'loading'}>
            {loadingStatus === 'loading' ? 'Входим...' : 'Войти'}
          </button>
        </form>
      </main>
    </>
  );
}
