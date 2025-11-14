# 📡 Примеры API запросов для marshrutka.fun

## 🔗 Base URL

```
https://marshrutka.fun/api/v1
```

---

## 🏥 Health Check

### Проверка работы сервера

```bash
curl https://marshrutka.fun
```

**Ответ:**
```json
{
  "status": "ok",
  "message": "Marshrutka API is running",
  "version": "1.0.0"
}
```

---

## 🔐 Аутентификация

### Регистрация водителя

```bash
curl -X POST https://marshrutka.fun/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+79991234567",
    "password": "password123",
    "firstName": "Иван",
    "lastName": "Иванов",
    "role": "driver"
  }'
```

**Ответ:**
```json
{
  "message": "Пользователь успешно зарегистрирован",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "phone": "+79991234567",
    "firstName": "Иван",
    "lastName": "Иванов",
    "role": "driver"
  }
}
```

### Регистрация пассажира

```bash
curl -X POST https://marshrutka.fun/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+79997654321",
    "password": "password123",
    "firstName": "Мария",
    "lastName": "Петрова",
    "role": "passenger"
  }'
```

### Вход

```bash
curl -X POST https://marshrutka.fun/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+79991234567",
    "password": "password123"
  }'
```

**Ответ:**
```json
{
  "message": "Успешный вход",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "phone": "+79991234567",
    "firstName": "Иван",
    "lastName": "Иванов",
    "role": "driver"
  }
}
```

---

## 🗺️ Маршруты

### Получить все маршруты

```bash
curl https://marshrutka.fun/api/v1/routes
```

**Ответ:**
```json
[
  {
    "id": 1,
    "departure_city": "Москва",
    "departure_address": "Красная площадь",
    "departure_lat": 55.753215,
    "departure_lng": 37.622504,
    "arrival_city": "Санкт-Петербург",
    "arrival_address": "Дворцовая площадь",
    "arrival_lat": 59.939095,
    "arrival_lng": 30.315868,
    "duration_minutes": 480,
    "base_price": 1500.00,
    "is_active": true
  }
]
```

### Получить маршрут по ID

```bash
curl https://marshrutka.fun/api/v1/routes/1
```

### Поиск маршрутов

```bash
curl "https://marshrutka.fun/api/v1/routes/search?departureCity=Москва&arrivalCity=Санкт-Петербург"
```

---

## 🚐 Рейсы

### Получить расписание рейсов

```bash
curl https://marshrutka.fun/api/v1/trips/schedule/1/2024-11-15
```

**Ответ:**
```json
[
  {
    "id": 1,
    "route_id": 1,
    "driver_id": 1,
    "vehicle_id": 1,
    "departure_time": "2024-11-15T08:00:00Z",
    "estimated_arrival_time": "2024-11-15T16:00:00Z",
    "available_seats": 15,
    "booked_seats": 3,
    "price": 1500.00,
    "status": "scheduled"
  }
]
```

### Начать рейс (только для водителя)

```bash
curl -X POST https://marshrutka.fun/api/v1/trips/1/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**Ответ:**
```json
{
  "message": "Рейс начат",
  "trip": {
    "id": 1,
    "status": "in_progress"
  }
}
```

### Завершить рейс

```bash
curl -X POST https://marshrutka.fun/api/v1/trips/1/complete \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 🎫 Заказы

### Создать заказ

```bash
curl -X POST https://marshrutka.fun/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tripId": 1,
    "seats": 2,
    "paymentMethod": "card"
  }'
```

**Ответ:**
```json
{
  "order": {
    "id": 1,
    "passenger_id": 2,
    "trip_id": 1,
    "seats": 2,
    "total_price": 3000.00,
    "status": "pending",
    "payment_method": "card",
    "payment_status": "pending"
  }
}
```

### Получить мои заказы

```bash
curl https://marshrutka.fun/api/v1/orders/my \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Ответ:**
```json
[
  {
    "id": 1,
    "trip_id": 1,
    "seats": 2,
    "total_price": 3000.00,
    "status": "confirmed",
    "payment_status": "paid",
    "created_at": "2024-11-14T10:00:00Z"
  }
]
```

### Отменить заказ

```bash
curl -X POST https://marshrutka.fun/api/v1/orders/1/cancel \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**Ответ:**
```json
{
  "order": {
    "id": 1,
    "status": "cancelled"
  }
}
```

---

## 🔒 Авторизация

Для защищенных endpoints используйте токен в заголовке:

```bash
curl https://marshrutka.fun/api/v1/orders/my \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## ❌ Обработка ошибок

### 400 Bad Request

```json
{
  "error": "Не указаны города отправления или назначения"
}
```

### 401 Unauthorized

```json
{
  "error": "Доступ запрещен. Токен отсутствует."
}
```

### 404 Not Found

```json
{
  "error": "Маршрут не найден"
}
```

### 500 Internal Server Error

```json
{
  "error": "Внутренняя ошибка сервера"
}
```

---

## 🧪 Тестирование с Postman

### Импорт коллекции

1. Откройте Postman
2. File → Import
3. Вставьте URL: `https://marshrutka.fun/api/v1`
4. Создайте запросы из примеров выше

### Переменные окружения

Создайте environment с переменными:

```
base_url: https://marshrutka.fun/api/v1
token: ваш_токен_после_входа
```

Используйте в запросах:
```
{{base_url}}/routes
Authorization: Bearer {{token}}
```

---

## 📱 Примеры для мобильных приложений

### JavaScript/TypeScript (React Native)

```typescript
import axios from 'axios';

const API_BASE_URL = 'https://marshrutka.fun/api/v1';

// Вход
const login = async (phone: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    phone,
    password
  });
  return response.data;
};

// Получить маршруты
const getRoutes = async () => {
  const response = await axios.get(`${API_BASE_URL}/routes`);
  return response.data;
};

// Создать заказ
const createOrder = async (token: string, tripId: number, seats: number) => {
  const response = await axios.post(
    `${API_BASE_URL}/orders`,
    { tripId, seats, paymentMethod: 'card' },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
```

---

## 🔍 Полезные команды

### Проверка доступности

```bash
# Простая проверка
curl -I https://marshrutka.fun

# С таймингом
curl -w "@curl-format.txt" -o /dev/null -s https://marshrutka.fun/api/v1/routes
```

### Файл curl-format.txt

```
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_appconnect:  %{time_appconnect}\n
time_pretransfer:  %{time_pretransfer}\n
time_redirect:  %{time_redirect}\n
time_starttransfer:  %{time_starttransfer}\n
----------\n
time_total:  %{time_total}\n
```

---

## 📚 Дополнительная информация

- [Документация API](server/README.md)
- [Развертывание на Vercel](server/VERCEL_DEPLOYMENT.md)
- [Общая документация](README_DEPLOYMENT.md)
