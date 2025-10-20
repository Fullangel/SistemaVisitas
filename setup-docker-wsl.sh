#!/bin/bash

# Script para configurar Docker en WSL2 con Docker Desktop

set -e

echo "🐳 Configurando Docker en WSL2 con Docker Desktop..."

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar si estamos en WSL2
if ! grep -qi microsoft /proc/version; then
    echo -e "${RED}❌ Este script debe ejecutarse en WSL2${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Verificando configuración de WSL2...${NC}"

# Verificar versión de WSL
WSL_VERSION=$(wsl.exe -l -v | grep -i ubuntu | awk '{print $3}')
if [ "$WSL_VERSION" != "2" ]; then
    echo -e "${RED}❌ WSL2 no está configurado correctamente${NC}"
    echo -e "${YELLOW}Por favor, configura tu distribución para usar WSL2:${NC}"
    echo -e "${YELLOW}En PowerShell (como administrador):${NC}"
    echo -e "${YELLOW}wsl --set-version Ubuntu 2${NC}"
    exit 1
fi

echo -e "${GREEN}✅ WSL2 está configurado correctamente${NC}"

# Crear grupo docker si no existe
if ! getent group docker > /dev/null 2>&1; then
    echo -e "${BLUE}🔧 Creando grupo docker...${NC}"
    sudo groupadd docker
fi

# Agregar usuario actual al grupo docker
if ! groups $USER | grep -q docker; then
    echo -e "${BLUE}🔧 Agregando usuario al grupo docker...${NC}"
    sudo usermod -aG docker $USER
    echo -e "${YELLOW}⚠️  Por favor, cierra y vuelve a abrir tu terminal WSL para aplicar los cambios${NC}"
fi

# Configurar Docker Desktop para WSL2 Integration
echo -e "${BLUE}📋 Configuración necesaria en Docker Desktop:${NC}"
echo -e "${YELLOW}1. Abre Docker Desktop en Windows${NC}"
echo -e "${YELLOW}2. Ve a Settings > Resources > WSL Integration${NC}"
echo -e "${YELLOW}3. Activa 'Enable integration with my default WSL distro'${NC}"
echo -e "${YELLOW}4. Asegúrate de que tu distribución Ubuntu esté habilitada${NC}"
echo -e "${YELLOW}5. Click en 'Apply & Restart'${NC}"

# Verificar conectividad con Docker Desktop
echo -e "${BLUE}🔍 Verificando conexión con Docker Desktop...${NC}"

# Esperar un momento para que se aplique la configuración
sleep 2

# Test de conexión
if docker version > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker está funcionando correctamente en WSL2!${NC}"
    
    # Mostrar versión
    echo -e "${BLUE}📊 Versión de Docker:${NC}"
    docker --version
    docker-compose --version
    
    # Test de funcionamiento
    echo -e "${BLUE}🧪 Probando Docker con un contenedor de prueba...${NC}"
    docker run --rm hello-world > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Docker está completamente funcional!${NC}"
    else
        echo -e "${RED}❌ Docker no puede ejecutar contenedores${NC}"
        exit 1
    fi
    
else
    echo -e "${RED}❌ Docker no está disponible${NC}"
    echo -e "${YELLOW}Por favor, verifica que Docker Desktop esté ejecutándose en Windows${NC}"
    echo -e "${YELLOW}y que la integración WSL2 esté habilitada${NC}"
    exit 1
fi

# Configuración adicional para optimización
echo -e "${BLUE}⚙️  Configurando optimizaciones adicionales...${NC}"

# Crear directorio de configuración de Docker
mkdir -p ~/.docker

# Configurar CLI para usar WSL2
echo "{
  "credsStore": "wincred.exe"
}" > ~/.docker/config.json

echo -e "${GREEN}🎉 Configuración de Docker en WSL2 completada!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo -e "${YELLOW}1. Si hiciste cambios, reinicia tu terminal WSL${NC}"
echo -e "${YELLOW}2. Verifica con: docker --version${NC}"
echo -e "${YELLOW}3. Prueba con: docker run hello-world${NC}"
echo -e "${YELLOW}4. ¡Listo para usar Docker en tu proyecto!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Información adicional
echo -e "${BLUE}💡 Tips:${NC}"
echo -e "${BLUE}- Docker Desktop debe estar ejecutándose en Windows${NC}"
echo -e "${BLUE}- Usa 'docker context ls' para ver contextos disponibles${NC}"
echo -e "${BLUE}- El contexto 'default' debe estar activo${NC}"
echo -e "${BLUE}- Para problemas, revisa Docker Desktop > Troubleshoot${NC}"