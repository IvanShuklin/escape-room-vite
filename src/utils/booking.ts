import { BookingDate } from '../types/api';

export const BookingDateTitle: Record<BookingDate, string> = {
  today: 'Сегодня',
  tomorrow: 'Завтра',
};

export const bookingDates: BookingDate[] = ['today', 'tomorrow'];

export const phonePattern =
  /^(?:\+7|8)\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;

export const normalizePhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('7')) {
    return `8${digits.slice(1)}`;
  }

  return digits;
};

export const getSlotId = (date: BookingDate, time: string): string =>
  `${date}${time.replace(':', 'h')}m`;
