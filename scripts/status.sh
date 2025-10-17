#!/bin/bash

# Script para verificar el estado del Sistema Nacional de Visitas

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

echo "========================================="
echo "    ESTADO DEL SISTEMA DE VISITAS"
echo "========================================="
echo ""

# Verificar Docker
if command -v docker &> /dev/null; then
    log_success "Docker está instalado"
    docker --version
else
    log_error "Docker no está instalado"
fi

echo ""

# Verificar Docker Compose
if command -v docker-compose &> /dev/null; then
    log_success "Docker Compose está instalado"
    docker-compose --version
else
    log_error "Docker Compose no está instalado"
fi

echo ""

# Verificar contenedores
if docker-compose ps &> /dev/null; then
    log_info "Estado de los contenedores:"
    docker-compose ps
else
    log_warning "Los contenedores no están ejecutándose"
fi

echo ""

# Verificar archivos de configuración
if [ -f "backend/.env" ]; then
    log_success "Configuración del backend encontrada"
else
    log_error "Configuración del backend no encontrada"
fi

if [ -f "frontend/.env" ]; then
    log_success "Configuración del frontend encontrada"
else
    log_error "Configuración del frontend no encontrada"
fi

echo ""

# Verificar puertos
log_info "Verificando puertos:"
if netstat -tuln 2>/dev/null | grep -q ":3000"; then
    log_success "Puerto 3000 (Frontend) está en uso"
else
    log_warning "Puerto 3000 (Frontend) no está en uso"
fi

if netstat -tuln 2>/dev/null | grep -q ":8080"; then
    log_success "Puerto 8080 (Backend) está en uso"
else
    log_warning "Puerto 8080 (Backend) no está en uso"
fi

echo ""
echo "========================================="