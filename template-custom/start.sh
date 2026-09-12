#!/usr/bin/env bash
set -euo pipefail
PORT=5000
echo "========================================================"
echo "  VertiGIS Studio Workflow SDK Development Server"
echo "========================================================"
PID=$(lsof -ti :$PORT 2>/dev/null || true)
if [ -n "$PID" ]; then
    echo "Killing stale process on port $PORT (PID $PID)..."
    kill -9 $PID 2>/dev/null || true
fi
if [ -f "./certs/generate-cert.sh" ]; then
    bash ./certs/generate-cert.sh
fi
echo "Starting development server (npm start)..."
npm start
