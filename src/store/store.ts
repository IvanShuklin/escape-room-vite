import { configureStore } from '@reduxjs/toolkit';

import { bookingReducer } from './booking/booking-slice';
import { questReducer } from './quest/quest-slice';
import { questsReducer } from './quests/quests-slice';
import { userReducer } from './user/user-slice';

export const store = configureStore({
  reducer: {
    quests: questsReducer,
    quest: questReducer,
    booking: bookingReducer,
    user: userReducer,
  },
});

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
