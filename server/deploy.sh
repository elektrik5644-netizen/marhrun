#!/bin/bash

# Скрипт развертывания для marshrutka.fun
# Запускать на сервере от имени root или с sudo

echo "🚀 Начало развертывания Marshrutka Backend на marshrutka.fun"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверка что скрипт запущен с правами root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Пожалуйста, запустите скрипт с sudo${NC}"
    exit 1
fi

# 1. Обновление системы
echo -e "${YELLOW}📦 Обновление системы...${NC}"
apt update && apt upgrade -y

# 2. Установка необходимых пакетов
echo -e "${YELLOW}📦 Установка необходимых пакетов...${NC}"
apt install -y nginx postgresql postgresql-contrib certbot python3-certbot-nginx nodejs npm git

# 3. Установка PM2 для управления Node.js процессом
echo -e "${YELLOW}📦 Установка PM2...${NC}"
npm install -g pm2

# 4. Создание пользователя для приложения
echo -e "${YELLOW}👤 Создание пользователя marshrutka...${NC}"
if ! id "marshrutka" &>/dev/null; then
    useradd -m -s /bin/bash marshrutka
    echo -e "${GREEN}✓ Пользователь создан${NC}"
else
    echo -e "${GREEN}✓ Пользователь уже существует${NC}"
fi

# 5. Создание директории для приложения
echo -e "${YELLOW}📁 Создание директорий...${NC}"
mkdir -p /var/www/marshrutka
mkdir -p /var/www/certbot
chown -R marshrutka:marshrutka /var/www/marshrutka

# 6. Настройка PostgreSQL
echo -e "${YELLOW}🗄️  Настройка PostgreSQL...${NC}"
sudo -u postgres psql -c "CREATE USER marshrutka_user WITH PASSWORD 'ЗАМЕНИТЕ_НА_СИЛЬНЫЙ_ПАРОЛЬ';" 2>/dev/null || echo "Пользователь БД уже существует"
sudo -u postgres psql -c "CREATE DATABASE marshrutka_db OWNER marshrutka_user;" 2>/dev/null || echo "База данных уже существует"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE marshrutka_db TO marshrutka_user;"

# 7. Копирование Nginx конфигурации
echo -e "${YELLOW}⚙️  Настройка Nginx...${NC}"
cp nginx.conf /etc/nginx/sites-available/marshrutka.fun
ln -sf /etc/nginx/sites-available/marshrutka.fun /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Проверка конфигурации Nginx
nginx -t
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Конфигурация Nginx корректна${NC}"
else
    echo -e "${RED}✗ Ошибка в конфигурации Nginx${NC}"
    exit 1
fi

# 8. Получение SSL сертификата
echo -e "${YELLOW}🔒 Получение SSL сертификата...${NC}"
systemctl reload nginx
certbot --nginx -d marshrutka.fun -d www.marshrutka.fun --non-interactive --agree-tos --email admin@marshrutka.fun

# 9. Копирование файлов приложения
echo -e "${YELLOW}📋 Копирование файлов приложения...${NC}"
# Предполагается что код уже скопирован в /var/www/marshrutka
# Если нет, используйте: git clone <your-repo> /var/www/marshrutka

# 10. Установка зависимостей
echo -e "${YELLOW}📦 Установка зависимостей Node.js...${NC}"
cd /var/www/marshrutka
sudo -u marshrutka npm install --production

# 11. Сборка TypeScript
echo -e "${YELLOW}🔨 Сборка приложения...${NC}"
sudo -u marshrutka npm run build

# 12. Копирование production конфигурации
echo -e "${YELLOW}⚙️  Настройка переменных окружения...${NC}"
if [ ! -f .env ]; then
    cp .env.production .env
    echo -e "${YELLOW}⚠️  ВАЖНО: Отредактируйте файл .env и замените пароли!${NC}"
fi

# 13. Запуск миграций базы данных
echo -e "${YELLOW}🗄️  Запуск миграций базы данных...${NC}"
sudo -u marshrutka npm run migrate

# 14. Настройка PM2
echo -e "${YELLOW}🚀 Настройка PM2...${NC}"
sudo -u marshrutka pm2 start dist/app.js --name marshrutka-backend
sudo -u marshrutka pm2 save
pm2 startup systemd -u marshrutka --hp /home/marshrutka

# 15. Настройка автообновления SSL сертификата
echo -e "${YELLOW}🔄 Настройка автообновления SSL...${NC}"
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | crontab -

# 16. Настройка firewall
echo -e "${YELLOW}🔥 Настройка firewall...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 17. Перезапуск сервисов
echo -e "${YELLOW}🔄 Перезапуск сервисов...${NC}"
systemctl restart nginx
systemctl enable nginx

echo -e "${GREEN}✅ Развертывание завершено!${NC}"
echo -e "${GREEN}Сервер доступен по адресу: https://marshrutka.fun${NC}"
echo -e "${YELLOW}⚠️  Не забудьте:${NC}"
echo -e "  1. Отредактировать /var/www/marshrutka/.env"
echo -e "  2. Заменить пароли базы данных"
echo -e "  3. Добавить API ключи для внешних сервисов"
echo -e "  4. Проверить логи: pm2 logs marshrutka-backend"
