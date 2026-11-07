FROM php:8.3-apache

# 测试机在国内，Debian 官方源经常卡住，构建时改走阿里云镜像。
RUN sed -i 's|http://deb.debian.org|http://mirrors.aliyun.com|g' /etc/apt/sources.list.d/debian.sources \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libsqlite3-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" gd mysqli pdo_mysql pdo_sqlite \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
COPY docker/entrypoint.sh /usr/local/bin/joypo-entrypoint
RUN chmod +x /usr/local/bin/joypo-entrypoint

WORKDIR /var/www/html

ENTRYPOINT ["joypo-entrypoint"]
CMD ["apache2-foreground"]
