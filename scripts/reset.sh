#!/bin/bash

# Script para reiniciar el Sistema Nacional de Visitas

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_info "Reiniciando sistema..."

# Preguntar confirmación
read -p "¿Está seguro de que desea reiniciar el sistema? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    log_info "Reinicio cancelado."
    exit 0
fi

# Detener contenedores
log_info "Deteniendo contenedores..."
docker-compose down

# Opción para limpiar volúmenes
read -p "¿Desea limpiar los volúmenes de Docker? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    log_warning "Limpiando volúmenes..."
    docker-compose down -v
    docker system prune -f
fi

# Reiniciar contenedores
log_info "Reiniciando contenedores..."
docker-compose up -d

# Esperar a que estén listos
log_info "Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado
docker-compose ps

log_success "Sistema reiniciado exitosamente!"