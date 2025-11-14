import { Request, Response } from 'express';
import { RouteModel } from '../models/Route';

export class RouteController {
  static async getAllRoutes(req: Request, res: Response) {
    try {
      const routes = await RouteModel.findAll();
      res.json(routes);
    } catch (error) {
      console.error('Ошибка получения маршрутов:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  static async getRouteById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const route = await RouteModel.findById(parseInt(id));

      if (!route) {
        return res.status(404).json({ error: 'Маршрут не найден' });
      }

      res.json(route);
    } catch (error) {
      console.error('Ошибка получения маршрута:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  static async getRoutesByCities(req: Request, res: Response) {
    try {
      const { departureCity, arrivalCity } = req.query;

      if (!departureCity || !arrivalCity) {
        return res.status(400).json({ error: 'Не указаны города отправления или назначения' });
      }

      const routes = await RouteModel.findByCities(
        departureCity as string,
        arrivalCity as string
      );

      res.json(routes);
    } catch (error) {
      console.error('Ошибка поиска маршрутов:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }
}
