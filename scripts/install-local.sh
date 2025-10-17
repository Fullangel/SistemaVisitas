#!/bin/bash

# Script de instalación para entorno local sin Docker
# Sistema Nacional de Visitas

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    error "Por favor ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

log "Iniciando instalación del Sistema Nacional de Visitas (Entorno Local)"

# Verificar requisitos del sistema
log "Verificando requisitos del sistema..."

# Verificar PHP
if ! command -v php &> /dev/null; then
    error "PHP no está instalado. Por favor instala PHP 8.1 o superior."
    exit 1
fi

PHP_VERSION=$(php -r "echo PHP_VERSION;")
log "PHP versión detectada: $PHP_VERSION"

# Verificar Composer
if ! command -v composer &> /dev/null; then
    error "Composer no está instalado. Por favor instala Composer."
    exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    error "Node.js no está instalado. Por favor instala Node.js 18 o superior."
    exit 1
fi

# Verificar MariaDB/MySQL
if ! command -v mysql &> /dev/null && ! command -v mariadb &> /dev/null; then
    error "MariaDB/MySQL no está instalado. Por favor instala MariaDB 10.3+ o MySQL 8.0+."
    exit 1
fi

# Verificar Redis
if ! command -v redis-cli &> /dev/null; then
    error "Redis no está instalado. Por favor instala Redis."
    exit 1
fi

success "Todos los requisitos están instalados"

# Verificar servicios en ejecución
log "Verificando servicios..."

# Verificar MariaDB/MySQL
if command -v mysqladmin &> /dev/null; then
    if ! mysqladmin ping -h localhost -u root &> /dev/null; then
        warning "MariaDB/MySQL no está ejecutándose. Por favor inicia el servicio:"
        warning "sudo systemctl start mariadb  # o mysql"
    fi
elif command -v mariadb-admin &> /dev/null; then
    if ! mariadb-admin ping -h localhost -u root &> /dev/null; then
        warning "MariaDB no está ejecutándose. Por favor inicia el servicio:"
        warning "sudo systemctl start mariadb"
    fi
else
    warning "No se pudo detectar el cliente de administración de MariaDB/MySQL"
fi

# Verificar Redis
if ! redis-cli ping &> /dev/null; then
    warning "Redis no está ejecutándose. Por favor inicia el servicio:"
    warning "sudo systemctl start redis-server"
fi

# Crear base de datos
log "Configurando base de datos..."

# Detectar cliente de base de datos
DB_CLIENT="mysql"
if command -v mariadb &> /dev/null; then
    DB_CLIENT="mariadb"
elif ! command -v mysql &> /dev/null; then
    error "No se encontró cliente de base de datos (MariaDB/MySQL)"
    exit 1
fi

log "Usando cliente de base de datos: $DB_CLIENT"

$DB_CLIENT -u root -p <<EOF
CREATE DATABASE IF NOT EXISTS sistema_visitas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'visitas_user'@'localhost' IDENTIFIED BY 'secret';
GRANT ALL PRIVILEGES ON sistema_visitas.* TO 'visitas_user'@'localhost';
FLUSH PRIVILEGES;
EOF

success "Base de datos configurada"

# Configurar backend
log "Configurando backend..."
cd backend

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    cp .env.example .env
    log "Archivo .env creado desde .env.example"
fi

# Actualizar configuración de base de datos en .env
sed -i 's/DB_HOST=.*/DB_HOST=127.0.0.1/' .env
sed -i 's/DB_PORT=.*/DB_PORT=3306/' .env
sed -i 's/DB_DATABASE=.*/DB_DATABASE=sistema_visitas/' .env
sed -i 's/DB_USERNAME=.*/DB_USERNAME=visitas_user/' .env
sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=secret/' .env
sed -i 's/REDIS_HOST=.*/REDIS_HOST=127.0.0.1/' .env
sed -i 's/APP_URL=.*/APP_URL=http:\/\/localhost:8000/' .env

# Generar clave de aplicación
php artisan key:generate

