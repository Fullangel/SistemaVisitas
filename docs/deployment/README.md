# Guía de Despliegue

## 📋 Índice

1. [Requisitos del Servidor](#requisitos-del-servidor)
2. [Despliegue con Docker](#despliegue-con-docker)
3. [Despliegue Manual](#despliegue-manual)
4. [Configuración de Producción](#configuración-de-producción)
5. [SSL/HTTPS](#sslhttps)
6. [Monitoreo](#monitoreo)
7. [Backup y Recuperación](#backup-y-recuperación)
8. [Rollback](#rollback)

## 🖥️ Requisitos del Servidor

### Mínimos
- **CPU**: 2 núcleos
- **RAM**: 4GB
- **Disco**: 20GB SSD
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 10+
- **Red**: Puerto 80, 443 abiertos

### Recomendados
- **CPU**: 4 núcleos
- **RAM**: 8GB
- **Disco**: 50GB SSD
- **Red**: Puerto 80, 443, 8080 abiertos

### Software Requerido
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y docker.io docker-compose git curl wget

# CentOS/RHEL
sudo yum install -y docker docker-compose git curl wget
sudo systemctl enable --now docker
```

## 🐳 Despliegue con Docker

### 1. Preparación del Servidor

```bash
# Crear usuario para la aplicación
sudo useradd -m -s /bin/bash visitas
sudo usermod -aG docker visitas
sudo su - visitas

# Crear directorio
cd /opt
sudo mkdir sistema-visitas
sudo chown visitas:visitas sistema-visitas
cd sistema-visitas
```

### 2. Clonar y Configurar

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/sistema-visitas-nacional.git .

# Ejecutar instalador para producción
export ENVIRONMENT=production
export DOMAIN=tu-dominio.com
./scripts/install.sh
```

### 3. Configurar Variables de Producción

Editar `backend/.env`:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

# Seguridad
SECURITY_RATE_LIMIT_LOGIN=3
SECURITY_RATE_LIMIT_API=30
SECURITY_SESSION_LIFETIME=60

# Base de datos segura
DB_PASSWORD=contraseña_segura_aleatoria

# Redis con contraseña
REDIS_PASSWORD=redis_contraseña_segura

# Correo
MAIL_HOST=smtp.tu-servidor.com
MAIL_USERNAME=usuario@tu-dominio.com
MAIL_PASSWORD=contraseña_correo
```

### 4. Configurar Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# FirewallD (CentOS)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 5. Iniciar Servicios

```bash
# Iniciar en modo producción
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Verificar estado
./scripts/status.sh
```

## 🔧 Despliegue Manual

### Backend (Laravel)

```bash
# Instalar dependencias
cd backend
composer install --no-dev --optimize-autoloader

# Optimizar Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Configurar permisos
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Frontend (Vue.js)

```bash
# Instalar dependencias
cd frontend
npm ci --production

# Build para producción
npm run build

# Los archivos estarán en dist/
```

### Nginx Configuración

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com;

    ssl_certificate /etc/ssl/certs/tu-dominio.crt;
    ssl_certificate_key /etc/ssl/private/tu-dominio.key;

    # Frontend
    location / {
        root /opt/sistema-visitas/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Caché estático
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Rate limiting
        limit_req zone=api burst=10 nodelay;
    }

    # WebSocket para notificaciones
    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔒 Configuración de Producción

### Optimización de Rendimiento

```bash
# PHP-FPM optimization
echo "pm.max_children = 50" >> /etc/php/8.3/fpm/pool.d/www.conf
echo "pm.start_servers = 10" >> /etc/php/8.3/fpm/pool.d/www.conf
echo "pm.min_spare_servers = 5" >> /etc/php/8.3/fpm/pool.d/www.conf
echo "pm.max_spare_servers = 20" >> /etc/php/8.3/fpm/pool.d/www.conf

# Opcache
phpenmod opcache
systemctl restart php8.3-fpm
```

### Seguridad Adicional

```bash
# Fail2ban
sudo apt install fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Configurar para Nginx
sudo tee /etc/fail2ban/jail.d/nginx.local << EOF
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600
EOF

sudo systemctl restart fail2ban
```

### Variables de Entorno de Producción

```env
# Seguridad
APP_KEY=base64:generar_con_php_artisan_key_generate
JWT_SECRET=generar_con_php_artisan_jwt_secret

# Base de datos (usar conexión local o privada)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sistema_visitas_prod
DB_USERNAME=visitas_user
DB_PASSWORD=contraseña_super_segura

# Redis (con contraseña)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=redis_contraseña_segura
REDIS_PORT=6379

# Correo (SMTP seguro)
MAIL_MAILER=smtp
MAIL_HOST=smtp.tu-servidor.com
MAIL_PORT=587
MAIL_USERNAME=usuario@tu-dominio.com
MAIL_PASSWORD=contraseña_correo
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@tu-dominio.com
MAIL_FROM_NAME="Sistema Nacional de Visitas"

# Seguridad mejorada
SECURITY_RATE_LIMIT_LOGIN=3
SECURITY_RATE_LIMIT_API=30
SECURITY_SESSION_LIFETIME=60
SECURITY_CORS_ORIGIN=https://tu-dominio.com

# Logging
LOG_CHANNEL=daily
LOG_LEVEL=error
```

## 🔐 SSL/HTTPS

### Let's Encrypt (Gratis)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Renovación automática
sudo crontab -e
# Agregar: 0 2 * * * certbot renew --quiet
```

### Certificado Comercial

```bash
# Copiar certificados
sudo cp tu-dominio.crt /etc/ssl/certs/
sudo cp tu-dominio.key /etc/ssl/private/
sudo cp ca-bundle.crt /etc/ssl/certs/

# Asegurar permisos
sudo chmod 600 /etc/ssl/private/tu-dominio.key
sudo chmod 644 /etc/ssl/certs/tu-dominio.crt
```

## 📊 Monitoreo

### Laravel Telescope (Desarrollo)
```bash
# Instalar solo en desarrollo
composer require laravel/telescope --dev
php artisan telescope:install
```

### Monitoreo Básico con Scripts

```bash
# Crear script de monitoreo
sudo tee /usr/local/bin/monitor-visitas.sh << 'EOF'
#!/bin/bash
# Verificar servicios
if ! docker-compose ps | grep -q "Up"; then
    echo "ALERTA: Servicios caídos" | mail -s "Sistema Visitas DOWN" admin@tu-dominio.com
fi

# Verificar espacio en disco
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "ALERTA: Disco al $DISK_USAGE%" | mail -s "Espacio en Disco" admin@tu-dominio.com
fi

# Verificar memoria
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
if [ $MEMORY_USAGE -gt 85 ]; then
    echo "ALERTA: Memoria al $MEMORY_USAGE%" | mail -s "Memoria Alta" admin@tu-dominio.com
fi
EOF

sudo chmod +x /usr/local/bin/monitor-visitas.sh

# Agregar a crontab
echo "*/5 * * * * /usr/local/bin/monitor-visitas.sh" | sudo crontab -
```

### Logs Centralizados

```bash
# Configurar logrotate
sudo tee /etc/logrotate.d/sistema-visitas << 'EOF'
/opt/sistema-visitas/backend/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
    sharedscripts
    postrotate
        docker-compose exec backend php artisan queue:restart
    endscript
}
EOF
```

## 💾 Backup y Recuperación

### Backup Automático

```bash
# Script de backup diario
sudo tee /usr/local/bin/backup-daily.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/visitas"

# Crear directorio
mkdir -p $BACKUP_DIR

# Backup base de datos
docker-compose exec -T db mysqldump -uroot -psecret sistema_visitas | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup archivos
tar -czf $BACKUP_DIR/storage_$DATE.tar.gz -C /opt/sistema-visitas/backend storage

# Backup configuración
cp /opt/sistema-visitas/backend/.env $BACKUP_DIR/env_$DATE.bak
cp /opt/sistema-visitas/frontend/.env $BACKUP_DIR/frontend_env_$DATE.bak

# Eliminar backups antiguos (mantener 30 días)
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.bak" -mtime +30 -delete

# Enviar notificación
echo "Backup completado: $DATE" | mail -s "Backup Sistema Visitas" admin@tu-dominio.com
EOF

sudo chmod +x /usr/local/bin/backup-daily.sh

# Agregar a crontab (2 AM diario)
echo "0 2 * * * /usr/local/bin/backup-daily.sh" | sudo crontab -
```

### Verificación de Backups

```bash
# Script de verificación
sudo tee /usr/local/bin/verify-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups/visitas"
LATEST_BACKUP=$(ls -t $BACKUP_DIR/db_*.sql.gz | head -1)

# Verificar integridad
gunzip -t $LATEST_BACKUP
if [ $? -eq 0 ]; then
    echo "Backup OK: $LATEST_BACKUP"
else
    echo "ERROR: Backup corrupto $LATEST_BACKUP" | mail -s "BACKUP CORRUPTO" admin@tu-dominio.com
fi
EOF

sudo chmod +x /usr/local/bin/verify-backup.sh
```

## 🔄 Rollback

### Rollback de Código

```bash
# Rollback a versión anterior
cd /opt/sistema-visitas
git log --oneline -10  # Ver últimos commits
git reset --hard COMMIT_HASH_ANTERIOR

# Reiniciar servicios
docker-compose down
docker-compose up -d
```

### Rollback de Base de Datos

```bash
# Encontrar backup más reciente
BACKUP_DIR="/opt/backups/visitas"
LATEST_DB=$(ls -t $BACKUP_DIR/db_*.sql.gz | head -1)

# Restaurar
gunzip < $LATEST_DB | docker-compose exec -T db mysql -uroot -psecret sistema_visitas

# Verificar integridad
docker-compose exec backend php artisan migrate:status
```

### Rollback Completo

```bash
# Usar el script de restauración
./scripts/restore.sh backup_visitas_20240115_120000_database.sql
```

## 🚨 Procedimientos de Emergencia

### Servidor No Responde

```bash
# 1. Verificar servicios
./scripts/status.sh

# 2. Reiniciar Docker
sudo systemctl restart docker

# 3. Reiniciar contenedores
docker-compose restart

# 4. Verificar logs
./scripts/logs.sh all
```

### Base de Datos Corrupta

```bash
# 1. Detener aplicación
docker-compose stop backend frontend

# 2. Restaurar desde backup
LATEST_BACKUP=$(ls -t /opt/backups/visitas/db_*.sql.gz | head -1)
gunzip < $LATEST_BACKUP | docker-compose exec -T db mysql -uroot -psecret sistema_visitas

# 3. Reiniciar servicios
docker-compose start
```

### Pérdida Total

```bash
# 1. Reinstalar desde cero
./scripts/install.sh

# 2. Restaurar configuración
cp /opt/backups/visitas/env_*.bak backend/.env

# 3. Restaurar base de datos
./scripts/restore.sh backup_visitas_ultimo_database.sql

# 4. Restaurar archivos
tar -xzf /opt/backups/visitas/storage_ultimo.tar.gz -C backend
```

## 📞 Soporte Post-Despliegue

### Contactos de Emergencia
- **Administrador Sistema**: admin@tu-dominio.com
- **Proveedor Hosting**: soporte@proveedor.com
- **Equipo Desarrollo**: dev@tu-empresa.com

### Documentación en Línea
- [Estado del Sistema](https://tu-dominio.com/status)
- [Documentación API](https://tu-dominio.com/api/documentation)
- [Logs de Aplicación](https://tu-dominio.com/admin/logs)

---

**⚠️ IMPORTANTE**: Realizar pruebas en ambiente de staging antes de producción