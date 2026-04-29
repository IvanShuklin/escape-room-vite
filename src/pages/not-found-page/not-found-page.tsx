import { Link } from 'react-router-dom';

import { AppRoute } from '../../types/app-route';

export default function NotFoundPage() {
  return (
    <main>
      <h1>404</h1>
      <Link to={AppRoute.Root}>Вернуться на главную</Link>
    </main>
  );
}