# Instalar dependencias de Composer
log "Instalando dependencias de Composer..."
composer install --no-dev --optimize-autoloader

# Crear enlaces simbólicos
php artisan storage:link

# Ejecutar migraciones
log "Ejecutando migraciones de base de datos..."
php artisan migrate --force

# Ejecutar seeders
log "Ejecutando seeders..."
php artisan db:seed --force

# Optimizar Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Configurar permisos
chmod -R 775 storage bootstrap/cache
success "Backend configurado"

# Configurar frontend
log "Configurando frontend..."
cd ../frontend

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    cp .env.example .env 2>/dev/null || cat > .env << 'EOF'
VITE_API_URL=http://localhost:8000/api
VITE_APP_URL=http://localhost:3000
VITE_APP_NAME="Sistema Nacional de Visitas"
VITE_APP_ENV=local
EOF
    log "Archivo .env creado para frontend"
fi

# Instalar dependencias de npm
log "Instalando dependencias de npm..."
npm install

success "Frontend configurado"

# Volver al directorio raíz
cd ..

# Crear scripts de servicio locales
log "Creando scripts de servicio locales..."

# Script para iniciar backend
cat > scripts/start-backend.sh << 'EOF'
#!/bin/bash
cd backend
php artisan serve --host=0.0.0.0 --port=8000
EOF
chmod +x scripts/start-backend.sh

# Script para iniciar frontend
cat > scripts/start-frontend.sh << 'EOF'
#!/bin/bash
cd frontend
npm run dev
EOF
chmod +x scripts/start-frontend.sh

# Script para iniciar queue worker
cat > scripts/start-queue.sh << 'EOF'
#!/bin/bash
cd backend
php artisan queue:work --queue=default,notifications,exports --sleep=3 --tries=3 --timeout=90
EOF
chmod +x scripts/start-queue.sh

# Script para iniciar Horizon
cat > scripts/start-horizon.sh << 'EOF'
#!/bin/bash
cd backend
php artisan horizon
EOF
chmod +x scripts/start-horizon.sh

success "Scripts de servicio creados"

# Instalar Mailhog (opcional)
log "¿Deseas instalar Mailhog para pruebas de correo? (s/n)"
read -r response
if [[ "$response" =~ ^[Ss]$ ]]; then
    log "Instalando Mailhog..."
    
    # Descargar Mailhog
    if [ ! -f "/usr/local/bin/mailhog" ]; then
        curl -L https://github.com/mailhog/MailHog/releases/download/v1.0.0/MailHog_linux_amd64 -o mailhog
        chmod +x mailhog
        sudo mv mailhog /usr/local/bin/
        rm -f mailhog
    fi
    
    # Crear script para iniciar Mailhog
    cat > scripts/start-mailhog.sh << 'EOF'
#!/bin/bash
mailhog
EOF
    chmod +x scripts/start-mailhog.sh
    
    success "Mailhog instalado. Estará disponible en http://localhost:8025"
fi

# Mensaje final
success "¡Instalación completada!"
log ""
log "Para iniciar el sistema, ejecuta los siguientes comandos en terminales separadas:"
log "  Terminal 1: ./scripts/start-backend.sh"
log "  Terminal 2: ./scripts/start-frontend.sh"
log "  Terminal 3: ./scripts/start-queue.sh (opcional)"
log "  Terminal 4: ./scripts/start-horizon.sh (opcional)"
log "  Terminal 5: ./scripts/start-mailhog.sh (si instalaste Mailhog)"
log ""
log "URLs del sistema:"
log "  Frontend: http://localhost:3000"
log "  Backend API: http://localhost:8000"
log "  Mailhog (si instalado): http://localhost:8025"
log ""
log "Para ver los logs del sistema, revisa:"
log "  Backend: backend/storage/logs/laravel.log"
log "  Frontend: Mira la consola del navegador"
log ""
warning "Asegúrate de que MySQL y Redis estén ejecutándose antes de iniciar el sistema"

exit 0