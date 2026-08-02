#!/usr/bin/env bash
set -euo pipefail

DRY_RUN=0
SKIP_BUILD=0
SKIP_GIT_CHECKS=0
TAG="latest"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --dry-run) DRY_RUN=1; shift ;;
        --skip-build) SKIP_BUILD=1; shift ;;
        --skip-git-checks) SKIP_GIT_CHECKS=1; shift ;;
        --tag) TAG="$2"; shift 2 ;;
        *) echo "Unknown option: $1" >&2; exit 1 ;;
    esac
done

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
app_dir="$repo_root/application"
is_ci="${CI:-false}"

command_exists() { command -v "$1" >/dev/null 2>&1; }

if ! command_exists pnpm; then
    echo "pnpm is required. Run scripts/bootstrap first." >&2
    exit 1
fi

if [[ "$is_ci" != "true" ]]; then
    if ! whoami_out="$(npm whoami 2>/dev/null)"; then
        echo "Not logged in to npm. Run 'npm login' first." >&2
        exit 1
    fi
    echo "Publishing as npm user: $whoami_out"

    if [[ "$DRY_RUN" -eq 0 ]]; then
        read -r -p "Publish application/packages/* to npm with tag '$TAG'? Type 'yes' to continue: " confirm
        if [[ "$confirm" != "yes" ]]; then
            echo "Aborted."
            exit 0
        fi
    fi
else
    if [[ -z "${NODE_AUTH_TOKEN:-}" ]]; then
        echo "NODE_AUTH_TOKEN is not set. Configure the NPM_TOKEN secret and wire it via actions/setup-node's registry-url." >&2
        exit 1
    fi
    echo "Running in CI: publishing non-interactively."
fi

cd "$app_dir"

echo "Installing dependencies..."
if [[ "$is_ci" == "true" ]]; then
    pnpm install --frozen-lockfile
else
    pnpm install
fi

if [[ "$SKIP_BUILD" -eq 0 ]]; then
    echo "Building all packages..."
    pnpm run build
fi

publish_args=(-r --filter "./packages/**" publish --access public --tag "$TAG" --no-bail)
if [[ "$SKIP_GIT_CHECKS" -eq 1 || "$is_ci" == "true" ]]; then
    publish_args+=(--no-git-checks)
fi
if [[ "$DRY_RUN" -eq 1 ]]; then
    publish_args+=(--dry-run)
fi

echo "Running: pnpm ${publish_args[*]}"
pnpm "${publish_args[@]}"

echo "Publish complete."
