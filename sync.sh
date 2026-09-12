#!/usr/bin/env bash
# ==============================================================================
# VertiGIS Studio Workflow SDK Upstream Synchronization Script
# Synchronizes with the official VertiGIS upstream repository (upstream/main),
# protecting enterprise template overlays and custom scripts from conflicts,
# and pushes updates to GitHub (origin/main).
# ==============================================================================

set -euo pipefail

# ANSI Color Codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BRANCH="main"
PROTECTED_PATHS=("template-custom" "scripts/create.js" "README.md" "sync.sh")

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

main() {
    echo ""
    echo "========================================================================"
    log_info "Synchronizing 02-Vertigis-Workflow-SDK with upstream (Branch: ${BRANCH})"
    echo "========================================================================"

    cd "$REPO_DIR"

    # 1. Stash uncommitted changes if any
    local has_stash=0
    if [ -n "$(git status --porcelain)" ]; then
        log_warn "Working tree has uncommitted changes. Stashing before sync..."
        git stash push -m "Auto-stashed by sync.sh on $(date +'%Y-%m-%d %H:%M:%S')"
        has_stash=1
    fi

    # 2. Ensure on main branch
    local current_branch
    current_branch="$(git rev-parse --abbrev-ref HEAD)"
    if [ "$current_branch" != "$BRANCH" ]; then
        log_info "Switching branch from ${current_branch} to ${BRANCH}..."
        git checkout "$BRANCH"
    fi

    # 3. Ensure upstream remote exists
    if ! git remote get-url upstream >/dev/null 2>&1; then
        log_info "Adding upstream remote (https://github.com/vertigis/vertigis-workflow-sdk.git)..."
        git remote add upstream https://github.com/vertigis/vertigis-workflow-sdk.git
    fi

    # 4. Fetch upstream
    log_info "Fetching latest commits from upstream..."
    git fetch upstream

    # 5. Merge upstream/main
    log_info "Merging upstream/${BRANCH} into ${BRANCH}..."
    if git merge "upstream/${BRANCH}" --no-edit -m "chore: merge upstream/${BRANCH} while preserving enterprise overlays"; then
        log_success "Merge completed cleanly without conflicts."
    else
        log_warn "Merge encountered conflicts. Preserving enterprise files..."
        for p in "${PROTECTED_PATHS[@]}"; do
            if [ -e "$p" ] || git ls-files -u "$p" | grep -q "$p"; then
                git checkout --ours "$p" 2>/dev/null || true
                git add "$p" 2>/dev/null || true
                log_info "Preserved local enterprise version for: $p"
            fi
        done

        # Check for remaining unresolved conflicts
        local remaining_conflicts
        remaining_conflicts="$(git diff --name-only --diff-filter=U || true)"
        if [ -n "$remaining_conflicts" ]; then
            log_error "Unresolved conflicts remain in non-enterprise files:"
            echo "$remaining_conflicts"
            log_error "Aborting sync. Please resolve remaining conflicts manually."
            return 1
        fi

        git commit -m "chore: resolve merge conflicts preserving enterprise overlays"
        log_success "Merge conflicts resolved successfully using enterprise overlay versions."
    fi

    # 6. Push to origin
    log_info "Pushing ${BRANCH} to origin (GitHub)..."
    git push origin "$BRANCH"
    log_success "Pushed ${BRANCH} to origin successfully."

    # 7. Restore stash if created
    if [ "$has_stash" -eq 1 ]; then
        log_info "Restoring stashed changes..."
        git stash pop || log_warn "Stash pop had minor conflicts; check git stash list."
    fi

    echo ""
    echo "========================================================================"
    log_success "02-Vertigis-Workflow-SDK successfully synchronized with upstream!"
    echo "========================================================================"
}

main "$@"
