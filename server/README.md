# Marshrutka Backend API

Серверная часть приложения для междугородних маршрутных такси.

## Технологии

- **Node.js** + **TypeScript**
- **Express.js** - веб-фреймворк
- **PostgreSQL** + **Knex.js** - база данных и ORM
- **JWT** - аутентификация
- **Socket.IO** - реальное время
- **YooKassa** - платежи

## Установка и запуск

1. Установить зависимости:
```bash
npm install
```

2. Настроить переменные окружения:
```bash
cp .env.example .env
# Отредактировать .env файл
```

3. Запустить миграции базы данных:
```bash
npm run migrate
```

4. Запустить сервер в режиме разработки:
```bash
npm run dev
```

5. Собрать и запустить в продакшене:
```bash
npm run build
npm start
```

## API Endpoints

### Аутентификация
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Вход

### Маршруты
- `GET /api/v1/routes` - Все маршруты
- `GET /api/v1/routes/:id` - Маршрут по ID
- `GET /api/v1/routes/search` - Поиск по городам

### Рейсы
- `GET /api/v1/trips/schedule/:routeId/:date` - Расписание рейсов
- `POST /api/v1/trips/:tripId/start` - Начать рейс (водитель)
- `POST /api/v1/trips/:tripId/complete` - Завершить рейс (водитель)

### Заказы
- `POST /api/v1/orders` - Создать заказ
- `GET /api/v1/orders/my` - Мои заказы
- `POST /api/v1/orders/:orderId/cancel` - Отменить заказ

## Структура проекта

```
server/
├── src/
│   ├── controllers/     # Логика обработки запросов
│   ├── models/         # Модели данных
│   ├── routes/         # Маршруты API
│   ├── middleware/     # Промежуточное ПО
│   ├── services/       # Бизнес-логика
│   ├── config/         # Конфигурация
│   ├── utils/          # Вспомогательные функции
│   └── jobs/           # Фоновые задачи
├── migrations/         # Миграции БД
├── tests/             # Тесты
└── package.json
```

## Разработка

### Добавление нового эндпоинта

1. Создать метод в контроллере (`src/controllers/`)
2. Добавить маршрут в `src/routes/api.ts`
3. Обновить документацию

### Работа с базой данных

Используется Knex.js для построения запросов:

```typescript
import { db } from '../config/database';

// Получить все записи
const users = await db('users').select('*');

// Создать запись
const [user] = await db('users').insert(data).returning('*');
```

## Развертывание

Рекомендуется использовать Docker для контейнеризации:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## Лицензия

MIT
