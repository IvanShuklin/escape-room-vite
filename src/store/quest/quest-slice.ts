import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchQuest } from '../../services/api';
import { Quest } from '../../types/api';
import { LoadingStatus } from '../../types/state';

type QuestErrorType = 'not-found' | 'common' | null;

type QuestState = {
  quest: Quest | null;
  loadingStatus: LoadingStatus;
  errorType: QuestErrorType;
};

const initialState: QuestState = {
  quest: null,
  loadingStatus: 'idle',
  errorType: null,
};

export const loadQuest = createAsyncThunk<
  Quest,
  string,
  {
    rejectValue: Exclude<QuestErrorType, null>;
  }
>('quest/loadQuest', async (questId, { rejectWithValue }) => {
  try {
    return await fetchQuest(questId);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return rejectWithValue('not-found');
    }

    return rejectWithValue('common');
  }
});

const questSlice = createSlice({
  name: 'quest',
  initialState,
  reducers: {
    clearQuest: (state) => {
      state.quest = null;
      state.loadingStatus = 'idle';
      state.errorType = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadQuest.pending, (state) => {
        state.quest = null;
        state.loadingStatus = 'loading';
        state.errorType = null;
      })
      .addCase(loadQuest.fulfilled, (state, action) => {
        state.quest = action.payload;
        state.loadingStatus = 'success';
        state.errorType = null;
      })
      .addCase(loadQuest.rejected, (state, action) => {
        state.quest = null;
        state.loadingStatus = 'error';
        state.errorType = action.payload ?? 'common';
      });
  },
});

export const { clearQuest } = questSlice.actions;
export const questReducer = questSlice.reducer;
