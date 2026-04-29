import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AppRoute } from '../../types/app-route';

type PrivateRouteProps = {
  isAuthorized: boolean;
  children: ReactElement;
};

export default function PrivateRoute({
  isAuthorized,
  children,
}: PrivateRouteProps): ReactElement {
  const location = useLocation();

  return isAuthorized ? (
    children
  ) : (
    <Navigate to={AppRoute.Login} state={{ from: location }} replace />
  );
}
