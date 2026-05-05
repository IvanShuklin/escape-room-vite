import { FieldErrors, UseFormRegister } from 'react-hook-form';

import { phonePattern } from '../../utils/booking';

export type BookingFormData = {
  contactPerson: string;
  phone: string;
  peopleCount: number;
  withChildren: boolean;
  userAgreement: boolean;
};

type BookingFormFieldsProps = {
  register: UseFormRegister<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
  peopleMin: number;
  peopleMax: number;
};

export default function BookingFormFields({
  register,
  errors,
  peopleMin,
  peopleMax,
}: BookingFormFieldsProps) {
  return (
    <fieldset className="booking-form__section">
      <legend className="visually-hidden">Контактная информация</legend>

      <div className="custom-input booking-form__input">
        <label className="custom-input__label" htmlFor="name">
          Ваше имя
        </label>
        <input
          type="text"
          id="name"
          placeholder="Имя"
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

        {errors.contactPerson && <p>{errors.contactPerson.message}</p>}
      </div>

      <div className="custom-input booking-form__input">
        <label className="custom-input__label" htmlFor="tel">
          Контактный телефон
        </label>
        <input
          type="tel"
          id="tel"
          placeholder="Телефон"
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
        <label className="custom-input__label" htmlFor="person">
          Количество участников
        </label>
        <input
          type="number"
          id="person"
          placeholder="Количество участников"
          min={peopleMin}
          max={peopleMax}
          {...register('peopleCount', {
            required: 'Укажите количество участников',
            valueAsNumber: true,
            min: {
              value: peopleMin,
              message: `Минимум участников: ${peopleMin}`,
            },
            max: {
              value: peopleMax,
              message: `Максимум участников: ${peopleMax}`,
            },
          })}
        />

        {errors.peopleCount && <p>{errors.peopleCount.message}</p>}
      </div>

      <label className="custom-checkbox booking-form__checkbox booking-form__checkbox--children">
        <input type="checkbox" id="children" {...register('withChildren')} />
        <span className="custom-checkbox__icon">
          <svg width="20" height="17" aria-hidden="true">
            <use xlinkHref="#icon-tick" />
          </svg>
        </span>
        <span className="custom-checkbox__label">Со&nbsp;мной будут дети</span>
      </label>
    </fieldset>
  );
}
