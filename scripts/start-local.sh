#!/bin/bash

# Script para iniciar el Sistema Nacional de Visitas (Entorno Local)
set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

log "Iniciando Sistema Nacional de Visitas (Entorno Local)"

# Verificar que los servicios estén ejecutándose
log "Verificando servicios..."

# Verificar MariaDB/MySQL
DB_ADMIN="mysqladmin"
if command -v mariadb-admin &> /dev/null; then
    DB_ADMIN="mariadb-admin"
elif ! command -v mysqladmin &> /dev/null; then
    error "No se encontró cliente de administración de base de datos"
    exit 1
fi

if ! $DB_ADMIN ping -h localhost -u root &> /dev/null; then
    error "MariaDB/MySQL no está ejecutándose. Por favor inicia el servicio:"
    error "sudo systemctl start mariadb  # o mysql"
    exit 1
fi

# Verificar Redis
if ! redis-cli ping &> /dev/null; then
    error "Redis no está ejecutándose. Por favor inicia el servicio:"
    error "sudo systemctl start redis-server"
    exit 1
fi

success "Servicios verificados correctamente"

# Crear directorio para logs de procesos
mkdir -p logs

# Función para verificar si un proceso está ejecutándose
check_process() {
    local pid_file=$1
    local service_name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            warning "$service_name ya está ejecutándose (PID: $pid)"
            return 0
        else
            rm -f "$pid_file"
        fi
    fi
    return 1
}

# Función para iniciar un servicio
start_service() {
    local service_name=$1
    local command=$2
    local pid_file=$3
    local log_file=$4
    
    if ! check_process "$pid_file" "$service_name"; then
        log "Iniciando $service_name..."
        nohup $command > "$log_file" 2>&1 &
        local pid=$!
        echo $pid > "$pid_file"
        
        # Esperar un momento para verificar que el servicio se inició correctamente
        sleep 3
        
        if ps -p "$pid" > /dev/null 2>&1; then
            success "$service_name iniciado correctamente (PID: $pid)"
        else
            error "Error al iniciar $service_name. Revisa $log_file"
            rm -f "$pid_file"
            return 1
        fi
    fi
}

# Iniciar Backend
start_service "Backend" "cd backend && php artisan serve --host=0.0.0.0 --port=8000" "logs/backend.pid" "logs/backend.log"

# Iniciar Frontend
start_service "Frontend" "cd frontend && npm run dev" "logs/frontend.pid" "logs/frontend.log"

# Iniciar Queue Worker
start_service "Queue Worker" "cd backend && php artisan queue:work --queue=default,notifications,exports --sleep=3 --tries=3 --timeout=90" "logs/queue.pid" "logs/queue.log"

# Iniciar Horizon (si está instalado)
if [ -f "backend/composer.json" ] && grep -q "laravel/horizon" backend/composer.json; then
    start_service "Horizon" "cd backend && php artisan horizon" "logs/horizon.pid" "logs/horizon.log"
fi

# Iniciar Mailhog (si está instalado)
if command -v mailhog &> /dev/null; then
    start_service "Mailhog" "mailhog" "logs/mailhog.pid" "logs/mailhog.log"
fi

# Mostrar estado
log ""
success "¡Sistema iniciado!"
log ""
log "URLs del sistema:"
log "  Frontend: http://localhost:3000"
log "  Backend API: http://localhost:8000"
log "  Mailhog (si instalado): http://localhost:8025"
log ""
log "Archivos PID creados en logs/:"
ls -la logs/*.pid 2>/dev/null || log "No hay archivos PID (los servicios podrían no estar ejecutándose)"
log ""
log "Para ver los logs:"
log "  tail -f logs/backend.log"
log "  tail -f logs/frontend.log"
log "  tail -f logs/queue.log"
log ""
log "Para detener el sistema: ./scripts/stop-local.sh"

exit 0