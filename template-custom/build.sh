#!/usr/bin/env bash
set -euo pipefail

NAME="${1:-__PROJECT_NAME__}"

npm run build

if [ ! -f "build/main.js" ]; then
    echo "Error: build/main.js not found!"
    exit 1
fi

cp -f "build/main.js" "build/${NAME}.js"
cp -f "build/main.js" "build/${NAME}.js.txt"
echo "Created build/${NAME}.js and build/${NAME}.js.txt"
