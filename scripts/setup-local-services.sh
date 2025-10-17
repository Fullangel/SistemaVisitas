#!/bin/bash

# Script para configurar servicios locales (MySQL, Redis, etc.)
# Sistema Nacional de Visitas

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Detectar sistema operativo
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "unknown"
    fi
}

OS=$(detect_os)

# Función para instalar MariaDB
install_mariadb() {
    log "Instalando MariaDB..."
    
    case $OS in
        linux)
            if command -v apt-get &> /dev/null; then
                sudo apt update
                sudo apt install -y mariadb-server mariadb-client
                sudo mysql_secure_installation
            elif command -v yum &> /dev/null; then
                sudo yum install -y mariadb-server mariadb
                sudo mysql_secure_installation
            else
                error "No se pudo detectar el gestor de paquetes. Por favor instala MariaDB manualmente."
                return 1
            fi
            
            # Iniciar y habilitar MariaDB
            sudo systemctl start mariadb
            sudo systemctl enable mariadb
            ;;
        macos)
            if command -v brew &> /dev/null; then
                brew install mariadb
                brew services start mariadb
                mysql_secure_installation
            else
                error "Homebrew no está instalado. Por favor instala Homebrew primero."
                return 1
            fi
            ;;
        *)
            error "Sistema operativo no soportado para instalación automática."
            return 1
            ;;
    esac
    
    success "MariaDB instalado y configurado"
}

# Función para instalar Redis
install_redis() {
    log "Instalando Redis..."
    
    case $OS in
        linux)
            if command -v apt-get &> /dev/null; then
                sudo apt update
                sudo apt install -y redis-server
            elif command -v yum &> /dev/null; then
                sudo yum install -y redis
            else
                error "No se pudo detectar el gestor de paquetes. Por favor instala Redis manualmente."
                return 1
            fi
            
            # Iniciar y habilitar Redis
            sudo systemctl start redis-server
            sudo systemctl enable redis-server
            ;;
        macos)
            if command -v brew &> /dev/null; then
                brew install redis
                brew services start redis
            else
                error "Homebrew no está instalado. Por favor instala Homebrew primero."
                return 1
            fi
            ;;
        *)
            error "Sistema operativo no soportado para instalación automática."
            return 1
            ;;
    esac
    
    success "Redis instalado y configurado"
}

# Función para instalar PHP
install_php() {
    log "Instalando PHP 8.1+..."
    
    case $OS in
        linux)
            if command -v apt-get &> /dev/null; then
                sudo apt update
                sudo apt install -y software-properties-common
                sudo add-apt-repository ppa:ondrej/php -y
                sudo apt update
                sudo apt install -y php8.1 php8.1-cli php8.1-common php8.1-mysql php8.1-redis php8.1-xml php8.1-curl php8.1-gd php8.1-mbstring php8.1-zip php8.1-intl php8.1-bcmath php8.1-soap php8.1-dev
            elif command -v yum &> /dev/null; then
                sudo yum install -y epel-release
                sudo yum install -y https://rpms.remirepo.net/enterprise/remi-release-8.rpm
                sudo yum module reset php -y
                sudo yum module install php:remi-8.1 -y
                sudo yum install -y php php-cli php-common php-mysql php-redis php-xml php-curl php-gd php-mbstring php-zip php-intl php-bcmath php-soap php-devel
            else
                error "No se pudo detectar el gestor de paquetes. Por favor instala PHP manualmente."
                return 1
            fi
            ;;
        macos)
            if command -v brew &> /dev/null; then
                brew install php@8.1
                brew link php@8.1
            else
                error "Homebrew no está instalado. Por favor instala Homebrew primero."
                return 1
            fi
            ;;
        *)
            error "Sistema operativo no soportado para instalación automática."
            return 1
            ;;
    esac
    
    success "PHP instalado y configurado"
}

# Función para instalar Node.js
install_nodejs() {
    log "Instalando Node.js 18+..."
    
    case $OS in
        linux)
            if command -v apt-get &> /dev/null; then
                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt-get install -y nodejs
            elif command -v yum &> /dev/null; then
                curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
                sudo yum install -y nodejs
            else
                error "No se pudo detectar el gestor de paquetes. Por favor instala Node.js manualmente."
                return 1
            fi
            ;;
        macos)
            if command -v brew &> /dev/null; then
                brew install node
            else
                error "Homebrew no está instalado. Por favor instala Homebrew primero."
                return 1
            fi
            ;;
        *)
            error "Sistema operativo no soportado para instalación automática."
            return 1
            ;;
    esac
    
    success "Node.js instalado y configurado"
}

# Función para instalar Composer
install_composer() {
    log "Instalando Composer..."
    
    if ! command -v composer &> /dev/null; then
        curl -sS https://getcomposer.org/installer | php
        sudo mv composer.phar /usr/local/bin/composer
        sudo chmod +x /usr/local/bin/composer
        success "Composer instalado"
    else
        warning "Composer ya está instalado"
    fi
}

