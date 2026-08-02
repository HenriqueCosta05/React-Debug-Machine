#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
app_dir="$repo_root/application"

command_exists() { command -v "$1" >/dev/null 2>&1; }

if ! command_exists node; then
    read -r -p "Node.js is not installed. Install it now using nvm? The latest LTS version will be used (Y/N) " response
    if [[ "$response" == "Y" || "$response" == "y" ]]; then
        if ! command_exists nvm; then
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
            export NVM_DIR="$HOME/.nvm"
            # shellcheck disable=SC1091
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        fi
        nvm install --lts
        nvm use --lts
    fi
    if ! command_exists node; then
        echo "Node.js is required to continue. Install it and re-run this script." >&2
        exit 1
    fi
fi

if ! command_exists pnpm; then
    read -r -p "pnpm is not installed on this machine. Install it now via npm? (Y/N) " response
    if [[ "$response" == "Y" || "$response" == "y" ]]; then
        npm install -g pnpm
    fi
    if ! command_exists pnpm; then
        echo "pnpm is required to continue. Install it and re-run this script." >&2
        exit 1
    fi
fi

cd "$app_dir"

echo "Installing dependencies..."
pnpm install

echo "Running dev script from the root package.json..."
pnpm run dev
