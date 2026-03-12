export const STORAGE_KEYS = {
  USER: 'nexus_user',
  TOKEN: 'nexus_token',
  REFRESH_TOKEN: 'nexus_refresh_token',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
} as const;

export const APP_TIMEOUTS = {
  LOGIN_DELAY_MS: 600,
} as const;
