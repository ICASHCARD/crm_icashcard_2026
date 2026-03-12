import { mockPeople } from '@/data/mockData';
import type { Person } from '@/models/types';

export const contactsApi = {
  async list(): Promise<Person[]> {
    return [...mockPeople];
  },
};
