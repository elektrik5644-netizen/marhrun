import { db } from '../config/database';

export interface Route {
  id: number;
  departure_city: string;
  departure_address: string;
  departure_lat: number;
  departure_lng: number;
  arrival_city: string;
  arrival_address: string;
  arrival_lat: number;
  arrival_lng: number;
  duration_minutes: number;
  base_price: number;
  is_active: boolean;
  created_at: Date;
}

export class RouteModel {
  static async findAll(): Promise<Route[]> {
    return db('routes').where({ is_active: true });
  }

  static async findById(id: number): Promise<Route | undefined> {
    return db('routes').where({ id, is_active: true }).first();
  }
  static async findByCities(departureCity: string, arrivalCity: string): Promise<Route[]> {
    return db('routes')
      .where({
        departure_city: departureCity,
        arrival_city: arrivalCity,
        is_active: true
      });
  }
}
