import { STORAGE_KEYS } from '@/config/constants';

export class LocalStorageService {
  static get<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  static set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  static getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  static setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  static clearAuthData(): void {
    this.remove(STORAGE_KEYS.USER);
    this.remove(STORAGE_KEYS.TOKEN);
    this.remove(STORAGE_KEYS.REFRESH_TOKEN);
  }
}
