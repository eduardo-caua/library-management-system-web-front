import { AxiosError } from 'axios';

export const errorInterceptor = (error: AxiosError) => {

  if (error.message === 'Network Error') {
    return Promise.reject(new Error('Connection Error.'));
  }

  if (error.response?.status === 401) {
    return Promise.reject(new Error('Unauthorized.'));
  }

  return Promise.reject(error);
};
