#!/bin/bash

# Script de utilidades para gestionar el entorno Docker

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuración por defecto
COMPOSE_FILE="docker-compose.secure.yml"
ENV_FILE=".env.secure"

# Función de ayuda
show_help() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🐳 Docker Utils - Sistema de Visitas${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Uso: ./docker-utils.sh [comando] [opciones]${NC}"
    echo -e ""
    echo -e "${PURPLE}Comandos disponibles:${NC}"
    echo -e "  ${GREEN}start${NC}     - Iniciar servicios con configuración segura"
    echo -e "  ${GREEN}stop${NC}      - Detener todos los servicios"
    echo -e "  ${GREEN}restart${NC}   - Reiniciar todos los servicios"
    echo -e "  ${GREEN}status${NC}    - Ver estado de todos los servicios"
    echo -e "  ${GREEN}logs${NC}      - Ver logs de servicios"
    echo -e "  ${GREEN}clean${NC}     - Limpiar contenedores, imágenes y volúmenes"
    echo -e "  ${GREEN}backup${NC}    - Crear respaldo de base de datos"
    echo -e "  ${GREEN}restore${NC}   - Restaurar base de datos desde respaldo"
    echo -e "  ${GREEN}shell${NC}     - Acceder a shell de contenedor"
    echo -e "  ${GREEN}test${NC}      - Ejecutar pruebas"
    echo -e "  ${GREEN}security${NC}  - Verificar configuración de seguridad"
    echo -e "  ${GREEN}ports${NC}     - Ver puertos en uso"
    echo -e "  ${GREEN}help${NC}      - Mostrar esta ayuda"
    echo -e ""
    echo -e "${YELLOW}Ejemplos:${NC}"
    echo -e "  ./docker-utils.sh start"
    echo -e "  ./docker-utils.sh logs app"
    echo -e "  ./docker-utils.sh shell app"
    echo -e "  ./docker-utils.sh clean --all"
    echo -e "  ./docker-utils.sh backup"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Función para iniciar servicios
start_services() {
    echo -e "${BLUE}🚀 Iniciando servicios...${NC}"
    
    if [ -f "docker-start-secure.sh" ]; then
        ./docker-start-secure.sh
    else
        echo -e "${YELLOW}⚠️  Usando docker-compose directamente...${NC}"
        docker-compose -f $COMPOSE_FILE up -d
    fi
}

# Función para detener servicios
stop_services() {
    echo -e "${BLUE}⏹️  Deteniendo servicios...${NC}"
    docker-compose -f $COMPOSE_FILE down
    echo -e "${GREEN}✅ Servicios detenidos${NC}"
}

# Función para reiniciar servicios
restart_services() {
    echo -e "${BLUE}🔄 Reiniciando servicios...${NC}"
    docker-compose -f $COMPOSE_FILE restart
    echo -e "${GREEN}✅ Servicios reiniciados${NC}"
}

# Función para ver estado
show_status() {
    echo -e "${BLUE}📊 Estado de servicios:${NC}"
    docker-compose -f $COMPOSE_FILE ps
    
    echo -e "\n${BLUE}🌐 Puertos en uso:${NC}"
    docker-compose -f $COMPOSE_FILE ps --format "table {{.Service}}\t{{.Ports}}"
}

# Función para ver logs
show_logs() {
    local service=$1
    local follow=$2
    
    if [ -z "$service" ]; then
        echo -e "${YELLOW}Ver logs de todos los servicios (Ctrl+C para salir):${NC}"
        if [ "$follow" = "-f" ]; then
            docker-compose -f $COMPOSE_FILE logs -f
        else
            docker-compose -f $COMPOSE_FILE logs --tail=100
        fi
    else
        echo -e "${YELLOW}Ver logs de $service (Ctrl+C para salir):${NC}"
        if [ "$follow" = "-f" ]; then
            docker-compose -f $COMPOSE_FILE logs -f $service
        else
            docker-compose -f $COMPOSE_FILE logs --tail=100 $service
        fi
    fi
}

# Función para limpiar
clean_environment() {
    local clean_all=$1
    
    echo -e "${BLUE}🧹 Limpiando entorno Docker...${NC}"
    
    # Detener servicios
    docker-compose -f $COMPOSE_FILE down
    
    # Eliminar contenedores
    docker-compose -f $COMPOSE_FILE rm -f
    
    if [ "$clean_all" = "--all" ]; then
        echo -e "${YELLOW}⚠️  Eliminando imágenes y volúmenes...${NC}"
        
        # Eliminar imágenes
        docker-compose -f $COMPOSE_FILE down --rmi all
        
        # Eliminar volúmenes
        docker volume prune -f
        
        # Eliminar imágenes huérfanas
        docker image prune -f
        
        echo -e "${GREEN}✅ Limpieza completa realizada${NC}"
    else
        echo -e "${GREEN}✅ Limpieza básica realizada${NC}"
    fi
}

# Función para backup
create_backup() {
    echo -e "${BLUE}💾 Creando respaldo de base de datos...${NC}"
    
    local backup_dir="backups"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$backup_dir/db_backup_$timestamp.sql"
    
    mkdir -p $backup_dir
    
    # Obtener credenciales del archivo .env
    local db_name=$(grep DB_DATABASE $ENV_FILE | cut -d'=' -f2)
    local db_user=$(grep DB_USERNAME $ENV_FILE | cut -d'=' -f2)
    local db_pass=$(grep DB_PASSWORD $ENV_FILE | cut -d'=' -f2)
    
    # Crear respaldo
    docker-compose -f $COMPOSE_FILE exec db mysqldump -u$db_user -p$db_pass $db_name > $backup_file
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Respaldo creado: $backup_file${NC}"
    else
        echo -e "${RED}❌ Error al crear respaldo${NC}"
    fi
}

# Función para restaurar
restore_backup() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        echo -e "${RED}❌ Por favor especifica el archivo de respaldo${NC}"
        echo -e "${YELLOW}Uso: ./docker-utils.sh restore backups/db_backup_20240101_120000.sql${NC}"
        return 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}❌ Archivo de respaldo no encontrado: $backup_file${NC}"
        return 1
    fi
    
    echo -e "${BLUE}📤 Restaurando base de datos desde: $backup_file${NC}"
    
    # Obtener credenciales del archivo .env
    local db_name=$(grep DB_DATABASE $ENV_FILE | cut -d'=' -f2)
    local db_user=$(grep DB_USERNAME $ENV_FILE | cut -d'=' -f2)
    local db_pass=$(grep DB_PASSWORD $ENV_FILE | cut -d'=' -f2)
    
    # Restaurar respaldo
    docker-compose -f $COMPOSE_FILE exec -T db mysql -u$db_user -p$db_pass $db_name < $backup_file
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Base de datos restaurada exitosamente${NC}"
    else
        echo -e "${RED}❌ Error al restaurar base de datos${NC}"
    fi
}

