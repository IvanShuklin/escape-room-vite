import { describe, expect, it } from 'vitest';

import { bookingReducer } from '../booking/booking-slice';
import { questReducer } from '../quest/quest-slice';
import { userReducer } from '../user/user-slice';
import { State } from '../store';
import {
  getActiveQuestLevel,
  getActiveQuestType,
  getFilteredQuests,
  getQuests,
  getQuestsLoadingStatus,
} from './selectors';
import { QuestPreview } from '../../types/api';

const horrorQuest: QuestPreview = {
  id: 'quest-1',
  title: 'Маньяк',
  previewImg: 'img/maniac.jpg',
  previewImgWebp: 'img/maniac.webp',
  level: 'medium',
  type: 'horror',
  peopleMinMax: [3, 6],
};

const detectiveQuest: QuestPreview = {
  id: 'quest-2',
  title: 'Детектив',
  previewImg: 'img/detective.jpg',
  previewImgWebp: 'img/detective.webp',
  level: 'hard',
  type: 'detective',
  peopleMinMax: [2, 4],
};

const makeState = (quests: State['quests']): State =>
  ({
    booking: bookingReducer(undefined, { type: '' }),
    quest: questReducer(undefined, { type: '' }),
    quests,
    user: userReducer(undefined, { type: '' }),
  }) as State;

describe('quests selectors', () => {
  it('should select quests state fields', () => {
    const questsState = {
      quests: [horrorQuest],
      activeType: 'horror' as const,
      activeLevel: 'medium' as const,
      loadingStatus: 'success' as const,
    };

    const state = makeState(questsState);

    expect(getQuests(state)).toEqual([horrorQuest]);
    expect(getActiveQuestType(state)).toBe('horror');
    expect(getActiveQuestLevel(state)).toBe('medium');
    expect(getQuestsLoadingStatus(state)).toBe('success');
  });

  it('should return all quests when filters are default', () => {
    const state = makeState({
      quests: [horrorQuest, detectiveQuest],
      activeType: 'all',
      activeLevel: 'any',
      loadingStatus: 'success',
    });

    expect(getFilteredQuests(state)).toEqual([horrorQuest, detectiveQuest]);
  });

  it('should filter quests by type', () => {
    const state = makeState({
      quests: [horrorQuest, detectiveQuest],
      activeType: 'horror',
      activeLevel: 'any',
      loadingStatus: 'success',
    });

    expect(getFilteredQuests(state)).toEqual([horrorQuest]);
  });

  it('should filter quests by level', () => {
    const state = makeState({
      quests: [horrorQuest, detectiveQuest],
      activeType: 'all',
      activeLevel: 'hard',
      loadingStatus: 'success',
    });

    expect(getFilteredQuests(state)).toEqual([detectiveQuest]);
  });

  it('should filter quests by type and level', () => {
    const state = makeState({
      quests: [horrorQuest, detectiveQuest],
      activeType: 'horror',
      activeLevel: 'medium',
      loadingStatus: 'success',
    });

    expect(getFilteredQuests(state)).toEqual([horrorQuest]);
  });
});
