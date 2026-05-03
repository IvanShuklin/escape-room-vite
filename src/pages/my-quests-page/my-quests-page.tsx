import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { generatePath, Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  clearReservations,
  deleteReservationAction,
  loadReservations,
} from '../../store/booking/booking-slice';
import {
  getBookingErrorMessage,
  getDeletingReservationIds,
  getReservations,
  getReservationsLoadingStatus,
} from '../../store/booking/selectors';
import { AppRoute } from '../../types/app-route';
import { BookingDate, QuestLevel, Reservation } from '../../types/api';

type ReservationCardProps = {
  reservation: Reservation;
  isDeleting: boolean;
  onReservationDelete: (reservationId: string) => void;
};

const BookingDateTitle: Record<BookingDate, string> = {
  today: 'сегодня',
  tomorrow: 'завтра',
};

const QuestLevelTitle: Record<QuestLevel, string> = {
  easy: 'легкий',
  medium: 'средний',
  hard: 'сложный',
};

function ReservationCard({
  reservation,
  isDeleting,
  onReservationDelete,
}: ReservationCardProps) {
  const { id, quest, date, time, location, peopleCount } = reservation;

  const handleReservationDeleteButtonClick = () => {
    onReservationDelete(id);
  };

  return (
    <div className="quest-card">
      <div className="quest-card__img">
        <picture>
          <source srcSet={quest.previewImgWebp} type="image/webp" />
          <img
            src={quest.previewImg}
            width="344"
            height="232"
            alt={`Квест ${quest.title}`}
          />
        </picture>
      </div>

      <div className="quest-card__content">
        <div className="quest-card__info-wrapper">
          <Link
            className="quest-card__link"
            to={generatePath(AppRoute.Quest, { questId: quest.id })}
          >
            {quest.title}
          </Link>

          <span className="quest-card__info">
            {`[${BookingDateTitle[date]}, ${time}. ${location.address}]`}
          </span>

          <ul className="tags__item">
            <li className="tags__item">
              <svg width="11" height="14" aria-hidden="true">
                <use xlinkHref="#icon-person"></use>
              </svg>
              {`${peopleCount} чел`}
            </li>
            <li className="tags__item">
              <svg width="14" height="14" aria-hidden="true">
                <use xlinkHref="#icon-level"></use>
              </svg>
              {QuestLevelTitle[quest.level]}
            </li>
          </ul>
        </div>

        <button
          className="btn btn--accent btn--secondary quest-card__btn"
          type="button"
          disabled={isDeleting}
          onClick={handleReservationDeleteButtonClick}
        >
          {isDeleting ? 'Отменяем...' : 'Отменить'}
        </button>
      </div>
    </div>
  );
}

export default function MyQuestsPage() {
  const dispatch = useAppDispatch();

  const reservations = useAppSelector(getReservations);
  const loadingStatus = useAppSelector(getReservationsLoadingStatus);
  const deletingReservationIds = useAppSelector(getDeletingReservationIds);
  const errorMessage = useAppSelector(getBookingErrorMessage);

  const isLoading = loadingStatus === 'loading';
  const isError = loadingStatus === 'error';
  const hasReservations = reservations.length > 0;

  useEffect(() => {
    dispatch(loadReservations());

    return () => {
      dispatch(clearReservations());
    };
  }, [dispatch]);

  const handleReservationDelete = (reservationId: string) => {
    void dispatch(deleteReservationAction(reservationId));
  };

  return (
    <>
      <Helmet>
        <title>Escape Room — мои бронирования</title>
      </Helmet>

      <main className="page-content">
        <div className="container">
          <div className="page-content__title-wrapper">
            <h1 className="title title--size-m">Мои бронирования</h1>
          </div>

          {isLoading && <p>Загружаем бронирования...</p>}

          {isError && (
            <p>{errorMessage ?? 'Не удалось загрузить бронирования'}</p>
          )}

          {!isLoading && !isError && !hasReservations && (
            <p>У вас пока нет бронирований.</p>
          )}

          {!isLoading && !isError && hasReservations && (
            <>
              {errorMessage && <p>{errorMessage}</p>}

              <div className="cards-grid">
                {reservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    isDeleting={deletingReservationIds.includes(reservation.id)}
                    onReservationDelete={handleReservationDelete}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