# Función para acceder a shell
access_shell() {
    local service=$1
    
    if [ -z "$service" ]; then
        echo -e "${RED}❌ Por favor especifica el servicio${NC}"
        echo -e "${YELLOW}Servicios disponibles: app, frontend, db, redis${NC}"
        return 1
    fi
    
    echo -e "${BLUE}🐚 Accediendo a shell de $service...${NC}"
    docker-compose -f $COMPOSE_FILE exec $service bash || docker-compose -f $COMPOSE_FILE exec $service sh
}

# Función para ejecutar pruebas
run_tests() {
    echo -e "${BLUE}🧪 Ejecutando pruebas...${NC}"
    
    if [ -f "test.sh" ]; then
        ./test.sh
    else
        echo -e "${YELLOW}⚠️  Script de pruebas no encontrado, ejecutando pruebas básicas...${NC}"
        
        # Verificar que servicios estén funcionando
        docker-compose -f $COMPOSE_FILE exec app php artisan migrate --force
        docker-compose -f $COMPOSE_FILE exec app php artisan test
    fi
}

# Función para verificar seguridad
check_security() {
    echo -e "${BLUE}🔒 Verificando configuración de seguridad...${NC}"
    
    # Verificar contraseñas por defecto
    echo -e "${YELLOW}Verificando contraseñas...${NC}"
    
    if grep -q "password_2024" $ENV_FILE; then
        echo -e "${RED}❌ Contraseñas por defecto detectadas - Cambiar inmediatamente${NC}"
    else
        echo -e "${GREEN}✅ Contraseñas seguras${NC}"
    fi
    
    # Verificar puertos expuestos
    echo -e "${YELLOW}Verificando puertos...${NC}"
    docker-compose -f $COMPOSE_FILE ps --format "table {{.Service}}\t{{.Ports}}"
    
    # Verificar logs de seguridad
    echo -e "${YELLOW}Verificando logs de seguridad...${NC}"
    docker-compose -f $COMPOSE_FILE logs --tail=50 | grep -i "security\|error\|warning" || echo "No hay advertencias de seguridad"
}

# Función para ver puertos
show_ports() {
    echo -e "${BLUE}🔌 Puertos en uso:${NC}"
    echo -e "${YELLOW}Puertos del sistema:${NC}"
    sudo netstat -tulpn | grep LISTEN || echo "netstat no disponible, usando ss..."
    sudo ss -tulpn | grep LISTEN
    
    echo -e "\n${YELLOW}Puertos de Docker:${NC}"
    docker-compose -f $COMPOSE_FILE ps --format "table {{.Service}}\t{{.Ports}}"
}

# Función principal
main() {
    local command=$1
    shift
    
    case $command in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs $1 $2
            ;;
        clean)
            clean_environment $1
            ;;
        backup)
            create_backup
            ;;
        restore)
            restore_backup $1
            ;;
        shell)
            access_shell $1
            ;;
        test)
            run_tests
            ;;
        security)
            check_security
            ;;
        ports)
            show_ports
            ;;
        help|--help|-h)
            show_help
            ;;
        "")
            echo -e "${RED}❌ Por favor especifica un comando${NC}"
            show_help
            ;;
        *)
            echo -e "${RED}❌ Comando no reconocido: $command${NC}"
            show_help
            ;;
    esac
}

# Ejecutar comando principal
main "$@"