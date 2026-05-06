import { describe, expect, it } from 'vitest';

import {
  bookingReducer,
  clearBooking,
  clearReservations,
  createBookingAction,
  deleteReservationAction,
  loadBookingPlaces,
  loadReservations,
  resetBookingStatus,
} from './booking-slice';
import {
  mockBookingPlace,
  mockBookingRequest,
  mockReservation,
} from '../../mocks/test-data';

describe('bookingReducer', () => {
  it('should return initial state with empty action', () => {
    const result = bookingReducer(undefined, { type: '' });

    expect(result).toEqual({
      places: [],
      reservations: [],
      deletingReservationIds: [],
      loadingStatus: 'idle',
      bookingStatus: 'idle',
      reservationsLoadingStatus: 'idle',
      deleteReservationStatus: 'idle',
      errorMessage: null,
    });
  });

  it('should clear booking data', () => {
    const state = {
      places: [mockBookingPlace],
      reservations: [mockReservation],
      deletingReservationIds: [],
      loadingStatus: 'success' as const,
      bookingStatus: 'error' as const,
      reservationsLoadingStatus: 'idle' as const,
      deleteReservationStatus: 'idle' as const,
      errorMessage: 'Ошибка',
    };

    const result = bookingReducer(state, clearBooking());

    expect(result.places).toEqual([]);
    expect(result.loadingStatus).toBe('idle');
    expect(result.bookingStatus).toBe('idle');
    expect(result.errorMessage).toBeNull();

    expect(result.reservations).toEqual([mockReservation]);
  });

  it('should clear reservations data', () => {
    const state = {
      places: [mockBookingPlace],
      reservations: [mockReservation],
      deletingReservationIds: ['reservation-1'],
      loadingStatus: 'success' as const,
      bookingStatus: 'idle' as const,
      reservationsLoadingStatus: 'success' as const,
      deleteReservationStatus: 'error' as const,
      errorMessage: 'Ошибка',
    };

    const result = bookingReducer(state, clearReservations());

    expect(result.reservations).toEqual([]);
    expect(result.deletingReservationIds).toEqual([]);
    expect(result.reservationsLoadingStatus).toBe('idle');
    expect(result.deleteReservationStatus).toBe('idle');
    expect(result.errorMessage).toBeNull();

    expect(result.places).toEqual([mockBookingPlace]);
  });

  it('should reset booking status', () => {
    const state = {
      places: [],
      reservations: [],
      deletingReservationIds: [],
      loadingStatus: 'idle' as const,
      bookingStatus: 'error' as const,
      reservationsLoadingStatus: 'idle' as const,
      deleteReservationStatus: 'idle' as const,
      errorMessage: 'Ошибка',
    };

    const result = bookingReducer(state, resetBookingStatus());

    expect(result.bookingStatus).toBe('idle');
    expect(result.errorMessage).toBeNull();
  });

  it('should set loading status when booking places are loading', () => {
    const result = bookingReducer(
      undefined,
      loadBookingPlaces.pending('', 'quest-1'),
    );

    expect(result.places).toEqual([]);
    expect(result.loadingStatus).toBe('loading');
    expect(result.errorMessage).toBeNull();
  });

  it('should set booking places on loadBookingPlaces fulfilled', () => {
    const result = bookingReducer(
      undefined,
      loadBookingPlaces.fulfilled([mockBookingPlace], '', 'quest-1'),
    );

    expect(result.places).toEqual([mockBookingPlace]);
    expect(result.loadingStatus).toBe('success');
    expect(result.errorMessage).toBeNull();
  });

  it('should set error on loadBookingPlaces rejected', () => {
    const result = bookingReducer(
      undefined,
      loadBookingPlaces.rejected(new Error(), '', 'quest-1', 'Ошибка загрузки'),
    );

    expect(result.places).toEqual([]);
    expect(result.loadingStatus).toBe('error');
    expect(result.errorMessage).toBe('Ошибка загрузки');
  });

  it('should set booking status on createBookingAction pending', () => {
    const result = bookingReducer(
      undefined,
      createBookingAction.pending('', {
        questId: 'quest-1',
        bookingData: mockBookingRequest,
      }),
    );

    expect(result.bookingStatus).toBe('loading');
    expect(result.errorMessage).toBeNull();
  });

  it('should set booking status on createBookingAction fulfilled', () => {
    const result = bookingReducer(
      undefined,
      createBookingAction.fulfilled(mockReservation, '', {
        questId: 'quest-1',
        bookingData: mockBookingRequest,
      }),
    );

    expect(result.bookingStatus).toBe('success');
    expect(result.errorMessage).toBeNull();
  });

  it('should set booking error on createBookingAction rejected', () => {
    const result = bookingReducer(
      undefined,
      createBookingAction.rejected(
        new Error(),
        '',
        {
          questId: 'quest-1',
          bookingData: mockBookingRequest,
        },
        'Ошибка бронирования',
      ),
    );

    expect(result.bookingStatus).toBe('error');
    expect(result.errorMessage).toBe('Ошибка бронирования');
  });

  it('should load reservations', () => {
    const result = bookingReducer(
      undefined,
      loadReservations.fulfilled([mockReservation], '', undefined),
    );

    expect(result.reservations).toEqual([mockReservation]);
    expect(result.reservationsLoadingStatus).toBe('success');
    expect(result.errorMessage).toBeNull();
  });

  it('should add reservation id to deleting list on delete pending', () => {
    const result = bookingReducer(
      undefined,
      deleteReservationAction.pending('', 'reservation-1'),
    );

    expect(result.deleteReservationStatus).toBe('loading');
    expect(result.deletingReservationIds).toEqual(['reservation-1']);
  });

  it('should remove reservation on delete fulfilled', () => {
    const state = {
      places: [],
      reservations: [mockReservation],
      deletingReservationIds: ['reservation-1'],
      loadingStatus: 'idle' as const,
      bookingStatus: 'idle' as const,
      reservationsLoadingStatus: 'success' as const,
      deleteReservationStatus: 'loading' as const,
      errorMessage: null,
    };

    const result = bookingReducer(
      state,
      deleteReservationAction.fulfilled('reservation-1', '', 'reservation-1'),
    );

    expect(result.reservations).toEqual([]);
    expect(result.deletingReservationIds).toEqual([]);
    expect(result.deleteReservationStatus).toBe('success');
  });
});
