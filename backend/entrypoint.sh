#!/bin/sh
set -e

echo "Running database migrations..."
# First, ensure the database schema matches the Prisma schema
npx prisma db push --accept-data-loss 2>/dev/null || true

# Check if the _prisma_migrations table has migrations recorded
if npx prisma migrate deploy 2>/dev/null; then
  echo "Migrations applied successfully."
else
  # If migrate deploy fails, it might be because migrations were partially applied.
  # Try to baseline any unapplied migrations.
  echo "Attempting to baseline unapplied migrations..."
  for m in $(ls prisma/migrations/ 2>/dev/null); do
    npx prisma migrate resolve --applied "$m" 2>/dev/null || true
  done
  echo "Retrying migrate deploy..."
  npx prisma migrate deploy
fi

echo "Running seed..."
node dist/seed.js

echo "Starting server..."
exec node dist/index.js
