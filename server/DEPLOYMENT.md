# Инструкция по развертыванию на marshrutka.fun

## Предварительные требования

1. **Сервер**: Ubuntu 20.04/22.04 или Debian 11/12
2. **Домен**: marshrutka.fun должен быть направлен на IP сервера
3. **DNS записи**:
   - A запись: `marshrutka.fun` → IP сервера
   - A запись: `www.marshrutka.fun` → IP сервера
4. **Минимальные требования**:
   - 2 GB RAM
   - 2 CPU cores
   - 20 GB SSD

## Быстрое развертывание

### Шаг 1: Подключение к серверу

```bash
ssh root@ВАШ_IP_АДРЕС
```

### Шаг 2: Копирование файлов на сервер

```bash
# На локальной машине
scp -r server root@ВАШ_IP_АДРЕС:/var/www/marshrutka
```

Или через Git:

```bash
# На сервере
cd /var/www
git clone https://github.com/ВАШ_РЕПОЗИТОРИЙ/marshrutka.git
cd marshrutka/server
```

### Шаг 3: Запуск скрипта развертывания

```bash
cd /var/www/marshrutka/server
chmod +x deploy.sh
sudo ./deploy.sh
```

### Шаг 4: Настройка переменных окружения

```bash
nano /var/www/marshrutka/.env
```

Замените следующие значения:

```env
DB_PASSWORD=ваш_сильный_пароль_для_бд
JWT_SECRET=случайная_строка_минимум_32_символа
YOOKASSA_SHOP_ID=ваш_shop_id
YOOKASSA_SECRET_KEY=ваш_secret_key
YANDEX_MAPS_API_KEY=ваш_api_key
```

### Шаг 5: Перезапуск приложения

```bash
sudo -u marshrutka pm2 restart marshrutka-backend
```

## Ручное развертывание

Если автоматический скрипт не подходит, выполните следующие шаги:

### 1. Установка Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Установка PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres psql

# В psql:
CREATE USER marshrutka_user WITH PASSWORD 'ваш_пароль';
CREATE DATABASE marshrutka_db OWNER marshrutka_user;
GRANT ALL PRIVILEGES ON DATABASE marshrutka_db TO marshrutka_user;
\q
```

### 3. Установка Nginx

```bash
sudo apt install -y nginx
sudo cp nginx.conf /etc/nginx/sites-available/marshrutka.fun
sudo ln -s /etc/nginx/sites-available/marshrutka.fun /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Установка SSL сертификата

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d marshrutka.fun -d www.marshrutka.fun
```

### 5. Установка PM2

```bash
sudo npm install -g pm2
```

### 6. Установка зависимостей и сборка

```bash
cd /var/www/marshrutka/server
npm install
npm run build
npm run migrate
```

### 7. Запуск приложения

```bash
pm2 start dist/app.js --name marshrutka-backend
pm2 save
pm2 startup
```

## Проверка работы

### Проверка статуса сервисов

```bash
# Nginx
sudo systemctl status nginx

# PostgreSQL
sudo systemctl status postgresql

# PM2
pm2 status

# Логи приложения
pm2 logs marshrutka-backend
```

### Тестирование API

```bash
# Проверка доступности
curl https://marshrutka.fun/api/v1/routes

# Должен вернуть JSON с маршрутами или пустой массив
```

## Обновление приложения

```bash
cd /var/www/marshrutka/server

# Получить последние изменения
git pull

# Установить зависимости
npm install

# Собрать
npm run build

# Запустить миграции
npm run migrate

# Перезапустить
pm2 restart marshrutka-backend
```

## Мониторинг

### Просмотр логов

```bash
# Логи приложения
pm2 logs marshrutka-backend

# Логи Nginx
sudo tail -f /var/log/nginx/marshrutka_access.log
sudo tail -f /var/log/nginx/marshrutka_error.log

# Логи PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Мониторинг ресурсов

```bash
# Использование CPU и памяти
pm2 monit

# Системные ресурсы
htop
```

## Резервное копирование

### Создание бэкапа базы данных

```bash
sudo -u postgres pg_dump marshrutka_db > backup_$(date +%Y%m%d).sql
```

### Восстановление из бэкапа

```bash
sudo -u postgres psql marshrutka_db < backup_20231114.sql
```

## Решение проблем

### Приложение не запускается

```bash
# Проверить логи
pm2 logs marshrutka-backend --lines 100

# Проверить переменные окружения
cat /var/www/marshrutka/.env

# Проверить подключение к БД
sudo -u postgres psql -U marshrutka_user -d marshrutka_db
```

### Nginx возвращает 502 Bad Gateway

```bash
# Проверить что приложение запущено
pm2 status

# Проверить порт
netstat -tulpn | grep 5000

# Перезапустить приложение
pm2 restart marshrutka-backend
```

### SSL сертификат не работает

```bash
# Проверить сертификат
sudo certbot certificates

# Обновить сертификат
sudo certbot renew

# Перезапустить Nginx
sudo systemctl restart nginx
```

## Безопасность

### Рекомендации

1. **Firewall**: Разрешить только порты 22, 80, 443
2. **SSH**: Отключить вход по паролю, использовать только ключи
3. **Обновления**: Регулярно обновлять систему
4. **Пароли**: Использовать сильные пароли для БД
5. **Бэкапы**: Настроить автоматическое резервное копирование

### Настройка SSH ключей

```bash
# На локальной машине
ssh-keygen -t ed25519 -C "admin@marshrutka.fun"
ssh-copy-id root@ВАШ_IP_АДРЕС

# На сервере отключить вход по паролю
sudo nano /etc/ssh/sshd_config
# Установить: PasswordAuthentication no
sudo systemctl restart sshd
```

## Контакты и поддержка

При возникновении проблем:
1. Проверьте логи: `pm2 logs marshrutka-backend`
2. Проверьте статус сервисов
3. Обратитесь к документации Nginx, PostgreSQL, PM2
