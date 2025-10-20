FROM nginx:alpine

# Copiar el script de entrada personalizado
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copiar configuraciones
COPY nginx.conf /etc/nginx/nginx.conf
COPY http.d/ /etc/nginx/http.d/
COPY conf.d/ /etc/nginx/conf.d/
COPY ssl/ /etc/nginx/ssl/

# Usar el script de entrada personalizado
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]