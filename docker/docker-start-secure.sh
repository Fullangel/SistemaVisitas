#!/bin/bash

# Script de inicio seguro con detección de conflictos de puertos

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🐳 Iniciando Sistema de Visitas con Docker (Configuración Segura)...${NC}"

# Función para verificar puerto
 check_port() {
    local port=$1
    local service=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}❌ El puerto $port ya está en uso por $service${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Puerto $port disponible para $service${NC}"
        return 0
    fi
}

# Función para encontrar puerto alternativo
find_alternative_port() {
    local base_port=$1
    local max_attempts=10
    local port=$base_port
    
    while [ $port -lt $((base_port + max_attempts)) ]; do
        if ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo $port
            return 0
        fi
        port=$((port + 1))
    done
    
    return 1
}

# Función para configurar puertos seguros
setup_secure_ports() {
    echo -e "${BLUE}🔍 Verificando disponibilidad de puertos...${NC}"
    
    # Puertos por defecto del archivo .env.secure
    local ports=(
        "${NGINX_PORT:-8080}:Nginx"
        "${MYSQL_PORT:-3307}:MySQL"
        "${REDIS_PORT:-6380}:Redis"
        "${FRONTEND_PORT:-5173}:Frontend"
        "${MAILHOG_HTTP_PORT:-8026}:Mailhog HTTP"
        "${MAILHOG_SMTP_PORT:-1026}:Mailhog SMTP"
    )
    
    local conflicts=0
    local new_ports=()
    
    for port_service in "${ports[@]}"; do
        IFS=':' read -r port service <<< "$port_service"
        
        if ! check_port $port "$service"; then
            conflicts=$((conflicts + 1))
            echo -e "${YELLOW}🔍 Buscando puerto alternativo para $service...${NC}"
            
            alternative=$(find_alternative_port $port)
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ Puerto alternativo encontrado: $alternative para $service${NC}"
                new_ports+=("$service=$alternative")
            else
                echo -e "${RED}❌ No se encontró puerto alternativo para $service${NC}"
                return 1
            fi
        fi
    done
    
    if [ $conflicts -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Se encontraron $conflicts conflictos de puerto${NC}"
        echo -e "${YELLOW}📝 Creando archivo de configuración con puertos alternativos...${NC}"
        
        # Crear archivo .env alternativo
        cp .env.secure .env.secure.auto
        
        for port_config in "${new_ports[@]}"; do
            IFS='=' read -r service new_port <<< "$port_config"
            case $service in
                "Nginx")
                    sed -i "s/NGINX_PORT=.*/NGINX_PORT=$new_port/" .env.secure.auto
                    ;;
                "MySQL")
                    sed -i "s/MYSQL_PORT=.*/MYSQL_PORT=$new_port/" .env.secure.auto
                    ;;
                "Redis")
                    sed -i "s/REDIS_PORT=.*/REDIS_PORT=$new_port/" .env.secure.auto
                    ;;
                "Frontend")
                    sed -i "s/FRONTEND_PORT=.*/FRONTEND_PORT=$new_port/" .env.secure.auto
                    ;;
                "Mailhog HTTP")
                    sed -i "s/MAILHOG_HTTP_PORT=.*/MAILHOG_HTTP_PORT=$new_port/" .env.secure.auto
                    ;;
                "Mailhog SMTP")
                    sed -i "s/MAILHOG_SMTP_PORT=.*/MAILHOG_SMTP_PORT=$new_port/" .env.secure.auto
                    ;;
            esac
        done
        
        echo -e "${GREEN}✅ Archivo .env.secure.auto creado con puertos alternativos${NC}"
        export ENV_FILE=.env.secure.auto
    else
        echo -e "${GREEN}✅ Todos los puertos están disponibles${NC}"
        export ENV_FILE=.env.secure
    fi
}

# Función para verificar requisitos
check_requirements() {
    echo -e "${BLUE}📋 Verificando requisitos...${NC}"
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker no está instalado${NC}"
        exit 1
    fi
    
    # Verificar Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose no está instalado${NC}"
        exit 1
    fi
    
    # Verificar archivos necesarios
    if [ ! -f "docker-compose.secure.yml" ]; then
        echo -e "${RED}❌ docker-compose.secure.yml no encontrado${NC}"
        exit 1
    fi
    
    if [ ! -f ".env.secure" ]; then
        echo -e "${RED}❌ .env.secure no encontrado${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Todos los requisitos están disponibles${NC}"
}

