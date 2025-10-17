#!/bin/bash

# Script para restaurar respaldos del Sistema Nacional de Visitas

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

# Verificar argumentos
if [ $# -ne 1 ]; then
    log_error "Uso: $0 <archivo_de_respaldo>"
    log_info "Archivos de respaldo disponibles en ./backups/:"
    ls -la ./backups/ 2>/dev/null || log_info "No hay respaldos disponibles"
    exit 1
fi

BACKUP_FILE="$1"
BACKUP_DIR="./backups"

# Verificar que el archivo existe
if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    log_error "El archivo de respaldo no existe: $BACKUP_FILE"
    exit 1
fi

log_warning "Esta operación sobrescribirá los datos actuales."
read -p "¿Está seguro de que desea continuar? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    log_info "Restauración cancelada."
    exit 0
fi

log_info "Iniciando restauración desde: $BACKUP_FILE"

# Detener servicios
log_info "Deteniendo servicios..."
docker-compose down

# Restaurar base de datos
if [[ "$BACKUP_FILE" == *"database"* ]]; then
    log_info "Restaurando base de datos..."
    docker-compose up -d db
    sleep 10
    docker-compose exec -T db mysql -uroot -psecret sistema_visitas < "$BACKUP_DIR/$BACKUP_FILE"
fi

# Restaurar archivos
if [[ "$BACKUP_FILE" == *"storage"* ]]; then
    log_info "Restaurando archivos..."
    tar -xzf "$BACKUP_DIR/$BACKUP_FILE" -C backend
fi

# Restaurar configuración
if [[ "$BACKUP_FILE" == *"config"* ]]; then
    log_info "Restaurando configuración..."
    tar -xzf "$BACKUP_DIR/$BACKUP_FILE"
fi

# Reiniciar servicios
log_info "Reiniciando servicios..."
docker-compose up -d

log_success "Restauración completada exitosamente!"