import { describe, expect, it } from 'vitest';

import { bookingReducer } from './booking-slice';
import {
  getBookingErrorMessage,
  getBookingLoadingStatus,
  getBookingPlaces,
  getBookingStatus,
  getDeleteReservationStatus,
  getDeletingReservationIds,
  getReservations,
  getReservationsLoadingStatus,
} from './selectors';
import { questReducer } from '../quest/quest-slice';
import { questsReducer } from '../quests/quests-slice';
import { userReducer } from '../user/user-slice';
import { State } from '../store';
import { mockBookingPlace, mockReservation } from '../../mocks/test-data';

const makeState = (booking: State['booking']): State =>
  ({
    booking,
    quest: questReducer(undefined, { type: '' }),
    quests: questsReducer(undefined, { type: '' }),
    user: userReducer(undefined, { type: '' }),
  }) as State;

describe('booking selectors', () => {
  it('should select booking state fields', () => {
    const booking = {
      ...bookingReducer(undefined, { type: '' }),
      places: [mockBookingPlace],
      reservations: [mockReservation],
      deletingReservationIds: ['reservation-1'],
      loadingStatus: 'success' as const,
      bookingStatus: 'loading' as const,
      reservationsLoadingStatus: 'success' as const,
      deleteReservationStatus: 'error' as const,
      errorMessage: 'Ошибка',
    };

    const state = makeState(booking);

    expect(getBookingPlaces(state)).toEqual([mockBookingPlace]);
    expect(getReservations(state)).toEqual([mockReservation]);
    expect(getDeletingReservationIds(state)).toEqual(['reservation-1']);
    expect(getBookingLoadingStatus(state)).toBe('success');
    expect(getBookingStatus(state)).toBe('loading');
    expect(getReservationsLoadingStatus(state)).toBe('success');
    expect(getDeleteReservationStatus(state)).toBe('error');
    expect(getBookingErrorMessage(state)).toBe('Ошибка');
  });
});
