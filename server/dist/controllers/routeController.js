"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteController = void 0;
const Route_1 = require("../models/Route");
class RouteController {
    static async getAllRoutes(req, res) {
        try {
            const routes = await Route_1.RouteModel.findAll();
            res.json(routes);
        }
        catch (error) {
            console.error('Ошибка получения маршрутов:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    static async getRouteById(req, res) {
        try {
            const { id } = req.params;
            const route = await Route_1.RouteModel.findById(parseInt(id));
            if (!route) {
                return res.status(404).json({ error: 'Маршрут не найден' });
            }
            res.json(route);
        }
        catch (error) {
            console.error('Ошибка получения маршрута:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    static async getRoutesByCities(req, res) {
        try {
            const { departureCity, arrivalCity } = req.query;
            if (!departureCity || !arrivalCity) {
                return res.status(400).json({ error: 'Не указаны города отправления или назначения' });
            }
            const routes = await Route_1.RouteModel.findByCities(departureCity, arrivalCity);
            res.json(routes);
        }
        catch (error) {
            console.error('Ошибка поиска маршрутов:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
}
exports.RouteController = RouteController;
//# sourceMappingURL=routeController.js.map