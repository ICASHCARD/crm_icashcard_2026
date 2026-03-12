import type { ZodSchema } from 'zod';

export const formValidator = {
  validate<T>(schema: ZodSchema<T>, payload: unknown): { data?: T; errors: string[] } {
    const result = schema.safeParse(payload);
    if (result.success) {
      return { data: result.data, errors: [] };
    }

    return {
      errors: result.error.issues.map((issue) => issue.message),
    };
  },
};
