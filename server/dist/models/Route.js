"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteModel = void 0;
const database_1 = require("../config/database");
class RouteModel {
    static async findAll() {
        return (0, database_1.db)('routes').where({ is_active: true });
    }
    static async findById(id) {
        return (0, database_1.db)('routes').where({ id, is_active: true }).first();
    }
    static async findByCities(departureCity, arrivalCity) {
        return (0, database_1.db)('routes')
            .where({
            departure_city: departureCity,
            arrival_city: arrivalCity,
            is_active: true
        });
    }
}
exports.RouteModel = RouteModel;
//# sourceMappingURL=Route.js.map