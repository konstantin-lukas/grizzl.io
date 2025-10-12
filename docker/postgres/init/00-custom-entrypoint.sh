#!/bin/bash
set -e

for f in /docker-entrypoint-initdb.d/*.sql.template; do
  if [ -f "$f" ]; then
    echo "Substituting variables in $f"
    sed \
      -e "s|\${DB_PASSWORD}|${DB_PASSWORD}|g" \
      -e "s|\${DB_NAME}|${DB_NAME}|g" \
      -e "s|\${DB_USERNAME}|${DB_USERNAME}|g" \
      "$f" > "${f%.template}"
  fi
done