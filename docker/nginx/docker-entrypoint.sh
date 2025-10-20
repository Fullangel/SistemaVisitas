#!/bin/sh
# Script de entrada personalizado para Nginx

# Agregar las zonas de rate limiting al archivo nginx.conf
if ! grep -q "limit_req_zone.*zone=api:" /etc/nginx/nginx.conf; then
    # Crear una copia temporal del archivo nginx.conf
    cp /etc/nginx/nginx.conf /tmp/nginx.conf.tmp
    
    # Agregar las directivas de rate limiting antes de la última línea 'include'
    sed -i '/include \/etc\/nginx\/conf\.d\/\*\.conf;/i\
    # Rate limiting zones\
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;\
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;\
    limit_req_zone $binary_remote_addr zone=general:10m rate=1r/s;' /tmp/nginx.conf.tmp
    
    # Reemplazar el archivo original
    cp /tmp/nginx.conf.tmp /etc/nginx/nginx.conf
fi

# Ejecutar nginx directamente
exec nginx -g "daemon off;"