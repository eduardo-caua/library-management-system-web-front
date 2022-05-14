import axios from 'axios';

import { responseInterceptor, errorInterceptor } from './interceptors';
import { Environment } from '../../../environment';

const API = axios.create({
  baseURL: Environment.URL_BASE,
});

API.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error),
);

export { API };
