import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('E-mail invalido').trim().toLowerCase(),
  password: z.string().min(6, 'Senha deve ter no minimo 6 caracteres').max(64),
});

export type AuthInput = z.infer<typeof authSchema>;
