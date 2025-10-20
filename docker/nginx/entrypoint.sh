#!/bin/sh
# Script de entrada personalizado para Nginx que configura rate limiting

# Crear archivo de configuración de rate limiting en el directorio http.d del contenedor
mkdir -p /etc/nginx/http.d
cat > /etc/nginx/http.d/rate-limit.conf << 'EOF'
# Configuración de rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=general:10m rate=1r/s;
EOF

# Modificar el nginx.conf para incluir el directorio http.d antes de conf.d
if ! grep -q "include /etc/nginx/http.d/\*.conf;" /etc/nginx/nginx.conf; then
    sed -i '/include \/etc\/nginx\/conf.d\/\*\.conf;/i\    include /etc/nginx/http.d/*.conf;' /etc/nginx/nginx.conf
fi

# Ejecutar el entrypoint original de nginx
exec /docker-entrypoint.sh "$@"