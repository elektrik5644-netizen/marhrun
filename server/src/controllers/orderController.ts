import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { Order } from '../models/Order';

export class OrderController {
  static async createOrder(req: Request, res: Response) {
    try {
      const { tripId, seats, paymentMethod } = req.body;
      const passengerId = (req as any).user.userId;

      // Получаем информацию о рейсе для расчета цены
      // const trip = await TripModel.findById(tripId);
      // const totalPrice = trip.price * seats;

      const orderData: Omit<Order, 'id' | 'created_at'> = {
        passenger_id: passengerId,
        trip_id: tripId,
        seats,
        total_price: 0, // Рассчитать цену
        status: 'pending',
        payment_method: paymentMethod,
        payment_status: 'pending'
      };

      const order = await OrderModel.create(orderData);

      res.status(201).json({
        message: 'Заказ создан',
        order
      });
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  static async getMyOrders(req: Request, res: Response) {
    try {
      const passengerId = (req as any).user.userId;
      const orders = await OrderModel.findByPassenger(passengerId);

      res.json(orders);
    } catch (error) {
      console.error('Ошибка получения заказов:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  static async cancelOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const passengerId = (req as any).user.userId;

      const order = await OrderModel.findByPassenger(passengerId).then(orders =>
        orders.find(o => o.id === parseInt(orderId))
      );

      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }

      if (order.status !== 'pending') {
        return res.status(400).json({ error: 'Нельзя отменить этот заказ' });
      }

      const updatedOrder = await OrderModel.updateStatus(parseInt(orderId), 'cancelled');

      res.json({ message: 'Заказ отменен', order: updatedOrder });
    } catch (error) {
      console.error('Ошибка отмены заказа:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }
}
