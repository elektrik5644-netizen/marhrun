"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("../config/database");
class UserModel {
    static async create(userData) {
        const [user] = await (0, database_1.db)('users')
            .insert({
            ...userData,
            created_at: new Date(),
            updated_at: new Date()
        })
            .returning('*');
        return user;
    }
    static async findByPhone(phone) {
        return (0, database_1.db)('users').where({ phone }).first();
    }
    static async findById(id) {
        return (0, database_1.db)('users').where({ id }).first();
    }
    static async update(id, updates) {
        const [user] = await (0, database_1.db)('users')
            .where({ id })
            .update({
            ...updates,
            updated_at: new Date()
        })
            .returning('*');
        return user;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map