#!/usr/bin/env bash
# Keeps the local checkout in sync with the remote branch (used by `start.sh remote`).
# Fast-forward only: it never rewrites or overwrites your local work.
# Usage: scripts/remote-sync.sh [branch] [interval-seconds] [--once]
set -uo pipefail

BRANCH="${1:-$(git rev-parse --abbrev-ref HEAD)}"
INTERVAL="${2:-5}"
ONCE="${3:-}"
WARNED=""

sync_once() {
    if ! git fetch --quiet origin "$BRANCH" 2>/dev/null; then
        return 0 # offline or remote busy: try again next round
    fi
    local local_sha remote_sha
    local_sha=$(git rev-parse HEAD)
    remote_sha=$(git rev-parse "origin/$BRANCH")
    if [ "$local_sha" = "$remote_sha" ] || git merge-base --is-ancestor "$remote_sha" HEAD; then
        WARNED=""
        return 0
    fi
    if git merge --ff-only --quiet "origin/$BRANCH" 2>/dev/null; then
        WARNED=""
        echo "[sync] Updated to $(git rev-parse --short HEAD): $(git log -1 --format=%s)"
        if ! git diff --quiet "$local_sha" HEAD -- package.json pnpm-lock.yaml package-lock.json 2>/dev/null; then
            echo "[sync] Dependencies changed. Stop the server and run npm install."
        fi
    elif [ "$WARNED" != "$remote_sha" ]; then
        WARNED="$remote_sha"
        echo "[sync] Cannot fast-forward (local commits or uncommitted changes in the way). Commit/push or stash, then it will retry."
    fi
}

if [ "$ONCE" = "--once" ]; then
    sync_once
    exit 0
fi
while true; do
    sync_once
    sleep "$INTERVAL"
done
