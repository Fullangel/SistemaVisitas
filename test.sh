#!/bin/bash

# Script de pruebas para el Sistema de Visitas

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Ejecutando pruebas del Sistema de Visitas...${NC}"

# Función para ejecutar pruebas del backend
run_backend_tests() {
    echo -e "${YELLOW}🔧 Ejecutando pruebas del backend...${NC}"
    
    # Construir y ejecutar contenedor de pruebas
    docker-compose -f docker-compose.test.yml build app-test
    docker-compose -f docker-compose.test.yml run --rm app-test
    
    echo -e "${GREEN}✅ Pruebas del backend completadas${NC}"
}

# Función para ejecutar pruebas del frontend
run_frontend_tests() {
    echo -e "${YELLOW}🎨 Ejecutando pruebas del frontend...${NC}"
    
    # Construir y ejecutar contenedor de pruebas
    docker-compose -f docker-compose.test.yml build frontend-test
    docker-compose -f docker-compose.test.yml run --rm frontend-test
    
    echo -e "${GREEN}✅ Pruebas del frontend completadas${NC}"
}

# Función para ejecutar pruebas de integración
run_integration_tests() {
    echo -e "${YELLOW}🔗 Ejecutando pruebas de integración...${NC}"
    
    # Iniciar servicios de prueba
    docker-compose -f docker-compose.test.yml up -d db-test redis-test
    
    # Esperar a que los servicios estén listos
    echo -e "${BLUE}⏳ Esperando servicios de prueba...${NC}"
    sleep 10
    
    # Ejecutar pruebas de integración
    docker-compose -f docker-compose.test.yml run --rm app-test php artisan test --testsuite=Feature
    
    # Detener servicios
    docker-compose -f docker-compose.test.yml down
    
    echo -e "${GREEN}✅ Pruebas de integración completadas${NC}"
}

# Función para ejecutar pruebas de carga
run_load_tests() {
    echo -e "${YELLOW}⚡ Ejecutando pruebas de carga...${NC}"
    
    # Verificar si existe script de pruebas de carga
    if [ -f "tests/load/basic-load-test.js" ]; then
        # Iniciar servicios necesarios
        docker-compose -f docker-compose.test.yml --profile load-test up -d influxdb grafana
        
        # Ejecutar prueba de carga
        docker-compose -f docker-compose.test.yml --profile load-test run --rm k6 run /scripts/basic-load-test.js
        
        echo -e "${GREEN}✅ Pruebas de carga completadas${NC}"
        echo -e "${BLUE}📊 Métricas disponibles en: http://localhost:3001 (admin/admin123)${NC}"
    else
        echo -e "${YELLOW}⚠️  No se encontró script de pruebas de carga${NC}"
    fi
}

# Función para ejecutar todas las pruebas
run_all_tests() {
    echo -e "${BLUE}🚀 Ejecutando todas las pruebas...${NC}"
    
    run_backend_tests
    run_frontend_tests
    run_integration_tests
    
    # Preguntar si ejecutar pruebas de carga
    read -p "¿Ejecutar pruebas de carga? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        run_load_tests
    fi
    
    echo -e "${GREEN}🎉 Todas las pruebas completadas exitosamente!${NC}"
}

# Función para limpiar recursos de prueba
cleanup_tests() {
    echo -e "${YELLOW}🧹 Limpiando recursos de prueba...${NC}"
    
    # Detener y eliminar contenedores de prueba
    docker-compose -f docker-compose.test.yml down --remove-orphans
    docker-compose -f docker-compose.test.yml down --volumes --remove-orphans
    
    # Limpiar imágenes de prueba
    docker image prune -f
    
    echo -e "${GREEN}✅ Recursos de prueba limpiados${NC}"
}

# Función para mostrar menú
show_menu() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🧪 Suite de Pruebas - Sistema de Visitas${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}1.${NC} Pruebas del Backend"
    echo -e "${YELLOW}2.${NC} Pruebas del Frontend"
    echo -e "${YELLOW}3.${NC} Pruebas de Integración"
    echo -e "${YELLOW}4.${NC} Pruebas de Carga"
    echo -e "${YELLOW}5.${NC} Todas las Pruebas"
    echo -e "${YELLOW}6.${NC} Limpiar Recursos"
    echo -e "${YELLOW}7.${NC} Salir"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Función principal
main() {
    while true; do
        show_menu
        read -p "Selecciona una opción (1-7): " choice
        
        case $choice in
            1)
                run_backend_tests
                ;;
            2)
                run_frontend_tests
                ;;
            3)
                run_integration_tests
                ;;
            4)
                run_load_tests
                ;;
            5)
                run_all_tests
                ;;
            6)
                cleanup_tests
                ;;
            7)
                echo -e "${GREEN}👋 Hasta luego!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Opción inválida${NC}"
                ;;
        esac
        
        echo
        read -p "Presiona Enter para continuar..."
        clear
    done
}

# Manejo de señales
trap 'echo -e "\n${RED}⚠️  Interrumpido por el usuario${NC}"; cleanup_tests; exit 0' INT TERM

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado${NC}"
    exit 1
fi

# Ejecutar menú principal
main