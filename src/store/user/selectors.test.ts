import { describe, expect, it } from 'vitest';

import { bookingReducer } from '../booking/booking-slice';
import { questReducer } from '../quest/quest-slice';
import { questsReducer } from '../quests/quests-slice';
import { State } from '../store';
import {
  getAuthorizationStatus,
  getUserData,
  getUserErrorMessage,
  getUserLoadingStatus,
} from './selectors';
import { AuthorizationStatus } from '../../types/auth';
import { mockUserData } from '../../mocks/test-data';

const makeState = (user: State['user']): State =>
  ({
    booking: bookingReducer(undefined, { type: '' }),
    quest: questReducer(undefined, { type: '' }),
    quests: questsReducer(undefined, { type: '' }),
    user,
  }) as State;

describe('user selectors', () => {
  it('should select user state fields', () => {
    const user = {
      authorizationStatus: AuthorizationStatus.Auth,
      userData: mockUserData,
      loadingStatus: 'success' as const,
      errorMessage: null,
    };

    const state = makeState(user);

    expect(getAuthorizationStatus(state)).toBe(AuthorizationStatus.Auth);
    expect(getUserData(state)).toEqual(mockUserData);
    expect(getUserLoadingStatus(state)).toBe('success');
    expect(getUserErrorMessage(state)).toBeNull();
  });
});
