import { describe, expect, it } from 'vitest';

import {
  changeQuestLevel,
  changeQuestType,
  loadQuests,
  questsReducer,
} from './quests-slice';
import { mockQuestPreview } from '../../mocks/test-data';

describe('questsReducer', () => {
  it('should return initial state with empty action', () => {
    const result = questsReducer(undefined, { type: '' });

    expect(result).toEqual({
      quests: [],
      activeType: 'all',
      activeLevel: 'any',
      loadingStatus: 'idle',
    });
  });

  it('should change active quest type', () => {
    const result = questsReducer(undefined, changeQuestType('horror'));

    expect(result.activeType).toBe('horror');
  });

  it('should change active quest level', () => {
    const result = questsReducer(undefined, changeQuestLevel('medium'));

    expect(result.activeLevel).toBe('medium');
  });

  it('should set loading status on loadQuests pending', () => {
    const result = questsReducer(undefined, loadQuests.pending('', undefined));

    expect(result.loadingStatus).toBe('loading');
  });

  it('should set quests on loadQuests fulfilled', () => {
    const result = questsReducer(
      undefined,
      loadQuests.fulfilled([mockQuestPreview], '', undefined),
    );

    expect(result.quests).toEqual([mockQuestPreview]);
    expect(result.loadingStatus).toBe('success');
  });

  it('should set error status on loadQuests rejected', () => {
    const result = questsReducer(
      undefined,
      loadQuests.rejected(new Error(), '', undefined),
    );

    expect(result.loadingStatus).toBe('error');
  });
});
