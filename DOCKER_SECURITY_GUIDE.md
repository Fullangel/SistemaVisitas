# Guía de Configuración Segura con Docker

## 📋 Resumen

Esta guía proporciona instrucciones para configurar y ejecutar el Sistema de Visitas con Docker de forma segura, evitando conflictos de puertos y mejorando la seguridad general del sistema.

## 🔒 Características de Seguridad Implementadas

### 1. **Puertos Alternativos**
- **MySQL**: Puerto 3307 (en lugar del estándar 3306)
- **Redis**: Puerto 6380 (en lugar del estándar 6379)
- **Nginx**: Puerto 8080 (en lugar del estándar 80)
- **Mailhog HTTP**: Puerto 8026 (en lugar del estándar 8025)
- **Mailhog SMTP**: Puerto 1026 (en lugar del estándar 1025)

### 2. **Contraseñas Seguras**
- Generación automática de contraseñas seguras
- No se utilizan contraseñas por defecto
- Claves JWT únicas generadas automáticamente

### 3. **Red Aislada**
- Red Docker dedicada con subnet personalizada
- Aislamiento de servicios
- Control de comunicación entre contenedores

### 4. **Detección Automática de Conflictos**
- Verificación de disponibilidad de puertos
- Búsqueda automática de puertos alternativos
- Configuración dinámica sin intervención manual

## 🚀 Inicio Rápido

### Opción 1: Configuración Segura Automática (Recomendado)
```bash
# Iniciar con configuración segura y detección automática de puertos
./docker-start-secure.sh
```

### Opción 2: Usar el Script de Utilidades
```bash
# Ver todos los comandos disponibles
./docker-utils.sh help

# Iniciar servicios
./docker-utils.sh start

# Ver estado
./docker-utils.sh status

# Ver logs
./docker-utils.sh logs
```

### Opción 3: Docker Compose Directo
```bash
# Usar archivo de configuración segura
cp .env.secure .env
docker-compose -f docker-compose.secure.yml up -d
```

## 📁 Estructura de Archivos de Seguridad

```
/home/fullangel/Dpass/sistema-visitas-nacional/
├── docker-start-secure.sh      # Script de inicio con seguridad
├── docker-utils.sh             # Utilidades de gestión
├── .env.secure                 # Configuración segura de ejemplo
├── docker-compose.secure.yml   # Configuración de Docker Compose segura
├── DOCKER_SECURITY_GUIDE.md    # Esta guía
└── backups/                    # Respaldos de base de datos
```

## 🔧 Configuración de Puertos

### Verificación de Puertos en Uso
```bash
# Ver todos los puertos en uso
./docker-utils.sh ports

# Verificar puerto específico
sudo lsof -i :3306
sudo netstat -tulpn | grep 3306
```

### Modificación Manual de Puertos

Si necesitas cambiar los puertos manualmente:

1. **Editar archivo .env.secure:**
```bash
# Modificar puertos en .env.secure
NGINX_PORT=8081          # Cambiar a puerto alternativo
MYSQL_PORT=3308          # Cambiar a puerto alternativo
REDIS_PORT=6381          # Cambiar a puerto alternativo
```

2. **Reiniciar servicios:**
```bash
./docker-utils.sh restart
```

## 🛡️ Seguridad de Base de Datos

### Credenciales por Defecto (Cambiar en Producción)
- **Base de datos**: `sistema_visitas`
- **Usuario**: `visitas_user`
- **Contraseña**: Generada automáticamente
- **Root**: Generado automáticamente

### Crear Respaldo
```bash
# Crear respaldo de base de datos
./docker-utils.sh backup

# Los respaldos se guardan en: backups/db_backup_YYYYMMDD_HHMMSS.sql
```

### Restaurar Respaldo
```bash
# Restaurar desde archivo de respaldo
./docker-utils.sh restore backups/db_backup_20240101_120000.sql
```

## 🔍 Monitoreo y Diagnóstico

### Ver Logs de Servicios
```bash
# Ver todos los logs
./docker-utils.sh logs

# Ver logs de servicio específico
./docker-utils.sh logs app
./docker-utils.sh logs db
./docker-utils.sh logs redis

# Seguir logs en tiempo real
./docker-utils.sh logs app -f
```

### Verificar Estado de Servicios
```bash
# Ver estado de todos los servicios
./docker-utils.sh status

# Verificar salud de contenedores
docker-compose -f docker-compose.secure.yml ps
```