# Función para configurar seguridad
setup_security() {
    echo -e "${BLUE}🔒 Configurando seguridad...${NC}"
    
    # Generar contraseñas seguras si no existen
    if grep -q "change-this-in-production" .env.secure 2>/dev/null || grep -q "change-this-in-production" .env.secure.auto 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Generando contraseñas seguras...${NC}"
        
        # Generar JWT secret seguro
        JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || date | md5sum | head -c 32)
        
        # Generar contraseñas de base de datos seguras
        DB_PASSWORD=$(openssl rand -base64 16 2>/dev/null || date | md5sum | head -c 16)
        DB_ROOT_PASSWORD=$(openssl rand -base64 24 2>/dev/null || date | md5sum | head -c 24)
        REDIS_PASSWORD=$(openssl rand -base64 16 2>/dev/null || date | md5sum | head -c 16)
        
        # Actualizar archivo de entorno
        local env_file=${ENV_FILE:-.env.secure}
        sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" $env_file
        sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" $env_file
        sed -i "s/DB_ROOT_PASSWORD=.*/DB_ROOT_PASSWORD=$DB_ROOT_PASSWORD/" $env_file
        sed -i "s/REDIS_PASSWORD=.*/REDIS_PASSWORD=$REDIS_PASSWORD/" $env_file
        
        echo -e "${GREEN}✅ Contraseñas seguras generadas${NC}"
    fi
}

# Función para construir e iniciar servicios
start_services() {
    echo -e "${BLUE}🔨 Construyendo servicios...${NC}"
    
    local env_file=${ENV_FILE:-.env.secure}
    
    # Exportar variables de entorno (solo líneas que no empiezan con # y que contienen =)
    set -a
    source <(grep -v '^#' $env_file | grep '=')
    set +a
    
    # Construir imágenes
    docker-compose -f docker-compose.secure.yml build --no-cache
    
    echo -e "${BLUE}🚀 Iniciando servicios con configuración segura...${NC}"
    
    # Iniciar servicios
    docker-compose -f docker-compose.secure.yml up -d
    
    echo -e "${GREEN}✅ Servicios iniciados exitosamente${NC}"
}

# Función para mostrar información de acceso
display_access_info() {
    local env_file=${ENV_FILE:-.env.secure}
    
    # Cargar variables de entorno temporalmente para mostrar información
    local FRONTEND_PORT=$(grep "^FRONTEND_PORT=" $env_file | cut -d'=' -f2)
    local NGINX_PORT=$(grep "^NGINX_PORT=" $env_file | cut -d'=' -f2)
    local MAILHOG_HTTP_PORT=$(grep "^MAILHOG_HTTP_PORT=" $env_file | cut -d'=' -f2)
    local DB_ROOT_PASSWORD=$(grep "^DB_ROOT_PASSWORD=" $env_file | cut -d'=' -f2)
    local REDIS_PASSWORD=$(grep "^REDIS_PASSWORD=" $env_file | cut -d'=' -f2)
    
    echo -e "${GREEN}🎉 Sistema de Visitas iniciado con configuración segura!${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}🌐 Acceso a servicios:${NC}"
    echo -e "   📱 Frontend: http://localhost:${FRONTEND_PORT:-5173}"
    echo -e "   🔧 Backend API: http://localhost:${NGINX_PORT:-8080}/api"
    echo -e "   📧 Mailhog: http://localhost:${MAILHOG_HTTP_PORT:-8026}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}🗄️  Herramientas de administración:${NC}"
    echo -e "   🗄️  PhpMyAdmin: http://localhost:8081 (si habilitado)"
    echo -e "   🔄 Redis Commander: http://localhost:8082 (si habilitado)"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}🔑 Credenciales (guardar en lugar seguro):${NC}"
    echo -e "   🗄️  MySQL: root / ${DB_ROOT_PASSWORD}"
    echo -e "   🔄 Redis: ${REDIS_PASSWORD}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📋 Comandos útiles:${NC}"
    echo -e "   Ver logs: docker-compose -f docker-compose.secure.yml logs -f"
    echo -e "   Detener: docker-compose -f docker-compose.secure.yml down"
    echo -e "   Estado: docker-compose -f docker-compose.secure.yml ps"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Función principal
main() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🔒 Sistema de Visitas - Docker Seguro${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Verificar requisitos
    check_requirements
    
    # Configurar puertos seguros
    setup_secure_ports
    
    # Configurar seguridad
    setup_security
    
    # Construir e iniciar servicios
    start_services
    
    # Mostrar información de acceso
    display_access_info
}

# Manejo de señales
trap 'echo -e "\n${RED}⚠️  Deteniendo servicios...${NC}"; docker-compose -f docker-compose.secure.yml down; exit 0' INT TERM

# Ejecutar menú principal
main