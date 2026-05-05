import { BookingDate, BookingPlace } from '../../types/api';
import { BookingDateTitle, bookingDates, getSlotId } from '../../utils/booking';

type BookingSlotsProps = {
  selectedPlace: BookingPlace | null;
  selectedDate: BookingDate;
  selectedTime: string | null;
  slotError: string | null;
  onSlotChange: (date: BookingDate, time: string) => void;
};

export default function BookingSlots({
  selectedPlace,
  selectedDate,
  selectedTime,
  slotError,
  onSlotChange,
}: BookingSlotsProps) {
  if (!selectedPlace) {
    return null;
  }

  return (
    <fieldset className="booking-form__section">
      <legend className="visually-hidden">Выбор даты и времени</legend>

      {bookingDates.map((date) => (
        <fieldset className="booking-form__date-section" key={date}>
          <legend className="booking-form__date-title">
            {BookingDateTitle[date]}
          </legend>

          <div className="booking-form__date-inner-wrapper">
            {selectedPlace.slots[date].map((slot) => {
              const slotId = getSlotId(date, slot.time);

              return (
                <label className="custom-radio booking-form__date" key={slotId}>
                  <input
                    type="radio"
                    id={slotId}
                    name="date"
                    value={slotId}
                    required
                    checked={
                      selectedDate === date && selectedTime === slot.time
                    }
                    disabled={!slot.isAvailable}
                    onChange={() => onSlotChange(date, slot.time)}
                  />
                  <span className="custom-radio__label">{slot.time}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      {slotError && <p>{slotError}</p>}
    </fieldset>
  );
}
