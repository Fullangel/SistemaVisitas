# 🐳 Docker Setup - Sistema de Visitas

Guía completa para configurar y ejecutar el Sistema de Visitas usando Docker.

## 📋 Requisitos Previos

- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM mínimo
- 10GB espacio en disco

## 🚀 Inicio Rápido

### Opción 1: Script Automático
```bash
chmod +x docker-start.sh
./docker-start.sh
```

### Opción 2: Manual
```bash
# 1. Copiar archivo de entorno
cp .env.docker .env

# 2. Construir e iniciar servicios
docker-compose up -d --build

# 3. Configurar Laravel
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate --force
```

## 📁 Estructura de Docker

```
docker/
├── mysql/
│   ├── my.cnf              # Configuración optimizada de MySQL
│   └── init/               # Scripts de inicialización
├── nginx/
│   └── conf.d/
│       └── default.conf    # Configuración de Nginx
├── php/
│   ├── Dockerfile          # Imagen PHP optimizada
│   ├── entrypoint.sh       # Script de inicialización
│   ├── local.ini           # Configuración PHP para desarrollo
│   ├── php-fpm.conf        # Configuración PHP-FPM
│   └── supervisord.conf    # Gestión de procesos
└── redis/
    └── redis.conf          # Configuración optimizada de Redis
```

## 🔧 Configuración de Servicios

### Backend (Laravel)
- **Puerto**: 8080
- **PHP**: 8.2-FPM
- **Healthcheck**: Verificación de rutas
- **Optimizaciones**: OPcache, Composer autoload optimizado

### Frontend (React + Vite)
- **Puerto**: 5173
- **Node.js**: 18-alpine
- **Hot reload**: Habilitado
- **Optimizaciones**: Build optimizado para producción

### Base de Datos (MySQL 8.0)
- **Puerto**: 3306
- **Optimizaciones**: Buffer pool, query cache, índices
- **Healthcheck**: mysqladmin ping
- **Backup**: Volúmenes persistentes

### Cache (Redis 7)
- **Puerto**: 6379
- **Optimizaciones**: LRU, compresión
- **Healthcheck**: redis-cli ping
- **Seguridad**: Comandos peligrosos deshabilitados

### Queue Worker (Horizon)
- **Procesamiento asíncrono**
- **Reintentos automáticos**
- **Monitoreo integrado**

## 🌐 Acceso a Servicios

| Servicio | URL | Credenciales |
|----------|-----|---------------|
| Frontend | http://localhost:5173 | - |
| Backend API | http://localhost:8080/api | - |
| Mailhog | http://localhost:8025 | - |
| PhpMyAdmin | http://localhost:8081 | root/secret |
| Redis Commander | http://localhost:8082 | - |

## 📊 Comandos Útiles

### Gestión de Contenedores
```bash
# Ver logs
docker-compose logs -f [servicio]

# Entrar a contenedor
docker-compose exec [servicio] bash

# Reiniciar servicio
docker-compose restart [servicio]

# Ver estado
docker-compose ps
```

### Laravel
```bash
# Ejecutar comandos Artisan
docker-compose exec app php artisan [comando]

# Ver rutas
docker-compose exec app php artisan route:list

# Limpiar cachés
docker-compose exec app php artisan optimize:clear

# Ejecutar tests
docker-compose exec app php artisan test
```

### Base de Datos
```bash
# Acceder a MySQL
docker-compose exec db mysql -u root -p

# Hacer backup
docker-compose exec db mysqldump -u root -p sistema_visitas > backup.sql

# Restaurar backup
docker-compose exec -T db mysql -u root -p sistema_visitas < backup.sql
```

## 🔒 Seguridad

### Desarrollo
- Mailhog para pruebas de email
- XDebug deshabilitado por defecto
- Logs detallados habilitados

### Producción
- Variables de entorno en `.env`
- SSL/TLS configurado
- Rate limiting activado
- Headers de seguridad
- Comandos Redis restringidos

## 🚀 Optimizaciones

### PHP
- OPcache habilitado
- PHP-FPM optimizado
- Autoload optimizado
- Compresión GZIP

### MySQL
- Buffer pool ajustado
- Query cache configurado
- Índices optimizados
- Logs de queries lentas

### Redis
- Política LRU
- Compresión habilitada
- Eventos de keyspace
- Memoria limitada

### Nginx
- Compresión GZIP
- Caché de archivos estáticos
- Rate limiting
- Headers de seguridad

## 🐛 Solución de Problemas

### Puerto ya en uso
```bash
# Verificar puertos en uso
lsof -i :8080

# Cambiar puertos en docker-compose.yml
```

### Contenedor no inicia
```bash
# Ver logs
docker-compose logs [servicio]

# Verificar recursos
docker system df
```

### Permisos de archivos
```bash
# Fix permisos en Linux/Mac
sudo chown -R $USER:$USER ./backend/storage
sudo chown -R $USER:$USER ./backend/bootstrap/cache
```

### MySQL no responde
```bash
# Reiniciar MySQL
docker-compose restart db

# Verificar salud
docker-compose exec db mysqladmin ping
```

## 📈 Monitoreo

### Logs Centralizados
```bash
# Ver todos los logs
docker-compose logs -f

# Logs específicos
docker-compose logs -f app nginx db
```

### Métricas
```bash
# Uso de recursos
docker stats

# Espacio en disco
docker system df
```

## 🔄 Despliegue en Producción

1. **Configurar variables de entorno**
2. **Usar docker-compose.prod.yml**
3. **Configurar SSL/TLS**
4. **Configurar backups automáticos**
5. **Monitorear logs y métricas**

```bash
# Producción
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Soporte

Para problemas o preguntas:
1. Verificar logs: `docker-compose logs`
2. Revisar healthchecks
3. Consultar documentación
4. Reportar issues en el repositorio