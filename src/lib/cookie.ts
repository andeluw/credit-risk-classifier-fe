import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const getToken = (): string => {
  return cookies.get('token_labse');
};

export const setToken = (token: string): void => {
  cookies.set('token_labse', token, {
    path: '/',
  });
};

export const removeToken = (): void => {
  cookies.remove('token_labse', {
    path: '/',
  });
};

export const getRefreshToken = (): string => {
  return cookies.get('token_labse_refresh');
};

export const setRefreshToken = (token: string): void => {
  cookies.set('token_labse_refresh', token, {
    path: '/',
  });
};

export const removeRefreshToken = (): void => {
  cookies.remove('token_labse_refresh', {
    path: '/',
  });
};
