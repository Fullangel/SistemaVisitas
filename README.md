# Sistema Nacional de Visitas

Un sistema integral para la gestión de visitas institucionales con soporte multiidioma, notificaciones en tiempo real, y arquitectura escalable basada en microservicios.

## 🚀 Características Principales

- **Gestión de Visitas**: Registro, programación y seguimiento de visitas institucionales
- **Multiidioma**: Soporte completo para español, inglés y portugués
- **Notificaciones en Tiempo Real**: Sistema de notificaciones con WebSockets y Redis
- **Seguridad Avanzada**: Autenticación JWT, rate limiting, sanitización de datos
- **Panel de Administración**: Interfaz moderna con Vue.js 3 y Tailwind CSS
- **API RESTful**: Backend robusto con Laravel 11
- **Documentación Automática**: Swagger/OpenAPI integrado
- **Monitoreo y Logs**: Sistema de logging con procesamiento de datos sensibles

## 📋 Requisitos Previos

- Docker 20.10+
- Docker Compose 2.0+
- Git
- 4GB RAM mínimo
- 10GB espacio en disco

## 🔧 Configuración Local Sin Docker

Si prefieres ejecutar el proyecto localmente sin Docker:

1. **Backend (Laravel)**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan jwt:secret
   php artisan migrate --seed
   php artisan serve
   ```

2. **Frontend (Vue.js)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Base de datos y Redis**
   - Instala MySQL 8.0 y Redis 7.0 localmente
   - Configura las conexiones en el archivo `.env` del backend

## 🔧 Instalación Rápida

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/sistema-visitas-nacional.git
   cd sistema-visitas-nacional
   ```

2. **Ejecutar el script de instalación**
   ```bash
   chmod +x scripts/*.sh
   ./scripts/install.sh
   ```

3. **Iniciar el sistema**
   ```bash
   ./scripts/start.sh
   ```

4. **Acceder al sistema**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - Documentación API: http://localhost:8080/api/documentation

### Opción 2: Sin Docker (Entorno Local)

1. **Instalar requisitos**
   - PHP 8.1+
   - MySQL 8.0
   - Redis 7.0
   - Node.js 18+
   - Composer

2. **Ejecutar instalación local**
   ```bash
   chmod +x scripts/*.sh
   ./scripts/install-local.sh
   ```

3. **Iniciar servicios**
   ```bash
   ./scripts/start-local.sh
   ```

4. **Acceder al sistema**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api

📖 **Guía completa de instalación local**: [docs/local-setup/README.md](docs/local-setup/README.md)

## 📖 Scripts de Administración

### Scripts Docker (Entorno Contenedorizado)

| Script | Descripción |
|--------|-------------|
| `./scripts/install.sh` | Instalación completa del sistema con Docker |
| `./scripts/start.sh` | Iniciar todos los servicios con Docker |
| `./scripts/stop.sh` | Detener todos los servicios con Docker |
| `./scripts/reset.sh` | Reiniciar el sistema con Docker |
| `./scripts/backup.sh` | Realizar copia de seguridad |
| `./scripts/restore.sh` | Restaurar desde backup |
| `./scripts/status.sh` | Verificar estado del sistema con Docker |
| `./scripts/logs.sh [servicio]` | Ver logs (backend, frontend, db, redis, nginx, all) |
| `./scripts/update.sh` | Actualizar el sistema |
| `./scripts/maintenance.sh [on/off]` | Activar/desactivar modo mantenimiento |

### Scripts Locales (Entorno Sin Docker)

| Script | Descripción |
|--------|-------------|
| `./scripts/install-local.sh` | Instalación completa del sistema local |
| `./scripts/start-local.sh` | Iniciar todos los servicios locales |
| `./scripts/stop-local.sh` | Detener todos los servicios locales |
| `./scripts/logs-local.sh [servicio]` | Ver logs locales (backend, frontend, queue, horizon, mailhog, laravel, all, status) |

## 🏗️ Arquitectura

### Stack Tecnológico

**Backend (Laravel 11)**
- PHP 8.3
- MySQL 8.0
- Redis 7.0
- Laravel Sanctum (Autenticación)
- Laravel Horizon (Queue Management)

**Frontend (Vue.js 3)**
- Vue 3.4 con Composition API
- TypeScript 5.0
- Vite 5.0
- Tailwind CSS 3.4
- Pinia (State Management)

**Infraestructura**
- Docker & Docker Compose
- Nginx (Reverse Proxy)
- Redis (Cache & Sessions)
- MySQL (Base de datos principal)

### Estructura de Directorios

