#!/bin/bash

# Script para actualizar el Sistema Nacional de Visitas

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

log_info "Iniciando actualización del sistema..."

# Verificar si hay cambios en el repositorio
if [ -d ".git" ]; then
    log_info "Verificando actualizaciones del repositorio..."
    git fetch origin
    
    if [ $(git rev-list HEAD...origin/main --count) -gt 0 ]; then
        log_info "Hay actualizaciones disponibles."
        read -p "¿Desea actualizar el código? (s/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            log_info "Actualizando código..."
            git pull origin main
        fi
    else
        log_info "El código está actualizado."
    fi
fi

# Preguntar sobre actualización de dependencias
read -p "¿Desea actualizar dependencias? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    log_info "Actualizando dependencias del backend..."
    docker-compose exec backend composer update
    
    log_info "Actualizando dependencias del frontend..."
    docker-compose exec frontend npm update
fi

# Preguntar sobre actualización de base de datos
read -p "¿Desea ejecutar migraciones de base de datos? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    log_info "Ejecutando migraciones..."
    docker-compose exec backend php artisan migrate --force
fi

# Reiniciar servicios
log_info "Reiniciando servicios..."
docker-compose restart

log_success "Actualización completada exitosamente!"