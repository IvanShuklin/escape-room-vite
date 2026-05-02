import { State } from '../store';

export const getBookingPlaces = (state: State) => state.booking.places;

export const getBookingLoadingStatus = (state: State) =>
  state.booking.loadingStatus;

export const getBookingStatus = (state: State) => state.booking.bookingStatus;

export const getBookingErrorMessage = (state: State) =>
  state.booking.errorMessage;
