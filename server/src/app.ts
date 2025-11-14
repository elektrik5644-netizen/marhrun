import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import apiRoutes from './routes/api';

dotenv.config();

const app = express();

// CORS настройки
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://marshrutka.fun', 'https://www.marshrutka.fun', 'https://*.vercel.app']
    : '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Мидлвары
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Health check для Vercel
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Marshrutka API is running',
    version: '1.0.0'
  });
});

// Роуты
app.use('/api/v1', apiRoutes);

// Обработка 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработка ошибок
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Экспорт для Vercel
export default app;
