import { BookingDate, QuestLevel, QuestType } from './types/api';

export const QuestLevelTitle: Record<QuestLevel, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

export const QuestTypeTitle: Record<QuestType, string> = {
  adventures: 'Приключения',
  horror: 'Ужасы',
  mystic: 'Мистика',
  detective: 'Детектив',
  'sci-fi': 'Sci-fi',
};

export const BookingDateTitle: Record<BookingDate, string> = {
  today: 'Сегодня',
  tomorrow: 'Завтра',
};
