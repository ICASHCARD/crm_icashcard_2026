import type { AuthPayload, AuthResponse } from '@/models/types';
import { APP_TIMEOUTS } from '@/config/constants';
import { mockUsers } from '@/data/mockData';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const buildToken = () => `${Date.now()}_${Math.random().toString(36).slice(2)}`;

export const authApi = {
  async login(payload: AuthPayload): Promise<AuthResponse> {
    await wait(APP_TIMEOUTS.LOGIN_DELAY_MS);
    const foundUser = mockUsers.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (!foundUser) {
      throw new Error('Credenciais invalidas. Verifique seu e-mail e senha.');
    }
    return {
      token: buildToken(),
      refreshToken: buildToken(),
      user: foundUser,
    };
  },

  async validateToken(token: string): Promise<AuthResponse['user'] | null> {
    if (!token) return null;
    const fallbackUser = mockUsers[0] || null;
    return fallbackUser;
  },
};
