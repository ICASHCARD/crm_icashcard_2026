import { contactSchema } from '@/models/schemas/contactSchema';
import { contactsApi } from '@/services/api/contactsApi';
import { InputSanitizer } from '@/services/validators/inputSanitizer';

export class ContactsController {
  static async list() {
    return contactsApi.list();
  }

  static validate(input: unknown) {
    if (!input || typeof input !== 'object') {
      return contactSchema.safeParse(input);
    }

    const sanitized = InputSanitizer.sanitizeObject(input as Record<string, unknown>);
    return contactSchema.safeParse(sanitized);
  }
}
