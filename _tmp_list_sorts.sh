#!/bin/bash
cd /home/spjiangl/joypo || exit 1
DB=$(find . -name '*.db' 2>/dev/null | head -1)
echo "DB=$DB"
if [ -n "$DB" ]; then
  sqlite3 "$DB" "SELECT scode,pcode,name,subname,ico FROM ay_content_sort WHERE status=1 ORDER BY pcode,sorting,id;"
else
  echo "no sqlite db"
fi
