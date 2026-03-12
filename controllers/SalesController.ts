import { saleSchema } from '@/models/schemas/saleSchema';
import { salesApi } from '@/services/api/salesApi';
import { calculateRevenue } from '@/helpers/calculations';

export class SalesController {
  static async list() {
    return salesApi.list();
  }

  static async getTotalRevenue() {
    const sales = await salesApi.list();
    return calculateRevenue(sales);
  }

  static validate(input: unknown) {
    return saleSchema.safeParse(input);
  }
}
