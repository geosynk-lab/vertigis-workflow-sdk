#!/usr/bin/env bash
set -euo pipefail

# Usage: ./start.sh            normal dev server
#        ./start.sh remote     pull first, then re-check the remote every 5s while the server runs
#        ./start.sh remote <branch> [seconds]
REMOTE_MODE=""
if [ "${1:-}" = "remote" ]; then
    REMOTE_MODE=1
    SYNC_BRANCH="${2:-$(git rev-parse --abbrev-ref HEAD)}"
    SYNC_INTERVAL="${3:-5}"
fi

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

if [ -n "$REMOTE_MODE" ]; then
    echo "Remote mode: syncing with origin/$SYNC_BRANCH every ${SYNC_INTERVAL}s..."
    bash ./scripts/remote-sync.sh "$SYNC_BRANCH" "$SYNC_INTERVAL" --once
    bash ./scripts/remote-sync.sh "$SYNC_BRANCH" "$SYNC_INTERVAL" &
    SYNC_PID=$!
    trap 'kill $SYNC_PID 2>/dev/null || true' EXIT INT TERM
fi

echo "Starting development server (npm start)..."
npm start
