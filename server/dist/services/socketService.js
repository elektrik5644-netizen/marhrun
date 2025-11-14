"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
class SocketService {
    constructor(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        this.setupSocketEvents();
    }
    setupSocketEvents() {
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
    sendLocationUpdate(tripId, location) {
        this.io.to(`trip-${tripId}`).emit('location-update', {
            tripId,
            location,
            timestamp: new Date()
        });
    }
    // Уведомление о начале рейса
    notifyTripStarted(tripId) {
        this.io.to(`trip-${tripId}`).emit('trip-started', {
            tripId,
            message: 'Рейс начался'
        });
    }
    // Уведомление о завершении рейса
    notifyTripCompleted(tripId) {
        this.io.to(`trip-${tripId}`).emit('trip-completed', {
            tripId,
            message: 'Рейс завершен'
        });
    }
}
exports.default = SocketService;
//# sourceMappingURL=socketService.js.map