```
sistema-visitas-nacional/
├── backend/                 # API Laravel
│   ├── app/
│   │   ├── Http/           # Controllers, Middleware, Requests
│   │   ├── Models/         # Modelos Eloquent
│   │   ├── Services/       # Lógica de negocio
│   │   └── Logging/        # Procesamiento de logs
│   ├── config/             # Configuraciones
│   ├── database/           # Migraciones y seeders
│   ├── routes/             # Definición de rutas
│   └── storage/            # Archivos y logs
├── frontend/                # Aplicación Vue.js
│   ├── src/
│   │   ├── components/     # Componentes Vue
│   │   ├── views/          # Vistas/páginas
│   │   ├── stores/         # Estado global (Pinia)
│   │   ├── router/         # Enrutamiento
│   │   ├── services/       # Servicios API
│   │   └── types/          # Definiciones TypeScript
│   ├── public/             # Assets públicos
│   └── tests/              # Pruebas
├── docker/                  # Configuraciones Docker
├── scripts/                # Scripts de administración
└── docs/                   # Documentación adicional
```

## 🔐 Seguridad

### Características de Seguridad Implementadas

- **Autenticación JWT**: Tokens seguros con expiración
- **Rate Limiting**: Límites de peticiones por endpoint
- **Sanitización de Datos**: Limpieza automática de entradas
- **Headers de Seguridad**: CSP, HSTS, X-Frame-Options, etc.
- **Procesamiento de Logs**: Enmascaramiento de datos sensibles
- **CORS Configurado**: Orígenes permitidos controlados
- **Validación de Entrada**: Requests personalizadas con validación

### Variables de Entorno Importantes

```env
# Backend
APP_KEY=base64:...
JWT_SECRET=...
SANCTUM_STATEFUL_DOMAINS=localhost:3000
FRONTEND_URL=http://localhost:3000
```

## 🧪 Datos de Prueba

El sistema incluye datos de prueba preconfigurados que se crean automáticamente al ejecutar las migraciones con seeders:

### Usuarios de Prueba

| Usuario | Contraseña | Rol | Permisos |
|---------|-------------|-----|----------|
| admin | password | Administrator | Acceso completo a todo el sistema |
| seguridad | password | Security | Gestión de visitas y reportes |
| usuario | password | Employee | Acceso básico a visitas y reportes |

### Datos de Prueba Incluidos

- **Regiones**: 5 regiones (RN, RM, VS, BI, AR)
- **Designaciones**: 10 cargos diferentes
- **Sedes**: 5 sedes principales
- **Departamentos**: 8 departamentos
- **Empleados**: 5 empleados de prueba
- **Visitas**: 4 visitas con diferentes estados (pending, approved, in_progress, completed)
- **Logs**: 5 registros de actividad
- **Adjuntos**: 4 archivos de prueba
- **Notificaciones**: 5 notificaciones para usuarios

### Comandos Útiles para Desarrollo

```bash
# Limpiar y recrear base de datos con datos de prueba
php artisan migrate:fresh --seed

# Ejecutar seeders específicos
php artisan db:seed --class=UsersTableSeeder
php artisan db:seed --class=VisitsTableSeeder

# Verificar datos en consola
php artisan tinker
```

## 📚 Documentación Adicional

- [Guía de API](docs/api/README.md)
- [Documentación de Base de Datos](docs/database/README.md)
- [Guía de Despliegue](docs/deployment/README.md)
- [Manual de Usuario](docs/user-manual/README.md)
- [Guía de Desarrollo](docs/development/README.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Tu Nombre** - *Trabajo inicial* - [TuUsuario](https://github.com/TuUsuario)

## 🙏 Agradecimientos

- Laravel Framework
- Vue.js
- Tailwind CSS
- Todos los contribuyentes de código abierto
# Seguridad
SECURITY_RATE_LIMIT_LOGIN=5
SECURITY_RATE_LIMIT_API=60
SECURITY_SESSION_LIFETIME=120
```

## 📊 Monitoreo y Mantenimiento

### Health Checks
- Endpoint: `GET /api/health`
- Verifica: Base de datos, Redis, sistema de archivos

### Métricas
- Laravel Telescope (desarrollo)
- Logs estructurados con procesamiento de datos sensibles
- Monitoreo de colas con Horizon

### Mantenimiento
```bash
# Limpiar caché
./scripts/maintenance.sh enable
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear
./scripts/maintenance.sh disable

# Optimizar producción
docker-compose exec backend php artisan config:cache
docker-compose exec backend php artisan route:cache
docker-compose exec backend php artisan view:cache
```

## 🌍 Internacionalización

El sistema soporta español, inglés y portugués:

```bash
# Backend - Archivos en backend/lang/
# Frontend - Archivos en frontend/src/locales/
```

Cambio de idioma dinámico basado en:
- Preferencias del usuario
- Headers HTTP (Accept-Language)
- Parámetro de URL (?lang=es)

## 🧪 Testing

```bash
# Backend
docker-compose exec backend php artisan test

# Frontend
docker-compose exec frontend npm test
```

## 📚 Documentación Adicional

- [API Documentation](docs/api/README.md)
- [Deployment Guide](docs/deployment/README.md)
- [Development Guide](docs/development/README.md)
- [User Manual](docs/user-manual/README.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🆘 Soporte

- 📧 Email: soporte@visitas-nacional.gob
- 📞 Teléfono: +1 234 567 8900
- 💬 Chat: Disponible en el panel de administración

---

**Desarrollado con ❤️ por el Equipo de Sistemas Nacionales**