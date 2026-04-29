import { Helmet } from 'react-helmet-async';

export default function MainPage() {
  return (
    <main>
      <Helmet>
        <title>Escape Room — квесты в Санкт-Петербурге</title>
      </Helmet>

      <div className="container">
        <div className="page-content">
          <h1 className="title title--size-m page-content__title">
            Выберите тематику
          </h1>
        </div>
      </div>
    </main>
  );
}
