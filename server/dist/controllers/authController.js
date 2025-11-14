"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
class AuthController {
    static async register(req, res) {
        try {
            const { phone, password, firstName, lastName, role = 'passenger' } = req.body;
            // Проверяем, существует ли пользователь
            const existingUser = await User_1.UserModel.findByPhone(phone);
            if (existingUser) {
                return res.status(400).json({ error: 'Пользователь с таким телефоном уже существует' });
            }
            // Хешируем пароль
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            // Создаем пользователя
            const user = await User_1.UserModel.create({
                phone,
                password: hashedPassword,
                first_name: firstName,
                last_name: lastName,
                role,
                is_verified: false
            });
            // Генерируем токен
            const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({
                message: 'Пользователь успешно зарегистрирован',
                token,
                user: {
                    id: user.id,
                    phone: user.phone,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role
                }
            });
        }
        catch (error) {
            console.error('Ошибка регистрации:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    static async login(req, res) {
        try {
            const { phone, password } = req.body;
            // Находим пользователя
            const user = await User_1.UserModel.findByPhone(phone);
            if (!user) {
                return res.status(400).json({ error: 'Неверный телефон или пароль' });
            }
            // Проверяем пароль
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: 'Неверный телефон или пароль' });
            }
            // Генерируем токен
            const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
            res.json({
                message: 'Успешный вход',
                token,
                user: {
                    id: user.id,
                    phone: user.phone,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role
                }
            });
        }
        catch (error) {
            console.error('Ошибка входа:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map