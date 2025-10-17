#!/bin/bash

# Script para detener el Sistema Nacional de Visitas (Entorno Local)
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

log "Deteniendo Sistema Nacional de Visitas (Entorno Local)"

# Función para detener un proceso
stop_process() {
    local pid_file=$1
    local service_name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            log "Deteniendo $service_name (PID: $pid)..."
            kill "$pid"
            
            # Esperar a que el proceso termine
            local count=0
            while ps -p "$pid" > /dev/null 2>&1 && [ $count -lt 30 ]; do
                sleep 1
                count=$((count + 1))
            done
            
            # Si aún está ejecutándose, forzar terminación
            if ps -p "$pid" > /dev/null 2>&1; then
                warning "Forzando terminación de $service_name..."
                kill -9 "$pid"
            fi
            
            rm -f "$pid_file"
            success "$service_name detenido correctamente"
        else
            warning "$service_name no está ejecutándose"
            rm -f "$pid_file"
        fi
    else
        warning "No se encontró archivo PID para $service_name"
    fi
}

# Detener servicios en orden inverso al inicio
SERVICES=(
    "logs/mailhog.pid:Mailhog"
    "logs/horizon.pid:Horizon"
    "logs/queue.pid:Queue Worker"
    "logs/frontend.pid:Frontend"
    "logs/backend.pid:Backend"
)

for service in "${SERVICES[@]}"; do
    IFS=':' read -r pid_file service_name <<< "$service"
    stop_process "$pid_file" "$service_name"
done

# Verificar que no queden procesos relacionados
log "Verificando procesos restantes..."
PROCESSES=$(ps aux | grep -E "(php artisan|npm run|mailhog)" | grep -v grep | grep -v "stop-local.sh" || true)

if [ -n "$PROCESSES" ]; then
    warning "Se encontraron procesos relacionados que podrían estar ejecutándose:"
    echo "$PROCESSES"
    log ""
    log "Si deseas detenerlos manualmente, usa:"
    log "  pkill -f 'php artisan serve'"
    log "  pkill -f 'npm run dev'"
    log "  pkill -f mailhog"
else
    success "No se encontraron procesos relacionados ejecutándose"
fi

success "¡Sistema detenido correctamente!"

# Mostrar información adicional
log ""
log "Notas:"
log "  - Los logs se conservan en el directorio logs/"
log "  - Los archivos PID han sido eliminados"
log "  - Puedes revisar los logs con: tail -f logs/*.log"
log ""
log "Para iniciar el sistema nuevamente: ./scripts/start-local.sh"

exit 0