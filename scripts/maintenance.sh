#!/bin/bash

# Script para modo de mantenimiento del Sistema Nacional de Visitas

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
ACTION="$1"

if [ -z "$ACTION" ] || [[ ! "$ACTION" =~ ^(enable|disable)$ ]]; then
    echo "Uso: $0 [enable|disable]"
    echo ""
    echo "Comandos:"
    echo "  enable  - Activar modo de mantenimiento"
    echo "  disable - Desactivar modo de mantenimiento"
    echo ""
    echo "Ejemplos:"
    echo "  $0 enable"
    echo "  $0 disable"
    exit 1
fi

case $ACTION in
    "enable")
        log_warning "Activando modo de mantenimiento..."
        
        # Crear archivo de mantenimiento
        docker-compose exec backend touch storage/framework/maintenance.php
        
        # Opcional: enviar notificación
        read -p "¿Desea enviar notificación a los usuarios? (s/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            log_info "Enviando notificaciones..."
            # Aquí se podría integrar con el servicio de notificaciones
        fi
        
        log_success "Modo de mantenimiento activado"
        log_info "Los usuarios verán una página de mantenimiento"
        ;;
        
    "disable")
        log_info "Desactivando modo de mantenimiento..."
        
        # Eliminar archivo de mantenimiento
        docker-compose exec backend rm -f storage/framework/maintenance.php
        
        log_success "Modo de mantenimiento desactivado"
        log_info "El sistema está nuevamente disponible"
        ;;
esac