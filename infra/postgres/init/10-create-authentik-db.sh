#!/bin/sh
set -eu

if [ -z "${AUTHENTIK_PG_DB:-}" ] || [ -z "${AUTHENTIK_PG_USER:-}" ] || [ -z "${AUTHENTIK_PG_PASS:-}" ]; then
  echo "AUTHENTIK_PG_* vars are missing; skip Authentik DB bootstrap"
  exit 0
fi

role_exists=$(psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -tAc "SELECT 1 FROM pg_roles WHERE rolname='${AUTHENTIK_PG_USER}'")
if [ "$role_exists" != "1" ]; then
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "CREATE ROLE \"${AUTHENTIK_PG_USER}\" LOGIN PASSWORD '${AUTHENTIK_PG_PASS}';"
fi

db_exists=$(psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -tAc "SELECT 1 FROM pg_database WHERE datname='${AUTHENTIK_PG_DB}'")
if [ "$db_exists" != "1" ]; then
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "CREATE DATABASE \"${AUTHENTIK_PG_DB}\" OWNER \"${AUTHENTIK_PG_USER}\";"
fi
