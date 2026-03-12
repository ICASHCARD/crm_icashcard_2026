import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().optional().or(z.literal('')),
  VITE_GEMINI_API_KEY: z.string().optional().or(z.literal('')),
});

const parsed = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
});

if (!parsed.success) {
  console.warn('Variaveis de ambiente invalidas.', parsed.error.flatten().fieldErrors);
}

export const APP_ENV = {
  API_BASE_URL: parsed.success ? parsed.data.VITE_API_BASE_URL || '' : '',
  GEMINI_API_KEY: parsed.success ? parsed.data.VITE_GEMINI_API_KEY || '' : '',
};
