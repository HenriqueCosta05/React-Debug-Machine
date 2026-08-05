#!/usr/bin/env bash
set -euo pipefail

DRY_RUN=0
SKIP_BUILD=0
SKIP_GIT_CHECKS=0
SKIP_VERSION_BUMP=0
TAG="latest"
BUMP=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --dry-run)           DRY_RUN=1; shift ;;
        --skip-build)        SKIP_BUILD=1; shift ;;
        --skip-git-checks)   SKIP_GIT_CHECKS=1; shift ;;
        --skip-version-bump) SKIP_VERSION_BUMP=1; shift ;;
        --tag)  TAG="$2";  shift 2 ;;
        --bump) BUMP="$2"; shift 2 ;;
        *) echo "Unknown option: $1" >&2; exit 1 ;;
    esac
done

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
app_dir="$repo_root/application"
is_ci="${CI:-false}"

command_exists() { command -v "$1" >/dev/null 2>&1; }

# Returns minor|major|patch based on branch naming convention.
detect_bump_type() {
    local branch="$1"
    if [[ "$branch" =~ ^feature([/\-]|$) ]]; then
        echo "minor"
    elif [[ "$branch" =~ ^(release([/\-]|$)|dev$|main$|master$|stg$|staging$) ]]; then
        echo "major"
    else
        echo "patch"
    fi
}

# Bumps the version field in-place for a single package.json.
bump_package_json() {
    local pkg_json="$1" bump_type="$2"
    BUMP_TYPE="$bump_type" node -e "
const fs = require('fs');
const path = process.argv[1];
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
const [major, minor, patch] = pkg.version.split('.').map(Number);
const bt = process.env.BUMP_TYPE;
if (bt === 'major')      pkg.version = \`\${major + 1}.0.0\`;
else if (bt === 'minor') pkg.version = \`\${major}.\${minor + 1}.0\`;
else                     pkg.version = \`\${major}.\${minor}.\${patch + 1}\`;
process.stdout.write('  ' + pkg.name + '@' + pkg.version + '\n');
fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
" "$pkg_json"
}

if ! command_exists pnpm; then
    echo "pnpm is required. Run scripts/bootstrap first." >&2
    exit 1
fi

# ── Determine current branch ─────────────────────────────────────────────────
if [[ -z "$BUMP" ]]; then
    if [[ "$is_ci" == "true" ]]; then
        CURRENT_BRANCH="${GITHUB_REF_NAME:-}"
    else
        CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")"
    fi

    if [[ -z "$CURRENT_BRANCH" ]]; then
        echo "Could not detect branch; defaulting to patch bump." >&2
        BUMP="patch"
    else
        BUMP="$(detect_bump_type "$CURRENT_BRANCH")"
        echo "Branch '$CURRENT_BRANCH' → ${BUMP} bump."
    fi
fi

# ── Auth checks ───────────────────────────────────────────────────────────────
if [[ "$is_ci" != "true" ]]; then
    if ! whoami_out="$(npm whoami 2>/dev/null)"; then
        echo "Not logged in to npm. Run 'npm login' first." >&2
        exit 1
    fi
    echo "Publishing as npm user: $whoami_out"

    if [[ "$DRY_RUN" -eq 0 ]]; then
        read -r -p "Publish application/packages/* to npm with tag '$TAG' (${BUMP} bump)? Type 'yes' to continue: " confirm
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

# ── Version bump ──────────────────────────────────────────────────────────────
if [[ "$SKIP_VERSION_BUMP" -eq 0 ]]; then
    echo "Bumping versions (${BUMP})..."
    bumped_files=()
    while IFS= read -r -d '' pkg_json; do
        bump_package_json "$pkg_json" "$BUMP"
        bumped_files+=("$pkg_json")
    done < <(find "$app_dir/packages" -maxdepth 2 -name "package.json" -print0)

    if [[ "$is_ci" == "true" && "$DRY_RUN" -eq 0 && "${#bumped_files[@]}" -gt 0 ]]; then
        echo "Committing version bump..."
        git -C "$repo_root" config user.name  "github-actions[bot]"
        git -C "$repo_root" config user.email "github-actions[bot]@users.noreply.github.com"
        git -C "$repo_root" add "${bumped_files[@]}"
        git -C "$repo_root" commit -m "chore: bump versions (${BUMP}) [skip ci]" || true
        git -C "$repo_root" push origin HEAD
    fi
fi

# ── Install & build ───────────────────────────────────────────────────────────
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

# ── Publish ───────────────────────────────────────────────────────────────────
publish_args=(-r --filter "./packages/**" publish --access public --tag "$TAG")
if [[ "$SKIP_GIT_CHECKS" -eq 1 || "$is_ci" == "true" ]]; then
    publish_args+=(--no-git-checks)
fi
if [[ "$DRY_RUN" -eq 1 ]]; then
    publish_args+=(--dry-run)
fi

echo "Running: pnpm ${publish_args[*]}"
pnpm "${publish_args[@]}"

echo "Publish complete."
