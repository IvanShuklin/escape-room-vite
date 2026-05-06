import { describe, expect, it } from 'vitest';

import {
  checkAuthAction,
  loginAction,
  logoutAction,
  userReducer,
} from './user-slice';
import { AuthorizationStatus } from '../../types/auth';
import { mockUserData } from '../../mocks/test-data';

const authData = {
  email: 'test@test.ru',
  password: '123456',
};

describe('userReducer', () => {
  it('should return initial state with empty action', () => {
    const result = userReducer(undefined, { type: '' });

    expect(result).toEqual({
      authorizationStatus: AuthorizationStatus.Unknown,
      userData: null,
      loadingStatus: 'idle',
      errorMessage: null,
    });
  });

  it('should set loading on checkAuthAction pending', () => {
    const result = userReducer(
      undefined,
      checkAuthAction.pending('', undefined),
    );

    expect(result.authorizationStatus).toBe(AuthorizationStatus.Unknown);
    expect(result.loadingStatus).toBe('loading');
    expect(result.errorMessage).toBeNull();
  });

  it('should set auth status on checkAuthAction fulfilled', () => {
    const result = userReducer(
      undefined,
      checkAuthAction.fulfilled(mockUserData, '', undefined),
    );

    expect(result.authorizationStatus).toBe(AuthorizationStatus.Auth);
    expect(result.userData).toEqual(mockUserData);
    expect(result.loadingStatus).toBe('success');
  });

  it('should set no auth status on checkAuthAction rejected', () => {
    const result = userReducer(
      undefined,
      checkAuthAction.rejected(new Error(), '', undefined, 'Ошибка'),
    );

    expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    expect(result.userData).toBeNull();
    expect(result.loadingStatus).toBe('idle');
    expect(result.errorMessage).toBeNull();
  });

  it('should set loading on loginAction pending', () => {
    const result = userReducer(undefined, loginAction.pending('', authData));

    expect(result.loadingStatus).toBe('loading');
    expect(result.errorMessage).toBeNull();
  });

  it('should set auth status on loginAction fulfilled', () => {
    const result = userReducer(
      undefined,
      loginAction.fulfilled(mockUserData, '', authData),
    );

    expect(result.authorizationStatus).toBe(AuthorizationStatus.Auth);
    expect(result.userData).toEqual(mockUserData);
    expect(result.loadingStatus).toBe('success');
  });

  it('should set login error on loginAction rejected', () => {
    const result = userReducer(
      undefined,
      loginAction.rejected(new Error(), '', authData, 'Неверный email'),
    );

    expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    expect(result.userData).toBeNull();
    expect(result.loadingStatus).toBe('error');
    expect(result.errorMessage).toBe('Неверный email');
  });

  it('should clear user data on logoutAction fulfilled', () => {
    const state = {
      authorizationStatus: AuthorizationStatus.Auth,
      userData: mockUserData,
      loadingStatus: 'success' as const,
      errorMessage: null,
    };

    const result = userReducer(
      state,
      logoutAction.fulfilled(undefined, '', undefined),
    );

    expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    expect(result.userData).toBeNull();
    expect(result.loadingStatus).toBe('idle');
    expect(result.errorMessage).toBeNull();
  });

  it('should clear user data on logoutAction rejected', () => {
    const state = {
      authorizationStatus: AuthorizationStatus.Auth,
      userData: mockUserData,
      loadingStatus: 'success' as const,
      errorMessage: null,
    };

    const result = userReducer(
      state,
      logoutAction.rejected(new Error(), '', undefined, 'Ошибка выхода'),
    );

    expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    expect(result.userData).toBeNull();
    expect(result.loadingStatus).toBe('idle');
    expect(result.errorMessage).toBeNull();
  });
});
