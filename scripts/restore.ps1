# Restore the shelter_seek database from a dump
# Usage: .\scripts\restore.ps1 <dump_file>

$input = $args[0]
if (-not $input) {
  Write-Host "Usage: .\scripts\restore.ps1 <dump_file>"
  exit 1
}

Write-Host "Restoring database from $input ..."
Get-Content $input | docker compose exec -T db psql -U postgres -d shelter_seek
Write-Host "Done"
