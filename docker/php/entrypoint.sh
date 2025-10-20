#!/bin/bash
set -e

# Esperar a que MySQL esté disponible
echo "Esperando a MySQL..."
while ! nc -z db 3306; do
  sleep 1
done
echo "MySQL está disponible"

# Esperar a que Redis esté disponible  
echo "Esperando a Redis..."
while ! nc -z redis 6379; do
  sleep 1
done
echo "Redis está disponible"

# Crear directorios si no existen
mkdir -p /var/www/storage/app/public
mkdir -p /var/www/storage/framework/cache
mkdir -p /var/www/storage/framework/sessions
mkdir -p /var/www/storage/framework/views
mkdir -p /var/www/bootstrap/cache
mkdir -p /var/log/php-fpm
mkdir -p /var/log/supervisor
mkdir -p /var/log/nginx

# Establecer permisos
chown -R www:www /var/www/storage
chown -R www:www /var/www/bootstrap/cache
chown -R www:www /var/log/php-fpm
chown -R root:root /var/log/supervisor
chown -R www:www /var/log/nginx
chmod -R 775 /var/www/storage
chmod -R 775 /var/www/bootstrap/cache
chmod -R 775 /var/log/php-fpm
chmod -R 755 /var/log/supervisor
chmod -R 775 /var/log/nginx

# Instalar dependencias de Composer
echo "Instalando dependencias de Composer..."
cd /var/www
composer install --no-dev --optimize-autoloader --no-interaction

# Generar clave de aplicación
if [ ! -f /var/www/.env ] || ! grep -q "APP_KEY=" /var/www/.env; then
    echo "Generando clave de aplicación..."
    php artisan key:generate --force
fi

# Ejecutar migraciones
echo "Ejecutando migraciones..."
php artisan migrate --force

echo "Inicialización completada. Iniciando supervisord..."

# Ejecutar el comando por defecto (supervisord)
exec "$@"