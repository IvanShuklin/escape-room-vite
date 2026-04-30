import axios, { AxiosInstance } from 'axios';
import {
  AuthData,
  BookingPlace,
  BookingRequest,
  Quest,
  QuestPreview,
  Reservation,
  UserData,
} from '../types/api';
import { getToken } from './token';

const BASE_URL = 'https://grading.design.htmlacademy.pro';
const REQUEST_TIMEOUT = 5000;

export const ApiRoute = {
  Quests: '/v1/escape-room/quest',
  Quest: (questId: string) => `/v1/escape-room/quest/${questId}`,
  Booking: (questId: string) => `/v1/escape-room/quest/${questId}/booking`,
  Reservations: '/v1/escape-room/reservation',
  Reservation: (reservationId: string) =>
    `/v1/escape-room/reservation/${reservationId}`,
  Login: '/v1/escape-room/login',
  Logout: '/v1/escape-room/logout',
} as const;

export const createApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use((config) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers['X-Token'] = token;
    }

    return config;
  });

  return api;
};

export const api = createApi();

export const fetchQuests = async (): Promise<QuestPreview[]> => {
  const { data } = await api.get<QuestPreview[]>(ApiRoute.Quests);
  return data;
};

export const fetchQuest = async (questId: string): Promise<Quest> => {
  const { data } = await api.get<Quest>(ApiRoute.Quest(questId));
  return data;
};

export const fetchBookingPlaces = async (
  questId: string,
): Promise<BookingPlace[]> => {
  const { data } = await api.get<BookingPlace[]>(ApiRoute.Booking(questId));
  return data;
};

export const createBooking = async (
  questId: string,
  bookingData: BookingRequest,
): Promise<Reservation> => {
  const { data } = await api.post<Reservation>(
    ApiRoute.Booking(questId),
    bookingData,
  );

  return data;
};

export const fetchReservations = async (): Promise<Reservation[]> => {
  const { data } = await api.get<Reservation[]>(ApiRoute.Reservations);
  return data;
};

export const deleteReservation = async (
  reservationId: string,
): Promise<void> => {
  await api.delete(ApiRoute.Reservation(reservationId));
};

export const login = async (authData: AuthData): Promise<UserData> => {
  const { data } = await api.post<UserData>(ApiRoute.Login, authData);
  return data;
};

export const checkAuth = async (): Promise<UserData> => {
  const { data } = await api.get<UserData>(ApiRoute.Login);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.delete(ApiRoute.Logout);
};
