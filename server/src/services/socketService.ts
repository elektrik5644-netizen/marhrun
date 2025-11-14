import { Server } from 'socket.io';

class SocketService {
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.setupSocketEvents();
  }

  private setupSocketEvents() {
    this.io.on('connection', (socket) => {
      console.log('Пользователь подключен:', socket.id);

      // Водитель подключается к рейсу
      socket.on('driver-join-trip', (tripId) => {
        socket.join(`trip-${tripId}`);
      });

      // Пассажир подключается к отслеживанию рейса
      socket.on('passenger-track-trip', (tripId) => {
        socket.join(`trip-${tripId}`);
      });

      socket.on('disconnect', () => {
        console.log('Пользователь отключен:', socket.id);
      });
    });
  }

  // Отправка обновления местоположения
  public sendLocationUpdate(tripId: number, location: any) {
    this.io.to(`trip-${tripId}`).emit('location-update', {
      tripId,
      location,
      timestamp: new Date()
    });
  }

  // Уведомление о начале рейса
  public notifyTripStarted(tripId: number) {
    this.io.to(`trip-${tripId}`).emit('trip-started', {
      tripId,
      message: 'Рейс начался'
    });
  }

  // Уведомление о завершении рейса
  public notifyTripCompleted(tripId: number) {
    this.io.to(`trip-${tripId}`).emit('trip-completed', {
      tripId,
      message: 'Рейс завершен'
    });
  }
}

export default SocketService;
