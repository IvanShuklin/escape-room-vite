import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import AppLayout from '../app-layout/app-layout';
import PrivateRoute from '../private-route/private-route';
import MainPage from '../../pages/main-page/main-page';
import QuestPage from '../../pages/quest-page/quest-page';
import BookingPage from '../../pages/booking-page/booking-page';
import ContactsPage from '../../pages/contacts-page/contacts-page';
import LoginPage from '../../pages/login-page/login-page';
import MyQuestsPage from '../../pages/my-quests-page/my-quests-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import { AppRoute } from '../../types/app-route';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getAuthorizationStatus } from '../../store/user/selectors';
import { checkAuthAction, logoutAction } from '../../store/user/user-slice';
import { AuthorizationStatus } from '../../types/auth';

export default function App() {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

  useEffect(() => {
    dispatch(checkAuthAction());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <Routes>
      <Route
        path={AppRoute.Root}
        element={
          <AppLayout isAuthorized={isAuthorized} onLogout={handleLogout} />
        }
      >
        <Route index element={<MainPage />} />

        <Route path={AppRoute.Quest} element={<QuestPage />} />

        <Route
          path={AppRoute.Booking}
          element={
            <PrivateRoute authorizationStatus={authorizationStatus}>
              <BookingPage />
            </PrivateRoute>
          }
        />

        <Route path={AppRoute.Contacts} element={<ContactsPage />} />

        <Route path={AppRoute.Login} element={<LoginPage />} />

        <Route
          path={AppRoute.MyQuests}
          element={
            <PrivateRoute authorizationStatus={authorizationStatus}>
              <MyQuestsPage />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
