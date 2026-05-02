import { State } from '../store';

export const getAuthorizationStatus = (state: State) =>
  state.user.authorizationStatus;

export const getUserData = (state: State) => state.user.userData;

export const getUserLoadingStatus = (state: State) => state.user.loadingStatus;

export const getUserErrorMessage = (state: State) => state.user.errorMessage;
