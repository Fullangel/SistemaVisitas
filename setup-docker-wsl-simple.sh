#!/bin/bash

# Script simplificado para configurar Docker en WSL2

echo "🐳 Configurando Docker en WSL2..."

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar que estamos en WSL2
if [[ $(grep -i microsoft /proc/version) && $(grep -i wsl2 /proc/version) ]]; then
    echo -e "${GREEN}✅ Estás en WSL2${NC}"
else
    echo -e "${RED}❌ No estás en WSL2${NC}"
    exit 1
fi

# Crear grupo docker si no existe
if ! getent group docker > /dev/null 2>&1; then
    echo -e "${BLUE}🔧 Creando grupo docker...${NC}"
    sudo groupadd docker
fi

# Agregar usuario al grupo docker
if ! groups $USER | grep -q docker; then
    echo -e "${BLUE}🔧 Agregando usuario al grupo docker...${NC}"
    sudo usermod -aG docker $USER
    echo -e "${YELLOW}⚠️  Necesitarás cerrar y volver a abrir la terminal después de este script${NC}"
fi

# Verificar conexión con Docker Desktop
echo -e "${BLUE}🔍 Verificando Docker Desktop...${NC}"

# Intentar conectar con Docker Desktop
if docker version > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker Desktop está conectado!${NC}"
    
    # Mostrar información
    echo -e "${BLUE}📊 Información de Docker:${NC}"
    docker --version
    docker-compose --version 2>/dev/null || echo "Docker Compose no encontrado"
    
    # Test básico
    echo -e "${BLUE}🧪 Probando Docker...${NC}"
    if docker run --rm hello-world > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Docker está funcionando perfectamente!${NC}"
    else
        echo -e "${YELLOW}⚠️  Docker está conectado pero hay problemas para ejecutar contenedores${NC}"
    fi
    
else
    echo -e "${RED}❌ Docker Desktop no está conectado${NC}"
    echo -e "${YELLOW}Por favor verifica:${NC}"
    echo -e "${YELLOW}1. Docker Desktop está ejecutándose en Windows${NC}"
    echo -e "${YELLOW}2. La integración WSL2 está habilitada en Docker Desktop${NC}"
    echo -e "${YELLOW}3. Tu distribución Ubuntu está habilitada en la integración${NC}"
    echo -e "${YELLOW}4. Has reiniciado Docker Desktop después de habilitar la integración${NC}"
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📋 Pasos a seguir si Docker no funciona:${NC}"
echo -e "${YELLOW}1. Abre Docker Desktop en Windows${NC}"
echo -e "${YELLOW}2. Ve a Settings > Resources > WSL Integration${NC}"
echo -e "${YELLOW}3. Activa la integración con tu distribución${NC}"
echo -e "${YELLOW}4. Aplica los cambios y reinicia Docker Desktop${NC}"
echo -e "${YELLOW}5. Cierra y vuelve a abrir esta terminal WSL${NC}"
echo -e "${YELLOW}6. Prueba de nuevo con: docker --version${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"