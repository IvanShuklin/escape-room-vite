import {
  BookingPlace,
  BookingRequest,
  Quest,
  QuestPreview,
  Reservation,
  UserData,
} from '../types/api';

export const mockQuestPreview: QuestPreview = {
  id: 'quest-1',
  title: 'Маньяк',
  previewImg: 'img/maniac.jpg',
  previewImgWebp: 'img/maniac.webp',
  level: 'medium',
  type: 'horror',
  peopleMinMax: [3, 6],
};

export const mockQuest: Quest = {
  ...mockQuestPreview,
  description: 'Описание квеста',
  coverImg: 'img/maniac-bg.jpg',
  coverImgWebp: 'img/maniac-bg.webp',
};

export const mockBookingPlace: BookingPlace = {
  id: 'place-1',
  location: {
    address: 'наб. реки Карповки 5',
    coords: [59.968322, 30.317359],
  },
  slots: {
    today: [
      { time: '10:00', isAvailable: true },
      { time: '12:00', isAvailable: false },
    ],
    tomorrow: [{ time: '14:00', isAvailable: true }],
  },
};

export const mockBookingRequest: BookingRequest = {
  date: 'today',
  time: '10:00',
  contactPerson: 'Иван',
  phone: '89990000000',
  withChildren: false,
  peopleCount: 3,
  placeId: 'place-1',
};

export const mockReservation: Reservation = {
  ...mockBookingRequest,
  id: 'reservation-1',
  location: mockBookingPlace.location,
  quest: mockQuestPreview,
};

export const mockUserData: UserData = {
  email: 'test@test.ru',
  token: 'token',
};
