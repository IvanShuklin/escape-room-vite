import { State } from '../store';

export const getQuests = (state: State) => state.quests.quests;

export const getActiveQuestType = (state: State) => state.quests.activeType;

export const getQuestsLoadingStatus = (state: State) =>
  state.quests.loadingStatus;

export const getFilteredQuests = (state: State) => {
  const { quests, activeType } = state.quests;

  if (activeType === 'all') {
    return quests;
  }

  return quests.filter((quest) => quest.type === activeType);
};
