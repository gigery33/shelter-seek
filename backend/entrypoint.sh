#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma db push --skip-generate

echo "Running seed..."
node dist/seed.js

echo "Starting server..."
exec node dist/index.js
