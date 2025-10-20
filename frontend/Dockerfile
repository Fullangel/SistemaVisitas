# Etapa de construcción
FROM node:18-alpine as builder

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./

# Instalar dependencias
RUN npm ci --only=production --legacy-peer-deps

# Copiar código fuente
COPY . .

# Argumentos de construcción
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Instalar nginx y configurar
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]