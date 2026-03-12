import { z } from 'zod';

export const saleSchema = z.object({
  code: z.string().min(1),
  totalValue: z.number().positive(),
  installments: z.number().int().min(1).max(48),
  taxId: z.string().min(11).max(18),
});

export type SaleInput = z.infer<typeof saleSchema>;
