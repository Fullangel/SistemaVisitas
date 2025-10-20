#!/bin/bash

# Script de inicio optimizado para Docker

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🐳 Iniciando Sistema de Visitas con Docker...${NC}"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado${NC}"
    exit 1
fi

# Función para limpiar recursos antiguos
cleanup() {
    echo -e "${YELLOW}🧹 Limpiando recursos antiguos...${NC}"
    docker-compose down --remove-orphans 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
}

# Función para verificar puertos disponibles
check_ports() {
    local ports=("3306" "6379" "8080" "5173" "8025")
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "${RED}❌ El puerto $port ya está en uso${NC}"
            echo -e "${YELLOW}Por favor libera el puerto o modifica el docker-compose.yml${NC}"
            exit 1
        fi
    done
}

# Función para copiar archivo de entorno
setup_env() {
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}📋 Copiando archivo de entorno...${NC}"
        cp .env.docker .env
        echo -e "${GREEN}✅ Archivo .env creado${NC}"
    fi
}

# Función para esperar servicios
wait_for_services() {
    echo -e "${YELLOW}⏳ Esperando a que los servicios estén listos...${NC}"
    
    # Esperar MySQL
    echo -e "${BLUE}🗄️ Esperando MySQL...${NC}"
    timeout 60 bash -c 'until docker-compose exec -T db mysqladmin ping -h localhost -u root -psecret --silent; do sleep 1; done' || {
        echo -e "${RED}❌ MySQL no respondió a tiempo${NC}"
        exit 1
    }
    
    # Esperar Redis
    echo -e "${BLUE}🔄 Esperando Redis...${NC}"
    timeout 30 bash -c 'until docker-compose exec -T redis redis-cli ping | grep -q PONG; do sleep 1; done' || {
        echo -e "${RED}❌ Redis no respondió a tiempo${NC}"
        exit 1
    }
    
    echo -e "${GREEN}✅ Todos los servicios están listos${NC}"
}

# Función para configurar Laravel
setup_laravel() {
    echo -e "${YELLOW}🔧 Configurando Laravel...${NC}"
    
    # Generar clave de aplicación
    docker-compose exec -T app php artisan key:generate --show || true
    
    # Ejecutar migraciones
    docker-compose exec -T app php artisan migrate --force || true
    
    # Optimizar Laravel
    docker-compose exec -T app php artisan config:cache || true
    docker-compose exec -T app php artisan route:cache || true
    docker-compose exec -T app php artisan view:cache || true
    
    echo -e "${GREEN}✅ Laravel configurado${NC}"
}

# Función para mostrar información
display_info() {
    echo -e "${GREEN}🎉 ¡Sistema de Visitas iniciado exitosamente!${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📱 Frontend:${NC} http://localhost:5173"
    echo -e "${YELLOW}🔧 Backend:${NC} http://localhost:8080"
    echo -e "${YELLOW}📧 Mailhog:${NC} http://localhost:8025"
    echo -e "${YELLOW}🗄️  PhpMyAdmin:${NC} http://localhost:8081"
    echo -e "${YELLOW}🔄 Redis Commander:${NC} http://localhost:8082"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}🔑 Credenciales de prueba:${NC}"
    echo -e "   - Email: admin@test.com"
    echo -e "   - Password: password"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📋 Comandos útiles:${NC}"
    echo -e "   - Ver logs: docker-compose logs -f [servicio]"
    echo -e "   - Entrar a contenedor: docker-compose exec [servicio] bash"
    echo -e "   - Detener: docker-compose down"
    echo -e "   - Reiniciar: ./docker-start.sh"
}

# Menú principal
main() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🚀 Sistema de Visitas - Docker Setup${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Verificar requisitos
    check_ports
    
    # Configurar entorno
    setup_env
    
    # Preguntar si limpiar recursos antiguos
    read -p "¿Limpiar recursos Docker antiguos? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        cleanup
    fi
    
    # Construir e iniciar servicios
    echo -e "${YELLOW}🔨 Construyendo servicios...${NC}"
    docker-compose build --no-cache
    
    echo -e "${YELLOW}🚀 Iniciando servicios...${NC}"
    docker-compose up -d
    
    # Esperar servicios
    wait_for_services
    
    # Configurar Laravel
    setup_laravel
    
    # Mostrar información
    display_info
}

# Manejo de señales
trap 'echo -e "\n${RED}⚠️  Deteniendo servicios...${NC}"; docker-compose down; exit 0' INT TERM

# Ejecutar menú principal
main