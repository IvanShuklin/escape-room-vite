import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  checkAuth,
  login as loginRequest,
  logout as logoutRequest,
} from '../../services/api';
import { dropToken, getToken, saveToken } from '../../services/token';
import { AuthData, UserData } from '../../types/api';
import { AuthorizationStatus } from '../../types/auth';
import { LoadingStatus } from '../../types/state';

type UserState = {
  authorizationStatus: AuthorizationStatus;
  userData: UserData | null;
  loadingStatus: LoadingStatus;
  errorMessage: string | null;
};

const initialState: UserState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  userData: null,
  loadingStatus: 'idle',
  errorMessage: null,
};

export const checkAuthAction = createAsyncThunk<
  UserData,
  undefined,
  { rejectValue: string }
>('user/checkAuth', async (_, { rejectWithValue }) => {
  if (!getToken()) {
    return rejectWithValue('Токен отсутствует');
  }

  try {
    return await checkAuth();
  } catch {
    dropToken();
    return rejectWithValue('Пользователь не авторизован');
  }
});

export const loginAction = createAsyncThunk<
  UserData,
  AuthData,
  { rejectValue: string }
>('user/login', async (authData, { rejectWithValue }) => {
  try {
    const userData = await loginRequest(authData);

    saveToken(userData.token);

    return userData;
  } catch {
    return rejectWithValue('Неверный email или пароль');
  }
});

export const logoutAction = createAsyncThunk<
  void,
  undefined,
  { rejectValue: string }
>('user/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutRequest();
  } catch {
    return rejectWithValue('Не удалось завершить сеанс');
  } finally {
    dropToken();
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthAction.pending, (state) => {
        state.authorizationStatus = AuthorizationStatus.Unknown;
        state.loadingStatus = 'loading';
        state.errorMessage = null;
      })
      .addCase(checkAuthAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.userData = action.payload;
        state.loadingStatus = 'success';
        state.errorMessage = null;
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userData = null;
        state.loadingStatus = 'idle';
        state.errorMessage = null;
      })
      .addCase(loginAction.pending, (state) => {
        state.loadingStatus = 'loading';
        state.errorMessage = null;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.userData = action.payload;
        state.loadingStatus = 'success';
        state.errorMessage = null;
      })
      .addCase(loginAction.rejected, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userData = null;
        state.loadingStatus = 'error';
        state.errorMessage = action.payload ?? 'Не удалось авторизоваться';
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userData = null;
        state.loadingStatus = 'idle';
        state.errorMessage = null;
      })
      .addCase(logoutAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userData = null;
        state.loadingStatus = 'idle';
        state.errorMessage = null;
      });
  },
});

export const userReducer = userSlice.reducer;
