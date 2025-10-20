FROM php:8.2-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libpq-dev \
    supervisor \
    cron \
    nginx \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensiones PHP
RUN docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd zip opcache

# Instalar Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Instalar PCOV para coverage de tests
RUN pecl install pcov && docker-php-ext-enable pcov

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Crear usuario para la aplicación
RUN groupadd -g 1000 www && useradd -u 1000 -ms /bin/bash -g www www

# Configurar PHP-FPM
RUN sed -i 's/user = www-data/user = www/g' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/group = www-data/group = www/g' /usr/local/etc/php-fpm.d/www.conf

# Establecer directorio de trabajo
WORKDIR /var/www

# Copiar configuraciones
COPY ./docker/php/local.ini /usr/local/etc/php/conf.d/local.ini
COPY ./docker/php/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf
COPY ./docker/php/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copiar script de entrada
COPY ./docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Cambiar propietario del directorio
RUN chown -R www:www /var/www

# Exponer puerto
EXPOSE 9000

USER www

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]