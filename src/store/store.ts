import { configureStore } from '@reduxjs/toolkit';

import { questReducer } from './quest/quest-slice';
import { questsReducer } from './quests/quests-slice';
import { userReducer } from './user/user-slice';

export const store = configureStore({
  reducer: {
    quests: questsReducer,
    quest: questReducer,
    user: userReducer,
  },
});

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
