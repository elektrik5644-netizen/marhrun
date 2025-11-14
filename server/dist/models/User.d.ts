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
export declare class UserModel {
    static create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User>;
    static findByPhone(phone: string): Promise<User | undefined>;
    static findById(id: number): Promise<User | undefined>;
    static update(id: number, updates: Partial<User>): Promise<User>;
}
//# sourceMappingURL=User.d.ts.map