import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  createBooking,
  deleteReservation,
  fetchBookingPlaces,
  fetchReservations,
} from '../../services/api';
import { BookingPlace, BookingRequest, Reservation } from '../../types/api';

type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

type BookingState = {
  places: BookingPlace[];
  reservations: Reservation[];
  deletingReservationIds: string[];
  loadingStatus: LoadingStatus;
  bookingStatus: LoadingStatus;
  reservationsLoadingStatus: LoadingStatus;
  deleteReservationStatus: LoadingStatus;
  errorMessage: string | null;
};

const initialState: BookingState = {
  places: [],
  reservations: [],
  deletingReservationIds: [],
  loadingStatus: 'idle',
  bookingStatus: 'idle',
  reservationsLoadingStatus: 'idle',
  deleteReservationStatus: 'idle',
  errorMessage: null,
};

export const loadBookingPlaces = createAsyncThunk<
  BookingPlace[],
  string,
  { rejectValue: string }
>('booking/loadBookingPlaces', async (questId, { rejectWithValue }) => {
  try {
    return await fetchBookingPlaces(questId);
  } catch {
    return rejectWithValue('Не удалось загрузить данные для бронирования');
  }
});

export const createBookingAction = createAsyncThunk<
  Reservation,
  { questId: string; bookingData: BookingRequest },
  { rejectValue: string }
>(
  'booking/createBooking',
  async ({ questId, bookingData }, { rejectWithValue }) => {
    try {
      return await createBooking(questId, bookingData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return rejectWithValue('Проверьте корректность данных бронирования');
      }

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return rejectWithValue('Для бронирования необходимо авторизоваться');
      }

      return rejectWithValue('Не удалось забронировать квест');
    }
  },
);

export const loadReservations = createAsyncThunk<
  Reservation[],
  undefined,
  { rejectValue: string }
>('booking/loadReservations', async (_, { rejectWithValue }) => {
  try {
    return await fetchReservations();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return rejectWithValue(
        'Для просмотра бронирований необходимо авторизоваться',
      );
    }

    return rejectWithValue('Не удалось загрузить бронирования');
  }
});

export const deleteReservationAction = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('booking/deleteReservation', async (reservationId, { rejectWithValue }) => {
  try {
    await deleteReservation(reservationId);

    return reservationId;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return rejectWithValue(
        'Для отмены бронирования необходимо авторизоваться',
      );
    }

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return rejectWithValue('Бронирование не найдено');
    }

    return rejectWithValue('Не удалось отменить бронирование');
  }
});

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBooking: (state) => {
      state.places = [];
      state.loadingStatus = 'idle';
      state.bookingStatus = 'idle';
      state.errorMessage = null;
    },
    clearReservations: (state) => {
      state.reservations = [];
      state.deletingReservationIds = [];
      state.reservationsLoadingStatus = 'idle';
      state.deleteReservationStatus = 'idle';
      state.errorMessage = null;
    },
    resetBookingStatus: (state) => {
      state.bookingStatus = 'idle';
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBookingPlaces.pending, (state) => {
        state.places = [];
        state.loadingStatus = 'loading';
        state.errorMessage = null;
      })
      .addCase(loadBookingPlaces.fulfilled, (state, action) => {
        state.places = action.payload;
        state.loadingStatus = 'success';
        state.errorMessage = null;
      })
      .addCase(loadBookingPlaces.rejected, (state, action) => {
        state.places = [];
        state.loadingStatus = 'error';
        state.errorMessage =
          action.payload ?? 'Не удалось загрузить данные для бронирования';
      })
      .addCase(createBookingAction.pending, (state) => {
        state.bookingStatus = 'loading';
        state.errorMessage = null;
      })
      .addCase(createBookingAction.fulfilled, (state) => {
        state.bookingStatus = 'success';
        state.errorMessage = null;
      })
      .addCase(createBookingAction.rejected, (state, action) => {
        state.bookingStatus = 'error';
        state.errorMessage = action.payload ?? 'Не удалось забронировать квест';
      })
      .addCase(loadReservations.pending, (state) => {
        state.reservations = [];
        state.reservationsLoadingStatus = 'loading';
        state.errorMessage = null;
      })
      .addCase(loadReservations.fulfilled, (state, action) => {
        state.reservations = action.payload;
        state.reservationsLoadingStatus = 'success';
        state.errorMessage = null;
      })
      .addCase(loadReservations.rejected, (state, action) => {
        state.reservations = [];
        state.reservationsLoadingStatus = 'error';
        state.errorMessage =
          action.payload ?? 'Не удалось загрузить бронирования';
      })
      .addCase(deleteReservationAction.pending, (state, action) => {
        state.deleteReservationStatus = 'loading';
        state.deletingReservationIds.push(action.meta.arg);
        state.errorMessage = null;
      })
      .addCase(deleteReservationAction.fulfilled, (state, action) => {
        state.reservations = state.reservations.filter(
          (reservation) => reservation.id !== action.payload,
        );
        state.deletingReservationIds = state.deletingReservationIds.filter(
          (reservationId) => reservationId !== action.payload,
        );
        state.deleteReservationStatus = 'success';
        state.errorMessage = null;
      })
      .addCase(deleteReservationAction.rejected, (state, action) => {
        state.deletingReservationIds = state.deletingReservationIds.filter(
          (reservationId) => reservationId !== action.meta.arg,
        );
        state.deleteReservationStatus = 'error';
        state.errorMessage =
          action.payload ?? 'Не удалось отменить бронирование';
      });
  },
});

export const { clearBooking, clearReservations, resetBookingStatus } =
  bookingSlice.actions;

export const bookingReducer = bookingSlice.reducer;
