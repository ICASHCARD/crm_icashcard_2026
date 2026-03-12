import type { User } from '../types';

export interface UserEntity extends User {
  fullName?: string;
}
