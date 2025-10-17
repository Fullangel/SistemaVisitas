#!/bin/bash

# Script para detener el Sistema Nacional de Visitas

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_info "Deteniendo servicios Docker..."

# Detener contenedores
docker-compose down

log_success "Sistema detenido exitosamente!"