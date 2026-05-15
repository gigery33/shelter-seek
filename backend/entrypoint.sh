#!/bin/sh

echo "Running database migrations..."
npx prisma db push

echo "Running seed..."
node dist/seed.js

echo "Starting server..."
exec node dist/index.js
