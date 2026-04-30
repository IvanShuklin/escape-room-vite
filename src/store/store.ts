import { configureStore } from '@reduxjs/toolkit';
import { questsReducer } from './quests/quests-slice';

export const store = configureStore({
  reducer: {
    quests: questsReducer,
  },
});

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
