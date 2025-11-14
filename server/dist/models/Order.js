"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const database_1 = require("../config/database");
class OrderModel {
    static async create(orderData) {
        const [order] = await (0, database_1.db)('orders')
            .insert({
            ...orderData,
            created_at: new Date()
        })
            .returning('*');
        return order;
    }
    static async findByPassenger(passengerId) {
        return (0, database_1.db)('orders')
            .where({ passenger_id: passengerId })
            .orderBy('created_at', 'desc');
    }
    static async findByTrip(tripId) {
        return (0, database_1.db)('orders')
            .where({ trip_id: tripId })
            .whereIn('status', ['pending', 'confirmed']);
    }
    static async updateStatus(id, status) {
        const [order] = await (0, database_1.db)('orders')
            .where({ id })
            .update({ status })
            .returning('*');
        return order;
    }
    static async confirmPayment(orderId) {
        const [order] = await (0, database_1.db)('orders')
            .where({ id: orderId })
            .update({
            payment_status: 'paid',
            status: 'confirmed'
        })
            .returning('*');
        return order;
    }
}
exports.OrderModel = OrderModel;
//# sourceMappingURL=Order.js.map