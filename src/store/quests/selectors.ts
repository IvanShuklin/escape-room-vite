import { createSelector } from '@reduxjs/toolkit';

import { State } from '../store';

export const getQuests = (state: State) => state.quests.quests;

export const getActiveQuestType = (state: State) => state.quests.activeType;

export const getActiveQuestLevel = (state: State) => state.quests.activeLevel;

export const getQuestsLoadingStatus = (state: State) =>
  state.quests.loadingStatus;

export const getFilteredQuests = createSelector(
  [getQuests, getActiveQuestType, getActiveQuestLevel],
  (quests, activeType, activeLevel) =>
    quests.filter((quest) => {
      const isTypeMatched = activeType === 'all' || quest.type === activeType;
      const isLevelMatched =
        activeLevel === 'any' || quest.level === activeLevel;

      return isTypeMatched && isLevelMatched;
    }),
);
