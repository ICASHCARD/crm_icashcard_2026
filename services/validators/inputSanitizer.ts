import DOMPurify from 'dompurify';

export class InputSanitizer {
  static sanitizeText(input: string): string {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
  }

  static sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const sanitized = { ...obj };
    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === 'string') {
        sanitized[key as keyof T] = this.sanitizeText(value) as T[keyof T];
      }
    }
    return sanitized;
  }
}
