#!/bin/bash
docker exec joypo-db sh -c 'mysql -uroot -p"\" -N -e "SHOW DATABASES;"'
docker exec joypo-cms printenv 2>/dev/null | grep -i JOYPO_DB || true
docker exec joypo-db printenv 2>/dev/null | grep -i MYSQL | head