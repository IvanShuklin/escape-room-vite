import { Outlet } from 'react-router-dom';

import Footer from '../footer/footer';
import Header from '../header/header';

type AppLayoutProps = {
  isAuthorized: boolean;
  onLogout: () => void;
};

export default function AppLayout({ isAuthorized, onLogout }: AppLayoutProps) {
  return (
    <div className="wrapper">
      <Header isAuthorized={isAuthorized} onLogout={onLogout} />

      <Outlet />

      <Footer />
    </div>
  );
}
