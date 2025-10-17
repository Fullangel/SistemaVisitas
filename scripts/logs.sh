#!/bin/bash

# Script para ver logs del Sistema Nacional de Visitas

# Colores para output
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar argumentos
SERVICE="$1"

if [ -z "$SERVICE" ]; then
    echo "Uso: $0 [service|all]"
    echo ""
    echo "Servicios disponibles:"
    echo "  backend  - Logs del backend"
    echo "  frontend - Logs del frontend"
    echo "  db       - Logs de la base de datos"
    echo "  redis    - Logs de Redis"
    echo "  nginx    - Logs de Nginx"
    echo "  all      - Todos los servicios"
    echo ""
    echo "Ejemplos:"
    echo "  $0 backend"
    echo "  $0 all"
    exit 1
fi

case $SERVICE in
    "backend")
        log_info "Mostrando logs del backend..."
        docker-compose logs -f --tail=100 backend
        ;;
    "frontend")
        log_info "Mostrando logs del frontend..."
        docker-compose logs -f --tail=100 frontend
        ;;
    "db")
        log_info "Mostrando logs de la base de datos..."
        docker-compose logs -f --tail=100 db
        ;;
    "redis")
        log_info "Mostrando logs de Redis..."
        docker-compose logs -f --tail=100 redis
        ;;
    "nginx")
        log_info "Mostrando logs de Nginx..."
        docker-compose logs -f --tail=100 nginx
        ;;
    "all")
        log_info "Mostrando logs de todos los servicios..."
        docker-compose logs -f --tail=100
        ;;
    *)
        echo "Servicio no válido: $SERVICE"
        echo "Use '$0' sin argumentos para ver la lista de servicios disponibles"
        exit 1
        ;;
esac