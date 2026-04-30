export type QuestLevel = 'easy' | 'medium' | 'hard';

export type QuestType =
  | 'adventures'
  | 'horror'
  | 'mystic'
  | 'detective'
  | 'sci-fi';

export type BookingDate = 'today' | 'tomorrow';

export type PeopleMinMax = [number, number];

export type Coordinates = [number, number];

export type QuestPreview = {
  id: string;
  title: string;
  previewImg: string;
  previewImgWebp: string;
  level: QuestLevel;
  type: QuestType;
  peopleMinMax: PeopleMinMax;
};

export type Quest = QuestPreview & {
  description: string;
  coverImg: string;
  coverImgWebp: string;
};

export type Location = {
  address: string;
  coords: Coordinates;
};

export type BookingSlot = {
  time: string;
  isAvailable: boolean;
};

export type BookingPlace = {
  id: string;
  location: Location;
  slots: {
    today: BookingSlot[];
    tomorrow: BookingSlot[];
  };
};

export type BookingRequest = {
  date: BookingDate;
  time: string;
  contactPerson: string;
  phone: string;
  withChildren: boolean;
  peopleCount: number;
  placeId: string;
};

export type Reservation = BookingRequest & {
  id: string;
  location: Location;
  quest: QuestPreview;
};

export type AuthData = {
  email: string;
  password: string;
};

export type UserData = {
  email: string;
  token: string;
};

export type ApiErrorDetail = {
  property: string;
  value: unknown;
  messages: string[];
};

export type ApiError = {
  errorType: string;
  message: string;
  details?: ApiErrorDetail[];
};
