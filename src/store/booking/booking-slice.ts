import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { createBooking, fetchBookingPlaces } from '../../services/api';
import { BookingPlace, BookingRequest, Reservation } from '../../types/api';

type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

type BookingState = {
  places: BookingPlace[];
  loadingStatus: LoadingStatus;
  bookingStatus: LoadingStatus;
  errorMessage: string | null;
};

const initialState: BookingState = {
  places: [],
  loadingStatus: 'idle',
  bookingStatus: 'idle',
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
  {
    questId: string;
    bookingData: BookingRequest;
  },
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
      });
  },
});

export const { clearBooking, resetBookingStatus } = bookingSlice.actions;

export const bookingReducer = bookingSlice.reducer;
