import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchQuests } from '../../services/api';
import { QuestLevel, QuestPreview, QuestType } from '../../types/api';

type QuestsState = {
  quests: QuestPreview[];
  activeType: QuestType | 'all';
  activeLevel: QuestLevel | 'any';
  loadingStatus: 'idle' | 'loading' | 'success' | 'error';
};

const initialState: QuestsState = {
  quests: [],
  activeType: 'all',
  activeLevel: 'any',
  loadingStatus: 'idle',
};

export const loadQuests = createAsyncThunk<QuestPreview[]>(
  'quests/loadQuests',
  async () => fetchQuests(),
);

const questsSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
    changeQuestType: (state, action: PayloadAction<QuestType | 'all'>) => {
      state.activeType = action.payload;
    },
    changeQuestLevel: (state, action: PayloadAction<QuestLevel | 'any'>) => {
      state.activeLevel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadQuests.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(loadQuests.fulfilled, (state, action) => {
        state.quests = action.payload;
        state.loadingStatus = 'success';
      })
      .addCase(loadQuests.rejected, (state) => {
        state.loadingStatus = 'error';
      });
  },
});

export const { changeQuestType, changeQuestLevel } = questsSlice.actions;
export const questsReducer = questsSlice.reducer;
