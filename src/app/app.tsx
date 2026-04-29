import { Route, Routes } from 'react-router-dom';

import { AppRoute } from '../types/app-route';
import AppLayout from '../components/app-layout/app-layout';
import PrivateRoute from '../components/private-route/private-route';
import MainPage from '../pages/main-page/main-page';
import QuestPage from '../pages/quest-page/quest-page';
import BookingPage from '../pages/booking-page/booking-page';
import ContactsPage from '../pages/contacts-page/contacts-page';
import LoginPage from '../pages/login-page/login-page';
import MyQuestsPage from '../pages/my-quests-page/my-quests-page';
import NotFoundPage from '../pages/not-found-page/not-found-page';

export default function App() {
  const isAuthorized = false;

  return (
    <Routes>
      <Route
        path={AppRoute.Root}
        element={<AppLayout isAuthorized={isAuthorized} />}
      >
        <Route index element={<MainPage />} />
        <Route path={AppRoute.Quest} element={<QuestPage />} />
        <Route
          path={AppRoute.Booking}
          element={
            <PrivateRoute isAuthorized={isAuthorized}>
              <BookingPage />
            </PrivateRoute>
          }
        />
        <Route path={AppRoute.Contacts} element={<ContactsPage />} />
        <Route path={AppRoute.Login} element={<LoginPage />} />
        <Route
          path={AppRoute.MyQuests}
          element={
            <PrivateRoute isAuthorized={isAuthorized}>
              <MyQuestsPage />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
