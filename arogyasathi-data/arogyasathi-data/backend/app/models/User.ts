export interface IUser {
  id: string; // _id in Mongo, id in Postgres
  name: string;
  email: string;
  password_hash: string;
  preferred_language: 'en' | 'ta' | 'hi';
  role: 'USER' | 'ADMIN' | 'RESEARCHER' | 'REVIEWER';
  is_active: boolean;
  last_login_at?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Stub for backward compatibility
export const User = {};
