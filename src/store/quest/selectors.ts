import { State } from '../store';

export const getQuest = (state: State) => state.quest.quest;

export const getQuestLoadingStatus = (state: State) =>
  state.quest.loadingStatus;

export const getQuestErrorType = (state: State) => state.quest.errorType;
