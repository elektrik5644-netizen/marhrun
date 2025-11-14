"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketService = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const api_1 = __importDefault(require("./routes/api"));
const socketService_1 = __importDefault(require("./services/socketService"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Инициализация WebSocket
const socketService = new socketService_1.default(server);
exports.socketService = socketService;
// Мидлвары
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Роуты
app.use('/api/v1', api_1.default);
// Обработка 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});
// Обработка ошибок
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
//# sourceMappingURL=app.js.map