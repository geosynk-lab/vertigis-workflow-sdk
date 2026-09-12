#!/usr/bin/env bash
set -euo pipefail
echo "Building production activity pack (npm run build)..."
npm run build
echo "[SUCCESS] Build output located in dist/"
