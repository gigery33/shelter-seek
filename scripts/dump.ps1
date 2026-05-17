# Dump the shelter_seek database
# Usage: .\scripts\dump.ps1 [output_file]

$output = if ($args[0]) { $args[0] } else { "db/seeds/dump_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql" }

Write-Host "Dumping database to $output ..."
docker compose exec -T db pg_dump -U postgres shelter_seek > $output
Write-Host "Done: $output"
