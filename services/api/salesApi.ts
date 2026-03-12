import { mockSales } from '@/data/mockData';
import type { Sale } from '@/models/types';

export const salesApi = {
  async list(): Promise<Sale[]> {
    return [...mockSales];
  },
};
