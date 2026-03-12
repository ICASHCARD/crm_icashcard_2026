import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres').max(100).trim(),
  email: z.string().email('E-mail invalido').trim().toLowerCase(),
  phone: z.string().min(8, 'Telefone invalido').max(20).trim(),
});

export type ContactInput = z.infer<typeof contactSchema>;
