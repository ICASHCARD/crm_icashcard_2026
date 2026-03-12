import { authSchema } from '@/models/schemas/authSchema';
import { authApi } from '@/services/api/authApi';
import { LocalStorageService } from '@/services/storage/localStorage';
import { STORAGE_KEYS } from '@/config/constants';
import { InputSanitizer } from '@/services/validators/inputSanitizer';

export class AuthController {
  static async login(email: string, password: string) {
    const sanitized = InputSanitizer.sanitizeObject({ email, password });
    const validated = authSchema.parse(sanitized);
    const response = await authApi.login(validated);

    LocalStorageService.set(STORAGE_KEYS.USER, response.user);
    LocalStorageService.setToken(response.token);
    LocalStorageService.setRefreshToken(response.refreshToken);
    return response.user;
  }

  static async logout() {
    LocalStorageService.clearAuthData();
  }

  static async checkSession() {
    const token = LocalStorageService.getToken();
    if (!token) return null;

    const user = await authApi.validateToken(token);
    if (!user) {
      LocalStorageService.clearAuthData();
      return null;
    }
    return user;
  }
}
