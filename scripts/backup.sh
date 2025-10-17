#!/bin/bash

# Script para crear respaldos del Sistema Nacional de Visitas

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

# Variables de configuración
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_visitas_${DATE}"

# Crear directorio de respaldos si no existe
mkdir -p "$BACKUP_DIR"

log_info "Iniciando respaldo del sistema..."

# Respaldar base de datos
log_info "Respaldando base de datos..."
docker-compose exec -T db mysqldump -uroot -psecret sistema_visitas > "$BACKUP_DIR/${BACKUP_NAME}_database.sql"

# Respaldar archivos del storage
log_info "Respaldando archivos..."
tar -czf "$BACKUP_DIR/${BACKUP_NAME}_storage.tar.gz" -C backend storage

# Respaldar configuración
log_info "Respaldando configuración..."
tar -czf "$BACKUP_DIR/${BACKUP_NAME}_config.tar.gz" backend/.env frontend/.env

# Crear archivo de información
cat > "$BACKUP_DIR/${BACKUP_NAME}_info.txt" << EOF
Respaldo del Sistema Nacional de Visitas
Fecha: $(date)
Versión: $(git rev-parse --short HEAD 2>/dev/null || echo "No disponible")

Archivos incluidos:
- Base de datos: ${BACKUP_NAME}_database.sql
- Archivos: ${BACKUP_NAME}_storage.tar.gz
- Configuración: ${BACKUP_NAME}_config.tar.gz
EOF

log_success "Respaldo completado: $BACKUP_NAME"
echo "Archivos de respaldo en: $BACKUP_DIR"