import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import BookingMap from '../../components/booking-map/booking-map';
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

type BookingFormData = {
  contactPerson: string;
  phone: string;
  peopleCount: number;
  withChildren: boolean;
};

const BookingDateTitle: Record<BookingDate, string> = {
  today: 'Сегодня',
  tomorrow: 'Завтра',
};

const phonePattern = /^(?:\+7|8)\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;

const normalizePhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('7')) {
    return `8${digits.slice(1)}`;
  }

  return digits;
};

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
      peopleCount: 2,
      withChildren: false,
    },
  });

  useEffect(() => {
    if (quest) {
      setValue('peopleCount', quest.peopleMinMax[0]);
    }
  }, [quest, setValue]);

  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedPlaceId) ?? null,
    [places, selectedPlaceId],
  );

  const selectedSlots = selectedPlace?.slots[selectedDate] ?? [];

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
    if (places.length > 0 && !selectedPlaceId) {
      setSelectedPlaceId(places[0].id);
    }
  }, [places, selectedPlaceId]);

  useEffect(() => {
    setSelectedTime(null);
    setSlotError(null);
  }, [selectedPlaceId, selectedDate]);

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
              <source srcSet={quest.coverImgWebp} type="image/webp" />
              <img src={quest.coverImg} alt="" />
            </picture>
          )}
        </div>

        <div className="container container--size-s">
          {isLoading && <p>Загружаем данные бронирования...</p>}

          {!isLoading && quest && places.length > 0 && (
            <>
              <p className="subtitle">Бронирование квеста</p>
              <h1 className="title title--size-m title--uppercase">
                {quest.title}
              </h1>

              <div className="page-content__item">
                <BookingMap
                  places={places}
                  selectedPlaceId={selectedPlaceId}
                  onPlaceChange={setSelectedPlaceId}
                />
              </div>
              {places.map((place) => (
                <label
                  className="custom-radio booking-form__radio booking-form__radio--location"
                  key={place.id}
                >
                  <input
                    type="radio"
                    name="location"
                    value={place.id}
                    checked={place.id === selectedPlaceId}
                    onChange={() => setSelectedPlaceId(place.id)}
                  />
                  <span className="custom-radio__label">
                    {place.location.address}
                  </span>
                </label>
              ))}

              <form
                className="booking-form"
                onSubmit={(evt) => {
                  void handleBookingSubmit(evt);
                }}
                action="https://echo.htmlacademy.ru/"
                method="post"
              >
                <fieldset className="booking-form__section">
                  <legend className="visually-hidden">
                    Выбор даты и времени
                  </legend>

                  {selectedPlace && (
                    <fieldset className="booking-form__section">
                      <legend className="booking-form__title">Сегодня</legend>

                      {(['today', 'tomorrow'] as BookingDate[]).map((date) => (
                        <div className="booking-form__date-section" key={date}>
                          <p className="booking-form__date">
                            {BookingDateTitle[date]}
                          </p>

                          <div className="booking-form__slots">
                            {selectedPlace.slots[date].map((slot) => (
                              <label
                                className={`custom-radio booking-form__slot${
                                  !slot.isAvailable
                                    ? ' booking-form__slot--disabled'
                                    : ''
                                }`}
                                key={`${date}-${slot.time}`}
                              >
                                <input
                                  type="radio"
                                  name="time"
                                  value={`${date}-${slot.time}`}
                                  checked={
                                    selectedDate === date &&
                                    selectedTime === slot.time
                                  }
                                  disabled={!slot.isAvailable}
                                  onChange={() => {
                                    handleSlotChange(date, slot.time);
                                  }}
                                />
                                <span className="custom-radio__label">
                                  {slot.time}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      {selectedSlots.length === 0 && (
                        <p>Нет доступных слотов для выбранной даты.</p>
                      )}

                      {slotError && <p>{slotError}</p>}
                    </fieldset>
                  )}
                </fieldset>

                <fieldset className="booking-form__section">
                  <legend className="visually-hidden">
                    Контактная информация
                  </legend>

                  <div className="custom-input booking-form__input">
                    <label className="custom-input__label">Ваше имя</label>
                    <input
                      type="text"
                      placeholder="Имя"
                      id="name"
                      {...register('contactPerson', {
                        required: 'Укажите имя',
                        minLength: {
                          value: 1,
                          message: 'Имя должно содержать от 1 до 15 символов',
                        },
                        maxLength: {
                          value: 15,
                          message: 'Имя должно содержать от 1 до 15 символов',
                        },
                      })}
                    />

                    {errors.contactPerson && (
                      <p>{errors.contactPerson.message}</p>
                    )}
                  </div>

                  <div className="custom-input booking-form__input">
                    <label className="custom-input__label">
                      Контактный телефон
                    </label>
                    <input
                      type="tel"
                      placeholder="+7 (000) 000-00-00"
                      {...register('phone', {
                        required: 'Укажите телефон',
                        pattern: {
                          value: phonePattern,
                          message:
                            'Введите телефон в формате +7 (000) 000-00-00 или 89990000000',
                        },
                      })}
                    />

                    {errors.phone && <p>{errors.phone.message}</p>}
                  </div>

                  <div className="custom-input booking-form__input">
                    <label className="custom-input__label">
                      Количество участников
                    </label>
                    <input
                      type="number"
                      min={quest.peopleMinMax[0]}
                      max={quest.peopleMinMax[1]}
                      {...register('peopleCount', {
                        required: 'Укажите количество участников',
                        valueAsNumber: true,
                        min: {
                          value: quest.peopleMinMax[0],
                          message: `Минимум участников: ${quest.peopleMinMax[0]}`,
                        },
                        max: {
                          value: quest.peopleMinMax[1],
                          message: `Максимум участников: ${quest.peopleMinMax[1]}`,
                        },
                      })}
                    />

                    {errors.peopleCount && <p>{errors.peopleCount.message}</p>}
                  </div>

                  <label className="custom-checkbox booking-form__checkbox booking-form__checkbox--children">
                    <input
                      type="checkbox"
                      id="children"
                      {...register('withChildren')}
                    />
                    <span className="custom-checkbox__icon">
                      <svg width="20" height="17" aria-hidden="true">
                        <use xlinkHref="#icon-tick"></use>
                      </svg>
                    </span>
                    <span className="custom-checkbox__label">
                      Со&nbsp;мной будут дети
                    </span>
                  </label>
                </fieldset>

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
