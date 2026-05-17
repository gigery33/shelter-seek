#!/usr/bin/env bash
# Dump the shelter_seek database
# Usage: ./scripts/dump.sh [output_file]

OUTPUT="${1:-db/seeds/dump_$(date +%Y%m%d_%H%M%S).sql}"

echo "Dumping database to $OUTPUT ..."
docker compose exec -T db pg_dump -U postgres shelter_seek > "$OUTPUT"
echo "Done: $OUTPUT"
