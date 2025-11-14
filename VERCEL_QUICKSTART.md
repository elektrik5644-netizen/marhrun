# ⚡ Быстрый старт: Vercel + marshrutka.fun

## 🚀 За 5 минут

### 1️⃣ Зайдите на Vercel

Откройте [vercel.com](https://vercel.com) и войдите через GitHub

### 2️⃣ Импортируйте проект

1. Нажмите **"Add New Project"**
2. Выберите ваш Git репозиторий
3. Настройте:
   ```
   Root Directory: server
   Framework: Other
   Build Command: npm run build
   ```

### 3️⃣ Добавьте переменные окружения

В разделе **Environment Variables** добавьте:

```env
NODE_ENV=production
DB_HOST=ваш-хост-бд
DB_USER=ваш-пользователь
DB_PASSWORD=ваш-пароль
DB_NAME=marshrutka_db
JWT_SECRET=случайная-строка-32-символа
```

### 4️⃣ Разверните

Нажмите **"Deploy"** и подождите 2-3 минуты

### 5️⃣ Подключите домен

1. Откройте **Settings → Domains**
2. Добавьте `marshrutka.fun`
3. Настройте DNS у регистратора:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```

### 6️⃣ Готово! 🎉

Ваш API доступен по адресу:
- `https://marshrutka.fun/api/v1/routes`
- `https://marshrutka.fun/api/v1/auth/login`

---

## 📱 Обновите мобильные приложения

### DriverApp и PassengerApp

Файл: `src/config/api.config.ts`

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://marshrutka.fun/api/v1',
  TIMEOUT: 15000,
};
```

Пересоберите:
```bash
cd DriverApp/android && .\gradlew assembleDebug
cd PassengerApp/android && .\gradlew assembleDebug
```

---

## 🗄️ База данных

### Вариант 1: Vercel Postgres (проще)

1. В проекте: **Storage → Create Database → Postgres**
2. Vercel автоматически добавит переменные
3. Готово!

### Вариант 2: Supabase (бесплатно)

1. Зарегистрируйтесь на [supabase.com](https://supabase.com)
2. Создайте проект
3. Скопируйте Connection String
4. Добавьте в Vercel Environment Variables

---

## ✅ Проверка

```bash
# Проверьте API
curl https://marshrutka.fun

# Должен вернуть:
{"status":"ok","message":"Marshrutka API is running"}
```

---

## 📖 Подробная документация

- [Полная инструкция по Vercel](server/VERCEL_DEPLOYMENT.md)
- [Развертывание на VPS](server/DEPLOYMENT.md)
- [Основная документация](README_DEPLOYMENT.md)

---

## 🆘 Проблемы?

### API не отвечает
- Проверьте логи: Vercel Dashboard → Deployments → View Logs
- Проверьте переменные окружения

### Домен не работает
- Подождите до 48 часов для DNS
- Проверьте: `nslookup marshrutka.fun`

### База данных не подключается
- Проверьте credentials в Environment Variables
- Убедитесь что БД доступна из интернета

---

**💡 Совет**: Начните с Vercel Postgres - это проще всего!
