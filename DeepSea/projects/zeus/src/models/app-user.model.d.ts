import { Entity } from './app-models';

export interface AppUser extends Entity {
  email?: string;
  contact: string;
  avatar: string;
}
