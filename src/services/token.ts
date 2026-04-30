const AUTH_TOKEN_KEY_NAME = 'escape-room-token';

export const getToken = (): string =>
  localStorage.getItem(AUTH_TOKEN_KEY_NAME) ?? '';

export const saveToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY_NAME, token);
};

export const dropToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY_NAME);
};
