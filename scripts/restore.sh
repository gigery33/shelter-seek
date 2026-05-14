#!/usr/bin/env bash
# Restore the shelter_seek database from a dump
# Usage: ./scripts/restore.sh <dump_file>

INPUT="$1"
if [ -z "$INPUT" ]; then
  echo "Usage: ./scripts/restore.sh <dump_file>"
  exit 1
fi

echo "Restoring database from $INPUT ..."
docker compose exec -T db psql -U postgres -d shelter_seek < "$INPUT"
echo "Done"
