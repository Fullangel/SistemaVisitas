#!/bin/bash

# Script para ver logs del Sistema Nacional de Visitas (Entorno Local)

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

# Función de ayuda
show_help() {
    echo "Uso: $0 [servicio] [opciones]"
    echo ""
    echo "Servicios disponibles:"
    echo "  backend      - Ver logs del backend (Laravel)"
    echo "  frontend     - Ver logs del frontend (npm)"
    echo "  queue        - Ver logs del queue worker"
    echo "  horizon      - Ver logs de Laravel Horizon"
    echo "  mailhog      - Ver logs de Mailhog"
    echo "  laravel      - Ver logs de Laravel (storage/logs/laravel.log)"
    echo "  all          - Ver todos los logs disponibles"
    echo "  status       - Ver estado de los servicios"
    echo ""
    echo "Opciones:"
    echo "  -f, --follow - Seguir el log en tiempo real (tail -f)"
    echo "  -n NUM       - Mostrar últimas NUM líneas (por defecto: 50)"
    echo "  -h, --help   - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 backend -f              # Seguir logs del backend"
    echo "  $0 laravel -n 100          # Últimas 100 líneas de Laravel"
    echo "  $0 all -n 20               # Últimas 20 líneas de todos los logs"
    echo "  $0 status                  # Ver estado de servicios"
}

# Verificar estado de servicios
show_status() {
    log "Estado de los servicios:"
    echo ""
    
    # Verificar archivos PID
    for pid_file in logs/*.pid; do
        if [ -f "$pid_file" ]; then
            local service=$(basename "$pid_file" .pid | sed 's/-/ /g' | sed 's/\b\(.\)/\U\1/g')
            local pid=$(cat "$pid_file")
            
            if ps -p "$pid" > /dev/null 2>&1; then
                success "$service: EJECUTÁNDOSE (PID: $pid)"
            else
                warning "$service: ARCHIVO PID EXISTE PERO PROCESO NO EJECUTÁNDOSE"
            fi
        fi
    done
    
    # Verificar logs recientes
    echo ""
    log "Logs recientes:"
    
    if [ -d "logs" ]; then
        for log_file in logs/*.log; do
            if [ -f "$log_file" ]; then
                local service=$(basename "$log_file" .log | sed 's/-/ /g' | sed 's/\b\(.\)/\U\1/g')
                local last_update=$(stat -c %y "$log_file" 2>/dev/null || stat -f %Sm "$log_file" 2>/dev/null || echo "Desconocido")
                local size=$(du -h "$log_file" 2>/dev/null | cut -f1 || echo "0")
                
                echo "  $service: $size, última actualización: $last_update"
            fi
        done
    fi
    
    # Verificar log de Laravel
    if [ -f "backend/storage/logs/laravel.log" ]; then
        local size=$(du -h backend/storage/logs/laravel.log | cut -f1)
        local last_update=$(stat -c %y backend/storage/logs/laravel.log 2>/dev/null || stat -f %Sm backend/storage/logs/laravel.log 2>/dev/null || echo "Desconocido")
        echo "  Laravel: $size, última actualización: $last_update"
    fi
}

# Procesar argumentos
SERVICE=""
FOLLOW=false
LINES=50

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -f|--follow)
            FOLLOW=true
            shift
            ;;
        -n)
            LINES="$2"
            shift 2
            ;;
        backend|frontend|queue|horizon|mailhog|laravel|all|status)
            SERVICE="$1"
            shift
            ;;
        *)
            error "Opción desconocida: $1"
            show_help
            exit 1
            ;;
    esac
done

# Si no se especificó servicio, mostrar ayuda
if [ -z "$SERVICE" ]; then
    show_help
    exit 0
fi

# Función para mostrar log
show_log() {
    local log_file=$1
    local service_name=$2
    
    if [ ! -f "$log_file" ]; then
        warning "No se encontró el log: $log_file"
        return 1
    fi
    
    log "Mostrando log de $service_name:"
    echo "========================================"
    
    if [ "$FOLLOW" = true ]; then
        tail -f "$log_file"
    else
        tail -n "$LINES" "$log_file"
    fi
}

# Mostrar logs según el servicio solicitado
case $SERVICE in
    backend)
        show_log "logs/backend.log" "Backend"
        ;;
    frontend)
        show_log "logs/frontend.log" "Frontend"
        ;;
    queue)
        show_log "logs/queue.log" "Queue Worker"
        ;;
    horizon)
        show_log "logs/horizon.log" "Horizon"
        ;;
    mailhog)
        show_log "logs/mailhog.log" "Mailhog"
        ;;
    laravel)
        if [ -f "backend/storage/logs/laravel.log" ]; then
            log "Mostrando log de Laravel:"
            echo "========================================"
            if [ "$FOLLOW" = true ]; then
                tail -f backend/storage/logs/laravel.log
            else
                tail -n "$LINES" backend/storage/logs/laravel.log
            fi
        else
            warning "No se encontró el log de Laravel"
        fi
        ;;
    all)
        for log_file in logs/*.log; do
            if [ -f "$log_file" ]; then
                local service=$(basename "$log_file" .log | sed 's/-/ /g' | sed 's/\b\(.\)/\U\1/g')
                show_log "$log_file" "$service"
                echo ""
            fi
        done
        
        # También mostrar log de Laravel
        if [ -f "backend/storage/logs/laravel.log" ]; then
            if [ "$FOLLOW" = true ]; then
                log "Mostrando log de Laravel (modo follow):"
                tail -f backend/storage/logs/laravel.log
            else
                log "Mostrando log de Laravel:"
                echo "========================================"
                tail -n "$LINES" backend/storage/logs/laravel.log
            fi
        fi
        ;;
    status)
        show_status
        ;;
esac