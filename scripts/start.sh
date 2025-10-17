#!/bin/bash

# Script para iniciar el Sistema Nacional de Visitas

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si existe el archivo .env
if [ ! -f "backend/.env" ] || [ ! -f "frontend/.env" ]; then
    log_error "Archivos de configuración no encontrados. Por favor ejecute ./scripts/install.sh primero."
    exit 1
fi

log_info "Iniciando servicios Docker..."

# Levantar contenedores
docker-compose up -d

# Esperar a que los servicios estén listos
log_info "Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado
docker-compose ps

log_success "Sistema iniciado exitosamente!"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8080"
echo ""
echo "Para ver logs: docker-compose logs -f"
echo "Para detener: ./scripts/stop.sh"