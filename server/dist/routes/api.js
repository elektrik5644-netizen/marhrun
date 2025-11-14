"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const routeController_1 = require("../controllers/routeController");
const tripController_1 = require("../controllers/tripController");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Публичные роуты
router.post('/auth/register', authController_1.AuthController.register);
router.post('/auth/login', authController_1.AuthController.login);
// Защищенные роуты
router.get('/routes', routeController_1.RouteController.getAllRoutes);
router.get('/routes/:id', routeController_1.RouteController.getRouteById);
router.get('/routes/search', routeController_1.RouteController.getRoutesByCities);
router.get('/trips/schedule/:routeId/:date', tripController_1.TripController.getTripSchedule);
router.post('/trips/:tripId/start', auth_1.authMiddleware, tripController_1.TripController.startTrip);
router.post('/trips/:tripId/complete', auth_1.authMiddleware, tripController_1.TripController.completeTrip);
router.post('/orders', auth_1.authMiddleware, orderController_1.OrderController.createOrder);
router.get('/orders/my', auth_1.authMiddleware, orderController_1.OrderController.getMyOrders);
router.post('/orders/:orderId/cancel', auth_1.authMiddleware, orderController_1.OrderController.cancelOrder);
exports.default = router;
//# sourceMappingURL=api.js.map