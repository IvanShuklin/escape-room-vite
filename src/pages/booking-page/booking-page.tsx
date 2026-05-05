import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import BookingFormFields, {
  BookingFormData,
} from '../../components/booking-form-fields/booking-form-fields';
import BookingMap from '../../components/booking-map/booking-map';
import BookingSlots from '../../components/booking-slots/booking-slots';
import NotFoundPage from '../not-found-page/not-found-page';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  clearBooking,
  createBookingAction,
  loadBookingPlaces,
  resetBookingStatus,
} from '../../store/booking/booking-slice';
import {
  getBookingErrorMessage,
  getBookingLoadingStatus,
  getBookingPlaces,
  getBookingStatus,
} from '../../store/booking/selectors';
import { clearQuest, loadQuest } from '../../store/quest/quest-slice';
import {
  getQuest,
  getQuestErrorType,
  getQuestLoadingStatus,
} from '../../store/quest/selectors';
import { AppRoute } from '../../types/app-route';
import { BookingDate, BookingRequest } from '../../types/api';
import { normalizePhone } from '../../utils/booking';

export default function BookingPage() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const quest = useAppSelector(getQuest);
  const questLoadingStatus = useAppSelector(getQuestLoadingStatus);
  const questErrorType = useAppSelector(getQuestErrorType);
  const places = useAppSelector(getBookingPlaces);
  const placesLoadingStatus = useAppSelector(getBookingLoadingStatus);
  const bookingStatus = useAppSelector(getBookingStatus);
  const errorMessage = useAppSelector(getBookingErrorMessage);

  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<BookingDate>('today');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slotError, setSlotError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      contactPerson: '',
      phone: '',
      peopleCount: 1,
      withChildren: false,
      userAgreement: false,
    },
  });

  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedPlaceId) ?? null,
    [places, selectedPlaceId],
  );

  const isLoading =
    questLoadingStatus === 'loading' || placesLoadingStatus === 'loading';

  const isSubmitDisabled = bookingStatus === 'loading';

  useEffect(() => {
    if (!questId) {
      return;
    }

    dispatch(loadQuest(questId));
    dispatch(loadBookingPlaces(questId));

    return () => {
      dispatch(clearQuest());
      dispatch(clearBooking());
    };
  }, [dispatch, questId]);

  useEffect(() => {
    if (quest) {
      setValue('peopleCount', quest.peopleMinMax[0]);
    }
  }, [quest, setValue]);

  useEffect(() => {
    if (places.length > 0 && !selectedPlaceId) {
      setSelectedPlaceId(places[0].id);
    }
  }, [places, selectedPlaceId]);

  useEffect(() => {
    setSelectedTime(null);
    setSlotError(null);
  }, [selectedPlaceId]);

  useEffect(() => {
    dispatch(resetBookingStatus());
  }, [dispatch]);

  if (!questId) {
    return <Navigate to={AppRoute.Root} replace />;
  }

  if (questErrorType === 'not-found') {
    return <NotFoundPage />;
  }

  const handleSlotChange = (date: BookingDate, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSlotError(null);
  };

  const handleBookingSubmit = handleSubmit((formData) => {
    if (!selectedPlaceId || !selectedTime) {
      setSlotError('Выберите место, дату и время бронирования');
      return;
    }

    const bookingData: BookingRequest = {
      date: selectedDate,
      time: selectedTime,
      contactPerson: formData.contactPerson,
      phone: normalizePhone(formData.phone),
      withChildren: formData.withChildren,
      peopleCount: Number(formData.peopleCount),
      placeId: selectedPlaceId,
    };

    void dispatch(createBookingAction({ questId, bookingData }))
      .unwrap()
      .then(() => {
        navigate(AppRoute.MyQuests);
      })
      .catch(() => undefined);
  });

  return (
    <>
      <Helmet>
        <title>
          {quest ? `Escape Room — бронирование ${quest.title}` : 'Escape Room'}
        </title>
      </Helmet>

      <main className="page-content decorated-page">
        <div className="decorated-page__decor" aria-hidden="true">
          {quest && (
            <picture>
              <source type="image/webp" srcSet={quest.coverImgWebp} />
              <img src={quest.coverImg} width="1366" height="1959" alt="" />
            </picture>
          )}
        </div>

        <div className="container container--size-s">
          {isLoading && <p>Загружаем данные бронирования...</p>}

          {!isLoading && quest && places.length > 0 && (
            <>
              <div className="page-content__title-wrapper">
                <h1 className="subtitle subtitle--size-l page-content__subtitle">
                  Бронирование квеста
                </h1>
                <p className="title title--size-m title--uppercase page-content__title">
                  {quest.title}
                </p>
              </div>

              <div className="page-content__item">
                <BookingMap
                  places={places}
                  selectedPlaceId={selectedPlaceId}
                  onPlaceChange={setSelectedPlaceId}
                />
              </div>

              <form
                className="booking-form"
                action="#"
                method="post"
                onSubmit={(evt) => {
                  void handleBookingSubmit(evt);
                }}
              >
                <BookingSlots
                  selectedPlace={selectedPlace}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  slotError={slotError}
                  onSlotChange={handleSlotChange}
                />

                <BookingFormFields
                  register={register}
                  errors={errors}
                  peopleMin={quest.peopleMinMax[0]}
                  peopleMax={quest.peopleMinMax[1]}
                />

                {errorMessage && <p>{errorMessage}</p>}

                <button
                  className="btn btn--accent btn--cta booking-form__submit"
                  type="submit"
                  disabled={isSubmitDisabled}
                >
                  {bookingStatus === 'loading'
                    ? 'Бронируем...'
                    : 'Забронировать'}
                </button>

                <label className="custom-checkbox booking-form__checkbox booking-form__checkbox--agreement">
                  <input
                    type="checkbox"
                    id="id-order-agreement"
                    required
                    {...register('userAgreement', {
                      required: 'Подтвердите согласие с правилами',
                    })}
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

                {errors.userAgreement && <p>{errors.userAgreement.message}</p>}
              </form>
            </>
          )}

          {!isLoading && placesLoadingStatus === 'error' && (
            <p>{errorMessage ?? 'Не удалось загрузить данные бронирования'}</p>
          )}
        </div>
      </main>
    </>
  );
}
