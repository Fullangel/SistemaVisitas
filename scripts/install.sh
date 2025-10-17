#!/bin/bash

# Script de instalación del Sistema Nacional de Visitas
# Este script configura el entorno completo del sistema

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de utilidad
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

# Verificar requisitos del sistema
check_requirements() {
    log_info "Verificando requisitos del sistema..."
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado. Por favor instale Docker primero."
        exit 1
    fi
    
    # Verificar Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose no está instalado. Por favor instale Docker Compose primero."
        exit 1
    fi
    
    # Verificar Git
    if ! command -v git &> /dev/null; then
        log_error "Git no está instalado. Por favor instale Git primero."
        exit 1
    fi
    
    log_success "Todos los requisitos están instalados"
}

# Crear archivos de configuración
create_config_files() {
    log_info "Creando archivos de configuración..."
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        log_success "Archivo backend/.env creado"
    else
        log_warning "El archivo backend/.env ya existe"
    fi
    
    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        cat > frontend/.env << EOF
# Frontend Environment Variables
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME="Sistema Nacional de Visitas"
VITE_APP_ENV=development
VITE_APP_DEBUG=true
EOF
        log_success "Archivo frontend/.env creado"
    else
        log_warning "El archivo frontend/.env ya existe"
    fi
}

# Configurar permisos
setup_permissions() {
    log_info "Configurando permisos..."
    
    # Directorios de Laravel
    chmod -R 775 backend/storage
    chmod -R 775 backend/bootstrap/cache
    chmod -R 775 backend/public
    
    # Crear directorios si no existen
    mkdir -p backend/storage/{app,framework,logs}
    mkdir -p backend/storage/framework/{cache,sessions,testing,views}
    mkdir -p backend/storage/app/{public,private}
    
    log_success "Permisos configurados correctamente"
}

# Construir y levantar contenedores
build_containers() {
    log_info "Construyendo contenedores Docker..."
    
    # Detener contenedores existentes
    docker-compose down || true
    
    # Construir imagenes
    docker-compose build --no-cache
    
    # Levantar servicios
    docker-compose up -d
    
    # Esperar a que los servicios estén listos
    log_info "Esperando a que los servicios estén listos..."
    sleep 30
    
    log_success "Contenedores construidos y levantados"
}

# Instalar dependencias del backend
install_backend_dependencies() {
    log_info "Instalando dependencias del backend..."
    
    docker-compose exec -T backend composer install --no-dev --optimize-autoloader
    
    log_success "Dependencias del backend instaladas"
}

# Instalar dependencias del frontend
install_frontend_dependencies() {
    log_info "Instalando dependencias del frontend..."
    
    docker-compose exec -T frontend npm install
    
    log_success "Dependencias del frontend instaladas"
}

# Configurar base de datos
setup_database() {
    log_info "Configurando base de datos..."
    
    # Esperar a que MySQL esté listo
    log_info "Esperando a que MySQL esté listo..."
    docker-compose exec -T db mysql -uroot -psecret -e "SELECT 1" || sleep 10
    
    # Ejecutar migraciones
    docker-compose exec -T backend php artisan migrate --force
    
    # Ejecutar seeders
    docker-compose exec -T backend php artisan db:seed --force
    
    log_success "Base de datos configurada"
}

# Generar clave de aplicación
generate_app_key() {
    log_info "Generando clave de aplicación..."
    
    docker-compose exec -T backend php artisan key:generate
    
    log_success "Clave de aplicación generada"
}

# Configurar caché
setup_cache() {
    log_info "Configurando caché..."
    
    docker-compose exec -T backend php artisan config:cache
    docker-compose exec -T backend php artisan route:cache
    docker-compose exec -T backend php artisan view:cache
    
    log_success "Caché configurada"
}

# Crear enlaces simbólicos
create_symlinks() {
    log_info "Creando enlaces simbólicos..."
    
    docker-compose exec -T backend php artisan storage:link
    
    log_success "Enlaces simbólicos creados"
}

# Configurar Horizon
setup_horizon() {
    log_info "Configurando Horizon..."
    
    # Publicar configuración de Horizon
    docker-compose exec -T backend php artisan horizon:publish
    
    # Reiniciar Horizon
    docker-compose exec -T backend php artisan horizon:terminate
    
    log_success "Horizon configurado"
}

# Construir frontend
build_frontend() {
    log_info "Construyendo frontend..."
    
    docker-compose exec -T frontend npm run build
    
    log_success "Frontend construido"
}

# Verificar instalación
verify_installation() {
    log_info "Verificando instalación..."
    
    # Verificar que los servicios estén corriendo
    if docker-compose ps | grep -q "Up"; then
        log_success "Los servicios están corriendo"
    else
        log_error "Algunos servicios no están corriendo"
        docker-compose ps
        exit 1
    fi
    
    # Verificar conexión a base de datos
    if docker-compose exec -T backend php artisan migrate:status > /dev/null 2>&1; then
        log_success "Conexión a base de datos exitosa"
    else
        log_error "Error al conectar con la base de datos"
        exit 1
    fi
    
    log_success "Instalación verificada exitosamente"
}

# Mostrar información final
show_completion_info() {
    log_success "¡Instalación completada exitosamente!"
    echo ""
    echo "=========================================="
    echo "Sistema Nacional de Visitas"
    echo "=========================================="
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:8080"
    echo "Base de datos: localhost:3306"
    echo "Redis: localhost:6379"
    echo ""
    echo "Credenciales de administrador por defecto:"
    echo "Email: admin@visitas-nacional.com"
    echo "Contraseña: admin123"
    echo ""
    echo "Para ver los logs:"
    echo "  docker-compose logs -f"
    echo ""
    echo "Para entrar al contenedor backend:"
    echo "  docker-compose exec backend bash"
    echo ""
    echo "Para entrar al contenedor frontend:"
    echo "  docker-compose exec frontend sh"
    echo ""
    echo "=========================================="
}

# Función principal
main() {
    log_info "Iniciando instalación del Sistema Nacional de Visitas..."
    
    check_requirements
    create_config_files
    setup_permissions
    build_containers
    install_backend_dependencies
    install_frontend_dependencies
    generate_app_key
    setup_database
    setup_cache
    create_symlinks
    setup_horizon
    build_frontend
    verify_installation
    show_completion_info
}

# Manejo de errores
trap 'log_error "Error en la línea $LINENO. Instalación fallida."' ERR

# Ejecutar instalación
main "$@"