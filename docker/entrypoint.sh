#!/bin/sh
set -e

mkdir -p \
  /var/www/html/runtime/cache \
  /var/www/html/runtime/complile \
  /var/www/html/runtime/config \
  /var/www/html/runtime/session \
  /var/www/html/static/upload

# 模板编译、上传目录需要 Apache 进程可写
chmod -R a+rwX \
  /var/www/html/runtime \
  /var/www/html/data \
  /var/www/html/static/upload || true

if [ "${JOYPO_DB_TYPE}" = "mysqli" ]; then
  php /var/www/html/docker/migrate.php
fi

exec docker-php-entrypoint "$@"
