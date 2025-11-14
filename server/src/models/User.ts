import { db } from '../config/database';

export interface User {
  id: number;
  phone: string;
  email?: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'passenger' | 'driver' | 'admin';
  avatar_url?: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const [user] = await db('users')
      .insert({
        ...userData,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    return user;
  }

  static async findByPhone(phone: string): Promise<User | undefined> {
    return db('users').where({ phone }).first();
  }

  static async findById(id: number): Promise<User | undefined> {
    return db('users').where({ id }).first();
  }

  static async update(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db('users')
      .where({ id })
      .update({
        ...updates,
        updated_at: new Date()
      })
      .returning('*');

    return user;
  }
}
