import axios from 'axios';
import { APP_ENV } from '@/config/env';
import { LocalStorageService } from '@/services/storage/localStorage';

export const apiClient = axios.create({
  baseURL: APP_ENV.API_BASE_URL || '/',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = LocalStorageService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
