import { describe, expect, it } from 'vitest';

import { clearQuest, loadQuest, questReducer } from './quest-slice';
import { mockQuest } from '../../mocks/test-data';

describe('questReducer', () => {
  it('should return initial state with empty action', () => {
    const result = questReducer(undefined, { type: '' });

    expect(result).toEqual({
      quest: null,
      loadingStatus: 'idle',
      errorType: null,
    });
  });

  it('should clear quest', () => {
    const state = {
      quest: mockQuest,
      loadingStatus: 'success' as const,
      errorType: null,
    };

    const result = questReducer(state, clearQuest());

    expect(result).toEqual({
      quest: null,
      loadingStatus: 'idle',
      errorType: null,
    });
  });

  it('should set loading status on loadQuest pending', () => {
    const result = questReducer(undefined, loadQuest.pending('', 'quest-1'));

    expect(result.quest).toBeNull();
    expect(result.loadingStatus).toBe('loading');
    expect(result.errorType).toBeNull();
  });

  it('should set quest on loadQuest fulfilled', () => {
    const result = questReducer(
      undefined,
      loadQuest.fulfilled(mockQuest, '', 'quest-1'),
    );

    expect(result.quest).toEqual(mockQuest);
    expect(result.loadingStatus).toBe('success');
    expect(result.errorType).toBeNull();
  });

  it('should set not-found error on loadQuest rejected with payload', () => {
    const result = questReducer(
      undefined,
      loadQuest.rejected(new Error(), '', 'quest-1', 'not-found'),
    );

    expect(result.quest).toBeNull();
    expect(result.loadingStatus).toBe('error');
    expect(result.errorType).toBe('not-found');
  });

  it('should set common error on loadQuest rejected without payload', () => {
    const result = questReducer(
      undefined,
      loadQuest.rejected(new Error(), '', 'quest-1'),
    );

    expect(result.quest).toBeNull();
    expect(result.loadingStatus).toBe('error');
    expect(result.errorType).toBe('common');
  });
});