### Acceder a Shell de Contenedores
```bash
# Acceder a shell del backend
./docker-utils.sh shell app

# Acceder a shell de base de datos
./docker-utils.sh shell db

# Acceder a shell de Redis
./docker-utils.sh shell redis
```

## 🧪 Pruebas y Validación

### Ejecutar Pruebas
```bash
# Ejecutar todas las pruebas
./docker-utils.sh test

# Ejecutar pruebas específicas
docker-compose -f docker-compose.secure.yml exec app php artisan test
```

### Verificar Seguridad
```bash
# Verificar configuración de seguridad
./docker-utils.sh security

# Verificar contraseñas y puertos
./docker-utils.sh ports
```

## 🧹 Mantenimiento

### Limpieza Básica
```bash
# Detener y eliminar contenedores
./docker-utils.sh clean
```

### Limpieza Completa (Incluye Imágenes y Volúmenes)
```bash
# ⚠️  ADVERTENCIA: Esto eliminará TODOS los datos
./docker-utils.sh clean --all
```

### Actualización de Imágenes
```bash
# Reconstruir imágenes con últimas versiones
docker-compose -f docker-compose.secure.yml build --no-cache
docker-compose -f docker-compose.secure.yml up -d
```

## 🚨 Solución de Problemas

### Puerto en Uso
```bash
# Error: "bind: address already in use"
# Solución: El script detectará automáticamente y usará puertos alternativos
```

### Contenedor No Inicia
```bash
# Ver logs del contenedor problemático
./docker-utils.sh logs [nombre-servicio]

# Ejemplos comunes:
./docker-utils.sh logs app    # Backend
./docker-utils.sh logs db     # Base de datos
./docker-utils.sh logs redis  # Redis
```

### Problemas de Conexión a Base de Datos
```bash
# Verificar que MySQL esté listo
./docker-utils.sh logs db

# Verificar credenciales en .env
./docker-utils.sh security

# Reiniciar solo base de datos
docker-compose -f docker-compose.secure.yml restart db
```

### Problemas con Redis
```bash
# Verificar conexión Redis
./docker-utils.sh shell redis
redis-cli ping

# Ver logs de Redis
./docker-utils.sh logs redis
```

## 📊 Rendimiento y Optimización

### Monitoreo de Recursos
```bash
# Ver uso de recursos
docker stats

# Ver uso de disco
docker system df
```

### Optimización de Base de Datos
```bash
# Optimizar tablas
./docker-utils.sh shell db
mysql -u root -p -e "OPTIMIZE TABLE;"
```

### Caché de Laravel
```bash
# Limpiar caché de Laravel
./docker-utils.sh shell app
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

## 🔐 Mejores Prácticas de Seguridad

### 1. **Cambiar Contraseñas por Defecto**
```bash
# Las contraseñas se generan automáticamente, pero verificar:
./docker-utils.sh security
```

### 2. **No Exponer Puertos Sensibles**
- MySQL y Redis solo deben ser accesibles desde la red Docker interna
- No exponer puertos de base de datos a Internet

### 3. **Usar SSL/TLS en Producción**
- Configurar certificados SSL para comunicaciones externas
- Usar reverse proxy con SSL termination

### 4. **Actualizaciones Regulares**
```bash
# Actualizar imágenes base regularmente
docker-compose -f docker-compose.secure.yml pull
docker-compose -f docker-compose.secure.yml up -d
```

### 5. **Monitoreo de Seguridad**
```bash
# Revisar logs de seguridad regularmente
./docker-utils.sh logs | grep -i "security\|error\|warning"
```

## 📞 Soporte y Contacto

### Recursos Adicionales
- [Documentación de Docker](https://docs.docker.com/)
- [Mejores Prácticas de Seguridad Docker](https://docs.docker.com/develop/security-best-practices/)
- [Laravel Docker Documentation](https://laravel.com/docs/deployment#docker)

### Comandos de Diagnóstico Rápido
```bash
# Ver todo el sistema
docker system info

# Ver versión
docker --version
docker-compose --version

# Ver redes Docker
docker network ls

# Ver volúmenes
docker volume ls
```

---

**⚠️ Importante**: Esta configuración está diseñada para desarrollo y pruebas. Para producción, implemente medidas adicionales de seguridad como:
- Firewall de red
- SSL/TLS obligatorio
- Monitoreo de intrusiones
- Auditoría de logs
- Backups automáticos
- Actualizaciones automáticas de seguridad