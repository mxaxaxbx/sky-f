import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { camelToSnake } from '@/utils/index';
import { decode } from '@/utils/custom-enc-dec';

const DG_STORAGE = process.env.VUE_APP_DG_SKY_SVC;

const baseHttpClient = axios.create({
  baseURL: DG_STORAGE,
  headers: {
    'Content-Type': 'application/json',
  },
});

function customErrorHandler(error: any) {
  if (!error.response) {
    console.error('Network error', error);
    return error;
  }

  switch (error.response.status) {
    case 401: {
      const { VUE_APP_DG_USERS_APP } = process.env;
      window.location.href = `${VUE_APP_DG_USERS_APP}/auth/provider?app=sky`;
      break;
    }
    case 403:
      console.error('Forbidden');
      break;
    case 404:
      console.error('Not found');
      break;
    case 500:
      console.error('Internal server error');
      break;
    default:
      console.error('Unknown error', error);
  }

  console.log('error.response.data?.code', error.response.data?.code);

  switch (error.response.data?.code) {
    case 'SUBS-VAL-004': {
      console.warn('No active subscription found', error.response.data);
      const token = localStorage.getItem('token');
      const { VUE_APP_DG_SUBS } = process.env;
      const url = `${VUE_APP_DG_SUBS}/auth/confirmsession?token=${token}&redirect=/app/services/sky`;
      console.warn(`Redirecting to subscription page: ${url}`);
      window.location.href = url;
      break;
    }
    case 'SUBS-VAL-005': {
      console.warn('subscription expired', error.response.data);
      const token = localStorage.getItem('token');
      const { VUE_APP_DG_SUBS } = process.env;
      const url = `${VUE_APP_DG_SUBS}/auth/confirmsession?token=${token}&redirect=/app/services/sky`;
      console.warn(`Redirecting to subscription page: ${url}`);
      window.location.href = url;
      break;
    }
    case 'FW-PM-003': {
      console.log('no capacities for current active plan', error.response.data);
      const token = localStorage.getItem('token');
      const { VUE_APP_DG_SUBS } = process.env;
      const alert = 'No capacities for current active plan. Please upgrade your plan to continue.';
      const url = `${VUE_APP_DG_SUBS}/auth/confirmsession?token=${token}&redirect=/app/services/sky?alert=${alert}`;
      console.warn(`Redirecting to subscription page: ${url}`);
      window.location.href = url;
      break;
    }
    default:
      console.error('Error code:', error.response.data?.code);
  }

  return error;
}

baseHttpClient.interceptors.request.use((config) => {
  const modifiedConfig = config;

  const token = localStorage.getItem('token');
  if (token) {
    modifiedConfig.headers.Authorization = `DGTK ${token}`;
  }

  return modifiedConfig;
});

baseHttpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    customErrorHandler(error);
    return Promise.reject(error);
  },
);

export const httpClient = baseHttpClient;
