import { describe, expect, it } from 'vitest';

import { bookingReducer } from '../booking/booking-slice';
import { questsReducer } from '../quests/quests-slice';
import { userReducer } from '../user/user-slice';
import { State } from '../store';
import {
  getQuest,
  getQuestErrorType,
  getQuestLoadingStatus,
} from './selectors';
import { mockQuest } from '../../mocks/test-data';

const makeState = (quest: State['quest']): State =>
  ({
    booking: bookingReducer(undefined, { type: '' }),
    quest,
    quests: questsReducer(undefined, { type: '' }),
    user: userReducer(undefined, { type: '' }),
  }) as State;

describe('quest selectors', () => {
  it('should select quest state fields', () => {
    const questState = {
      quest: mockQuest,
      loadingStatus: 'success' as const,
      errorType: null,
    };

    const state = makeState(questState);

    expect(getQuest(state)).toEqual(mockQuest);
    expect(getQuestLoadingStatus(state)).toBe('success');
    expect(getQuestErrorType(state)).toBeNull();
  });
});
