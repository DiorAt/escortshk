#!/bin/bash

# Обновление системы
echo "🔄 Обновление системы..."
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
echo "📦 Установка необходимых пакетов..."
sudo apt install -y curl nginx postgresql postgresql-contrib

# Установка Node.js
echo "📦 Установка Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установка PM2
echo "📦 Установка PM2..."
sudo npm install -g pm2

# Установка зависимостей проекта
echo "📦 Установка зависимостей проекта..."
npm run install-all

# Настройка базы данных
echo "🗄️ Настройка базы данных..."
cd server
npx prisma migrate deploy
cd ..

# Сборка клиентской части
echo "🏗️ Сборка клиентской части..."
cd client
npm run build
cd ..

# Настройка Nginx
echo "🔧 Настройка Nginx..."
sudo tee /etc/nginx/sites-available/escort-catalog << EOF
# Конфигурация для IP и домена по умолчанию
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Включаем сжатие
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Увеличиваем размер загружаемых файлов
    client_max_body_size 50M;
    
    # Настройка кеширования статики
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Клиентская часть
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        
        # Добавляем заголовки безопасности
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";
        
        # Настройка CORS
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
    }

    # API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        
        # Увеличиваем таймауты для долгих запросов
        proxy_connect_timeout 60;
        proxy_send_timeout 60;
        proxy_read_timeout 60;
        send_timeout 60;
    }

    # Обработка ошибок
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

# Создаем директорию для загрузки файлов
echo "📁 Создание директории для загрузки файлов..."
mkdir -p server/uploads
chmod 755 server/uploads

# Активация конфигурации Nginx
sudo ln -sf /etc/nginx/sites-available/escort-catalog /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# Запуск приложения через PM2
echo "🚀 Запуск приложения..."
pm2 start ecosystem.config.js

# Сохранение конфигурации PM2
pm2 save

# Настройка автозапуска PM2
pm2 startup

echo "✅ Деплой завершен!"
echo "🌐 Сайт доступен по IP-адресу сервера"
echo "⚙️ API доступно по адресу: http://IP-адрес/api"

# Вывод информации о статусе сервисов
echo "📊 Статус сервисов:"
systemctl status nginx | grep "Active:"
pm2 list 