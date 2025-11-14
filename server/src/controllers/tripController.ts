import { Request, Response } from 'express';
import { TripModel } from '../models/Trip';
import { OrderModel } from '../models/Order';

export class TripController {
  static async getTripSchedule(req: Request, res: Response) {
    try {
      const { routeId, date } = req.params;

      // Здесь будет логика получения расписания рейсов
	  // с учетом бронирований и доступных мест

      const trips = await TripModel.findByDriverAndDate(
        parseInt(routeId),
        date
      );

      // Добавляем информацию о доступных местах
      const tripsWithAvailability = await Promise.all(
        trips.map(async (trip: any) => {
          const orders = await OrderModel.findByTrip(trip.id);
          const bookedSeats = orders.reduce((total, order) => total + order.seats, 0);

          return {
            ...trip,
            available_seats: trip.available_seats - bookedSeats,
            booked_seats: bookedSeats
          };
        })
      );

      res.json(tripsWithAvailability);
    } catch (error) {
      console.error('Ошибка получения расписания:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  static async startTrip(req: Request, res: Response) {
    try {
      const { tripId } = req.params;
      const driverId = (req as any).user.userId; // Из мидлвара аутентификации

      const trip = await TripModel.findById(parseInt(tripId));

      if (!trip) {
        return res.status(404).json({ error: 'Рейс не найден' });
      }

      if (trip.driver_id !== driverId) {
        return res.status(403).json({ error: 'Нет доступа к этому рейсу' });
      }

      const updatedTrip = await TripModel.updateStatus(parseInt(tripId), 'in_progress');

      // Уведомляем пассажиров через WebSocket
      // socketService.notifyTripStarted(tripId);

      res.json({ message: 'Рейс начат', trip: updatedTrip });
    } catch (error) {
      console.error('Ошибка начала рейса:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  static async completeTrip(req: Request, res: Response) {
    try {
      const { tripId } = req.params;
      const driverId = (req as any).user.userId;

      const trip = await TripModel.findById(parseInt(tripId));

      if (!trip || trip.driver_id !== driverId) {
        return res.status(404).json({ error: 'Рейс не найден или нет доступа' });
      }

      const updatedTrip = await TripModel.updateStatus(parseInt(tripId), 'completed');

      // Уведомляем пассажиров
      // socketService.notifyTripCompleted(tripId);

      res.json({ message: 'Рейс завершен', trip: updatedTrip });
    } catch (error) {
      console.error('Ошибка завершения рейса:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }
}
