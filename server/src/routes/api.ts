import express from 'express';
import { AuthController } from '../controllers/authController';
import { RouteController } from '../controllers/routeController';
import { TripController } from '../controllers/tripController';
import { OrderController } from '../controllers/orderController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Публичные роуты
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Защищенные роуты
router.get('/routes', RouteController.getAllRoutes);
router.get('/routes/:id', RouteController.getRouteById);
router.get('/routes/search', RouteController.getRoutesByCities);

router.get('/trips/schedule/:routeId/:date', TripController.getTripSchedule);
router.post('/trips/:tripId/start', authMiddleware, TripController.startTrip);
router.post('/trips/:tripId/complete', authMiddleware, TripController.completeTrip);

router.post('/orders', authMiddleware, OrderController.createOrder);
router.get('/orders/my', authMiddleware, OrderController.getMyOrders);
router.post('/orders/:orderId/cancel', authMiddleware, OrderController.cancelOrder);

export default router;
