#!/bin/bash

# Script de entrada optimizado para el contenedor PHP

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando contenedor PHP...${NC}"

# Esperar a que MySQL esté listo
echo -e "${YELLOW}⏳ Esperando a MySQL...${NC}"
while ! timeout 1 bash -c "echo > /dev/tcp/db/3306" 2>/dev/null; do
  sleep 1
done
echo -e "${GREEN}✅ MySQL está listo${NC}"

# Esperar a que Redis esté listo
echo -e "${YELLOW}⏳ Esperando a Redis...${NC}"
while ! timeout 1 bash -c "echo > /dev/tcp/redis/6379" 2>/dev/null; do
  sleep 1
done
echo -e "${GREEN}✅ Redis está listo${NC}"

# Crear directorios necesarios
echo -e "${YELLOW}📁 Creando directorios...${NC}"
mkdir -p /var/www/storage/app/public
mkdir -p /var/www/storage/framework/cache
mkdir -p /var/www/storage/framework/sessions
mkdir -p /var/www/storage/framework/views
mkdir -p /var/www/bootstrap/cache
mkdir -p /var/log/supervisor
mkdir -p /var/log/php-fpm
mkdir -p /var/log/nginx

# Establecer permisos
echo -e "${YELLOW}🔒 Configurando permisos...${NC}"
chown -R www:www /var/www/storage
chown -R www:www /var/www/bootstrap/cache
chown -R www:www /var/log

# Verificar si composer.json existe antes de instalar dependencias
if [ -f "/var/www/composer.json" ]; then
    # Instalar dependencias de Composer si no existen
    if [ ! -d "/var/www/vendor" ]; then
        echo -e "${YELLOW}📦 Instalando dependencias de Composer...${NC}"
        cd /var/www && composer install --no-dev --optimize-autoloader --no-interaction
    fi
else
    echo -e "${RED}❌ No se encontró composer.json en /var/www${NC}"
    echo -e "${RED}📁 Contenido de /var/www:${NC}"
    ls -la /var/www/
    echo -e "${RED}🔍 Verificando montajes...${NC}"
    mount | grep www
fi

# Generar clave de aplicación si no existe
if [ -z "$(grep '^APP_KEY=' /var/www/.env | cut -d '=' -f2)" ]; then
    echo -e "${YELLOW}🔑 Generando clave de aplicación...${NC}"
    cd /var/www && php artisan key:generate
fi

# Ejecutar migraciones si está en modo desarrollo
if [ "$APP_ENV" = "local" ]; then
    echo -e "${YELLOW}🗄️ Ejecutando migraciones...${NC}"
    cd /var/www && php artisan migrate --force
fi

# Limpiar y optimizar caches
echo -e "${YELLOW}🧹 Limpiando cachés...${NC}"
cd /var/www && php artisan config:cache || true
cd /var/www && php artisan route:cache || true
cd /var/www && php artisan view:cache || true

# Precargar clases de Composer
echo -e "${YELLOW}⚡ Precargando clases...${NC}"
cd /var/www && composer dump-autoload --optimize || true

echo -e "${GREEN}✅ Configuración completada${NC}"
echo -e "${GREEN}🎉 Contenedor PHP listo${NC}"

# Ejecutar el comando principal
exec "$@"
