import { State } from '../store';

export const getBookingPlaces = (state: State) => state.booking.places;

export const getBookingLoadingStatus = (state: State) =>
  state.booking.loadingStatus;

export const getBookingStatus = (state: State) => state.booking.bookingStatus;

export const getReservations = (state: State) => state.booking.reservations;

export const getReservationsLoadingStatus = (state: State) =>
  state.booking.reservationsLoadingStatus;

export const getDeleteReservationStatus = (state: State) =>
  state.booking.deleteReservationStatus;

export const getDeletingReservationIds = (state: State) =>
  state.booking.deletingReservationIds;

export const getBookingErrorMessage = (state: State) =>
  state.booking.errorMessage;
