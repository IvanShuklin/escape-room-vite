import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AppRoute } from '../../types/app-route';
import { AuthorizationStatus } from '../../types/auth';

type PrivateRouteProps = {
  authorizationStatus: AuthorizationStatus;
  children: ReactElement;
};

export default function PrivateRoute({
  authorizationStatus,
  children,
}: PrivateRouteProps): ReactElement {
  const location = useLocation();

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <p>Проверяем авторизацию...</p>;
  }

  return authorizationStatus === AuthorizationStatus.Auth ? (
    children
  ) : (
    <Navigate to={AppRoute.Login} state={{ from: location }} replace />
  );
}
