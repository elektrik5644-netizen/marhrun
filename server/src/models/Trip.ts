import { db } from '../config/database';

export interface Trip {
  id: number;
  route_id: number;
  driver_id: number;
  vehicle_id: number;
  departure_time: Date;
  estimated_arrival_time: Date;
  available_seats: number;
  price: number;
  status: 'scheduled' | 'boarding' | 'in_progress' | 'completed' | 'cancelled';
  created_at: Date;
}

export class TripModel {
  static async create(tripData: Omit<Trip, 'id' | 'created_at'>): Promise<Trip> {
    const [trip] = await db('trips')
      .insert({
        ...tripData,
        created_at: new Date()
      })
      .returning('*');

    return trip;
  }

  static async findById(id: number): Promise<Trip | undefined> {
    return db('trips')
      .where({ id })
      .first();
  }

  static async findByDriverAndDate(driverId: number, date: string): Promise<Trip[]> {
    return db('trips')
      .where({ driver_id: driverId })
      .whereRaw('DATE(departure_time) = ?', [date])
      .orderBy('departure_time');
  }

  static async updateStatus(id: number, status: Trip['status']): Promise<Trip> {
    const [trip] = await db('trips')
      .where({ id })
      .update({ status })
      .returning('*');

    return trip;
  }

  static async findActiveByDriver(driverId: number): Promise<Trip | undefined> {
    return db('trips')
      .where({
        driver_id: driverId,
        status: 'in_progress'
      })
      .first();
  }
}
