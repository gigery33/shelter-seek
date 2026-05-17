#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma db push --accept-data-loss

echo "Running seed..."
node dist/seed.js

echo "Starting server..."
exec node dist/index.js
