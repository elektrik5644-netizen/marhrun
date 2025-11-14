import { db } from '../config/database';

export interface Order {
  id: number;
  passenger_id: number;
  trip_id: number;
  seats: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  payment_method: 'cash' | 'card';
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: Date;
}

export class OrderModel {
  static async create(orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
    const [order] = await db('orders')
      .insert({
        ...orderData,
        created_at: new Date()
      })
      .returning('*');

    return order;
  }

  static async findByPassenger(passengerId: number): Promise<Order[]> {
    return db('orders')
      .where({ passenger_id: passengerId })
      .orderBy('created_at', 'desc');
  }

  static async findByTrip(tripId: number): Promise<Order[]> {
    return db('orders')
      .where({ trip_id: tripId })
      .whereIn('status', ['pending', 'confirmed']);
  }

  static async updateStatus(id: number, status: Order['status']): Promise<Order> {
    const [order] = await db('orders')
      .where({ id })
      .update({ status })
      .returning('*');

    return order;
  }

  static async confirmPayment(orderId: number): Promise<Order> {
    const [order] = await db('orders')
      .where({ id: orderId })
      .update({
        payment_status: 'paid',
        status: 'confirmed'
      })
      .returning('*');

    return order;
  }
}
