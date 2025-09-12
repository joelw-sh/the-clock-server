#!/usr/bin/env bash
cd "$(dirname "$0")/.."
node -e "require('./dist/migrations/run-migrations.js')" 2>/dev/null || node src/migrations/run-migrations.js
BASH
chmod +x server/scripts/run_migrations.sh

# 15) .gitignore
cat > server/.gitignore <<'GIT'
node_modules
dist
.env
GIT

echo "Estructura y archivos creados en /mnt/Disk500GB/SoftwareProjects/the-clock/server"