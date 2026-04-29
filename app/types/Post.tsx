import type { UserType } from './User';

export type Post = {
  user_id: string;
  id: string;
  category: string;
  topic: string;
  description: string; 
  User?:  UserType; 
};