# Función para configurar base de datos
setup_database() {
    log "Configurando base de datos..."
    
    # Detectar cliente de base de datos
    DB_CLIENT="mysql"
    DB_ADMIN="mysqladmin"
    SERVICE_NAME="mysql"
    
    if command -v mariadb &> /dev/null; then
        DB_CLIENT="mariadb"
        SERVICE_NAME="mariadb"
        if command -v mariadb-admin &> /dev/null; then
            DB_ADMIN="mariadb-admin"
        fi
    elif ! command -v mysql &> /dev/null; then
        error "No se encontró cliente de base de datos (MariaDB/MySQL)"
        return 1
    fi
    
    log "Usando cliente de base de datos: $DB_CLIENT"
    
    # Verificar si MariaDB/MySQL está ejecutándose
    if ! $DB_ADMIN ping -h localhost -u root &> /dev/null; then
        warning "MariaDB/MySQL no está ejecutándose. Iniciando servicio..."
        case $OS in
            linux)
                sudo systemctl start $SERVICE_NAME
                ;;
            macos)
                brew services start $SERVICE_NAME
                ;;
        esac
        
        # Esperar a que el servicio esté listo
        sleep 5
    fi
    
    # Crear base de datos y usuario
    $DB_CLIENT -u root -p <<EOF
CREATE DATABASE IF NOT EXISTS sistema_visitas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'visitas_user'@'localhost' IDENTIFIED BY 'secret';
GRANT ALL PRIVILEGES ON sistema_visitas.* TO 'visitas_user'@'localhost';
FLUSH PRIVILEGES;
EOF
    
    success "Base de datos configurada"
}

# Función para configurar Redis
setup_redis() {
    log "Configurando Redis..."
    
    # Verificar si Redis está ejecutándose
    if ! redis-cli ping &> /dev/null; then
        warning "Redis no está ejecutándose. Iniciando servicio..."
        case $OS in
            linux)
                sudo systemctl start redis-server
                ;;
            macos)
                brew services start redis
                ;;
        esac
        
        # Esperar a que Redis esté listo
        sleep 3
    fi
    
    # Verificar conexión
    if redis-cli ping | grep -q "PONG"; then
        success "Redis configurado y funcionando"
    else
        error "No se pudo conectar a Redis"
        return 1
    fi
}

# Función principal
main() {
    log "Configurador de servicios locales - Sistema Nacional de Visitas"
    log "Sistema operativo detectado: $OS"
    echo ""
    
    # Menú de opciones
    echo "¿Qué deseas instalar/configurar?"
    echo "1) Todo (MariaDB, Redis, PHP, Node.js, Composer)"
    echo "2) Solo MariaDB/MySQL"
    echo "3) Solo Redis"
    echo "4) Solo PHP"
    echo "5) Solo Node.js"
    echo "6) Solo Composer"
    echo "7) Configurar base de datos"
    echo "8) Configurar Redis"
    echo "9) Verificar instalación"
    echo "0) Salir"
    echo ""
    
    read -p "Selecciona una opción (0-9): " option
    
    case $option in
        1)
            install_mariadb
            install_redis
            install_php
            install_nodejs
            install_composer
            setup_database
            setup_redis
            ;;
        2)
            install_mariadb
            setup_database
            ;;
        3)
            install_redis
            setup_redis
            ;;
        4)
            install_php
            ;;
        5)
            install_nodejs
            ;;
        6)
            install_composer
            ;;
        7)
            setup_database
            ;;
        8)
            setup_redis
            ;;
        9)
            log "Verificando instalación..."
            
            echo ""
            echo "=== Verificación de servicios ==="
            
            # Verificar PHP
            if command -v php &> /dev/null; then
                success "✓ PHP $(php -r 'echo PHP_VERSION;')"
            else
                error "✗ PHP no instalado"
            fi
            
            # Verificar Composer
            if command -v composer &> /dev/null; then
                success "✓ Composer $(composer --version | awk '{print $3}')"
            else
                error "✗ Composer no instalado"
            fi
            
            # Verificar Node.js
            if command -v node &> /dev/null; then
                success "✓ Node.js $(node --version)"
            else
                error "✗ Node.js no instalado"
            fi
            
            # Verificar MariaDB/MySQL
            if command -v mariadb &> /dev/null; then
                success "✓ MariaDB instalado"
                if command -v mariadb-admin &> /dev/null; then
                    if mariadb-admin ping -h localhost -u root &> /dev/null; then
                        success "✓ MariaDB ejecutándose"
                    else
                        warning "⚠ MariaDB no está ejecutándose"
                    fi
                elif mysqladmin ping -h localhost -u root &> /dev/null; then
                    success "✓ MariaDB ejecutándose"
                else
                    warning "⚠ MariaDB no está ejecutándose"
                fi
            elif command -v mysql &> /dev/null; then
                success "✓ MySQL instalado"
                if mysqladmin ping -h localhost -u root &> /dev/null; then
                    success "✓ MySQL ejecutándose"
                else
                    warning "⚠ MySQL no está ejecutándose"
                fi
            else
                error "✗ MariaDB/MySQL no instalado"
            fi
            
            # Verificar Redis
            if command -v redis-cli &> /dev/null; then
                success "✓ Redis instalado"
                if redis-cli ping &> /dev/null; then
                    success "✓ Redis ejecutándose"
                else
                    warning "⚠ Redis no está ejecutándose"
                fi
            else
                error "✗ Redis no instalado"
            fi
            
            echo ""
            ;;
        0)
            log "Saliendo..."
            exit 0
            ;;
        *)
            error "Opción inválida"
            exit 1
            ;;
    esac
    
    echo ""
    success "¡Proceso completado!"
    
    # Mensaje final
    log "Pasos siguientes:"
    log "1. Ejecuta ./scripts/install-local.sh para instalar el proyecto"
    log "2. Ejecuta ./scripts/start-local.sh para iniciar el sistema"
    log "3. Visita http://localhost:3000 para ver el frontend"
    log "4. Visita http://localhost:8000 para ver el backend"
}

# Ejecutar función principal
main "$@"