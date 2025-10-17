# Configuración Local Sin Docker

Esta guía te ayudará a configurar el Sistema Nacional de Visitas en tu máquina local sin usar Docker.

## Requisitos Previos

### 1. Instalar PHP 8.1 o superior

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install php8.1 php8.1-cli php8.1-common php8.1-mysql php8.1-redis php8.1-xml php8.1-xmlrpc php8.1-curl php8.1-gd php8.1-imagick php8.1-cli php8.1-dev php8.1-imap php8.1-mbstring php8.1-opcache php8.1-soap php8.1-zip php8.1-intl php8.1-bcmath
```

**macOS (con Homebrew):**
```bash
brew install php@8.1
brew install php-redis
```

**Windows:**
Descarga PHP desde https://windows.php.net/download/

### 2. Instalar Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### 3. Instalar MariaDB 10.3+ (o MySQL 8.0+)

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mariadb-server
sudo mysql_secure_installation
sudo systemctl start mariadb
sudo systemctl enable mariadb
```

**macOS (con Homebrew):**
```bash
brew install mariadb
brew services start mariadb
mysql_secure_installation
```

### 4. Instalar Redis

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

**macOS (con Homebrew):**
```bash
brew install redis
brew services start redis
```

### 5. Instalar Node.js 18+

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**macOS (con Homebrew):**
```bash
brew install node
```

### 6. Instalar un Servidor Web (Apache o Nginx)

**Apache (Ubuntu/Debian):**
```bash
sudo apt install apache2
sudo a2enmod rewrite
sudo systemctl restart apache2
```

**Nginx (Ubuntu/Debian):**
```bash
sudo apt install nginx
```

## Configuración del Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/sistema-visitas-nacional.git
cd sistema-visitas-nacional
```

### 2. Configurar el Backend (Laravel)

#### Crear base de datos
```bash
# Usar MariaDB (o MySQL si prefieres)
mariadb -u root -p
# O si usas MySQL: mysql -u root -p

CREATE DATABASE sistema_visitas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'visitas_user'@'localhost' IDENTIFIED BY 'secret';
GRANT ALL PRIVILEGES ON sistema_visitas.* TO 'visitas_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Configurar archivo .env
```bash
cd backend
cp .env.example .env
```

Editar el archivo `.env` con la configuración local:

```env
APP_NAME="Sistema Nacional de Visitas"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=daily
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sistema_visitas
DB_USERNAME=visitas_user
DB_PASSWORD=secret

BROADCAST_DRIVER=log
CACHE_DRIVER=redis
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@visitas.local
MAIL_FROM_NAME="${APP_NAME}"
```

#### Instalar dependencias y configurar
```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan storage:link
php artisan migrate
php artisan db:seed
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 3. Configurar el Frontend (Vue.js)

```bash
cd ../frontend
npm install
```

Editar el archivo `.env` del frontend:
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_URL=http://localhost:3000
VITE_APP_NAME="Sistema Nacional de Visitas"
VITE_APP_ENV=local
```

### 4. Configurar Servidor Web

#### Opción A: Usar PHP Built-in Server (Desarrollo)
```bash
cd backend
php artisan serve --host=0.0.0.0 --port=8000
```

#### Opción B: Configurar Apache
Crear archivo `/etc/apache2/sites-available/visitas.conf`:
```apache
<VirtualHost *:80>
    ServerName visitas.local
    DocumentRoot /ruta/completa/sistema-visitas-nacional/backend/public

    <Directory /ruta/completa/sistema-visitas-nacional/backend/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/visitas-error.log
    CustomLog ${APACHE_LOG_DIR}/visitas-access.log combined
</VirtualHost>
```

```bash
sudo a2ensite visitas.conf
sudo systemctl reload apache2
```

#### Opción C: Configurar Nginx
Crear archivo `/etc/nginx/sites-available/visitas`:
```nginx
server {
    listen 80;
    server_name visitas.local;
    root /ruta/completa/sistema-visitas-nacional/backend/public;

    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/visitas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Configurar Mailhog (Opcional - para pruebas de email)

```bash
# Descargar y ejecutar Mailhog
curl -L https://github.com/mailhog/MailHog/releases/download/v1.0.0/MailHog_linux_amd64 -o mailhog
chmod +x mailhog
sudo mv mailhog /usr/local/bin/

# Ejecutar Mailhog
mailhog
```

Mailhog estará disponible en http://localhost:8025

## Iniciar el Sistema

### 1. Iniciar Backend
```bash
cd backend
php artisan serve --host=0.0.0.0 --port=8000
```

### 2. Iniciar Frontend (en otra terminal)
```bash
cd frontend
npm run dev
```

### 3. Iniciar Queue Worker (en otra terminal)
```bash
cd backend
php artisan queue:work --queue=default,notifications,exports --sleep=3 --tries=3 --timeout=90
```

### 4. Iniciar Horizon (si usas Laravel Horizon)
```bash
cd backend
php artisan horizon
```

## URLs del Sistema

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Mailhog** (si está configurado): http://localhost:8025

## Scripts de Administración Actualizados

Los scripts en la carpeta `scripts/` han sido actualizados para funcionar sin Docker. Usa:

```bash
# Instalación local
./scripts/install-local.sh

# Iniciar servicios
./scripts/start-local.sh

# Detener servicios
./scripts/stop-local.sh

# Ver logs
./scripts/logs-local.sh
```

## Solución de Problemas

### PHP no encuentra extensiones
```bash
# Verificar extensiones instaladas
php -m | grep -E "(mysql|redis|gd|xml)"

# Instalar extensiones faltantes
sudo apt install php8.1-[nombre-extension]
```

### Permisos en storage y bootstrap/cache
```bash
cd backend
sudo chown -R $USER:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

### Error de conexión a Redis
```bash
# Verificar si Redis está ejecutándose
redis-cli ping
# Debería responder: PONG

# Si no responde, iniciar Redis
sudo systemctl start redis-server
```

### Error de conexión a MySQL
```bash
# Verificar credenciales en .env
mysql -u visitas_user -p sistema_visitas
# Si no puedes conectar, revisar usuario y contraseña
```

## Notas de Seguridad

1. **Cambia las contraseñas por defecto** en producción
2. **Configura correctamente los permisos** de archivos y directorios
3. **Usa HTTPS** en producción
4. **Configura un firewall** apropiado
5. **Mantén actualizados** PHP, MySQL, Redis y Node.js

## Soporte

Si encuentras problemas durante la instalación:

1. Revisa los logs en `backend/storage/logs/laravel.log`
2. Verifica que todos los servicios estén ejecutándose
3. Consulta la documentación de desarrollo en `docs/development/README.md`
4. Reporta issues en el repositorio del proyecto