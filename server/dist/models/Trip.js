"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripModel = void 0;
const database_1 = require("../config/database");
class TripModel {
    static async create(tripData) {
        const [trip] = await (0, database_1.db)('trips')
            .insert({
            ...tripData,
            created_at: new Date()
        })
            .returning('*');
        return trip;
    }
    static async findById(id) {
        return (0, database_1.db)('trips')
            .where({ id })
            .first();
    }
    static async findByDriverAndDate(driverId, date) {
        return (0, database_1.db)('trips')
            .where({ driver_id: driverId })
            .whereRaw('DATE(departure_time) = ?', [date])
            .orderBy('departure_time');
    }
    static async updateStatus(id, status) {
        const [trip] = await (0, database_1.db)('trips')
            .where({ id })
            .update({ status })
            .returning('*');
        return trip;
    }
    static async findActiveByDriver(driverId) {
        return (0, database_1.db)('trips')
            .where({
            driver_id: driverId,
            status: 'in_progress'
        })
            .first();
    }
}
exports.TripModel = TripModel;
//# sourceMappingURL=Trip.js.map