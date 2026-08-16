FROM php:8.3-cli

# Install system packages and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    zip \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy project
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Create Laravel storage/cache directories
RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 10000

# Run migrations first.
# If migration fails, DO NOT run the seeder.
CMD php artisan migrate --force -vvv && \
    php artisan db:seed --force && \
    php artisan storage:link || true; \
    php artisan serve --host=0.0.0.0 --port=${PORT:-10000}