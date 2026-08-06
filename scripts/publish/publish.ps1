[CmdletBinding()]
param(
    [switch]$DryRun,
    [switch]$SkipBuild,
    [switch]$SkipGitChecks,
    [switch]$SkipVersionBump,
    [string]$Tag  = "latest",
    [ValidateSet("major", "minor", "patch", "")]
    [string]$Bump = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Test-CommandExists {
    param([string]$Name)
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Invoke-Native {
    param([scriptblock]$Command)
    & $Command
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

# Returns major|minor|patch based on branch naming convention.
function Get-BumpType {
    param([string]$Branch)
    if ($Branch -match '^feature([/\-]|$)') { return "minor" }
    if ($Branch -match '^(release([/\-]|$)|dev$|main$|master$|stg$|staging$)') { return "major" }
    return "patch"
}

# Bumps the version field in-place for a single package.json.
function Update-PackageVersion {
    param([string]$PkgJson, [string]$BumpType)
    $env:BUMP_TYPE = $BumpType
    node -e @'
const fs = require('fs');
const path = process.argv[1];
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
const [major, minor, patch] = pkg.version.split('.').map(Number);
const bt = process.env.BUMP_TYPE;
if (bt === 'major')      pkg.version = `${major + 1}.0.0`;
else if (bt === 'minor') pkg.version = `${major}.${minor + 1}.0`;
else                     pkg.version = `${major}.${minor}.${patch + 1}`;
process.stdout.write('  ' + pkg.name + '@' + pkg.version + '\n');
fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
'@ $PkgJson
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

function Publish {
    $repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
    $appDir   = Join-Path $repoRoot "application"
    $isCI     = $env:CI -eq "true"

    if (-not (Test-CommandExists pnpm)) {
        Write-Error "pnpm is required. Run scripts/bootstrap first."
        exit 1
    }

    # ── Determine bump type ───────────────────────────────────────────────────
    $bumpType = $Bump
    if (-not $bumpType) {
        $currentBranch = if ($isCI) { $env:GITHUB_REF_NAME } else {
            try { git rev-parse --abbrev-ref HEAD 2>$null } catch { "" }
        }
        if (-not $currentBranch) {
            Write-Warning "Could not detect branch; defaulting to patch bump."
            $bumpType = "patch"
        } else {
            $bumpType = Get-BumpType -Branch $currentBranch
            Write-Host "Branch '$currentBranch' -> $bumpType bump."
        }
    }

    # ── Auth checks ───────────────────────────────────────────────────────────
    if (-not $isCI) {
        $whoami = (& npm whoami 2>$null)
        if (-not $whoami) {
            Write-Error "Not logged in to npm. Run 'npm login' first."
            exit 1
        }
        Write-Host "Publishing as npm user: $whoami"

        if (-not $DryRun) {
            $confirm = Read-Host "Publish application/packages/* to npm with tag '$Tag' ($bumpType bump)? Type 'yes' to continue"
            if ($confirm -ne "yes") {
                Write-Host "Aborted."
                exit 0
            }
        }
    } else {
        if (-not $env:NODE_AUTH_TOKEN) {
            Write-Error "NODE_AUTH_TOKEN is not set. Configure the NPM_TOKEN secret and wire it via actions/setup-node's registry-url."
            exit 1
        }
        Write-Host "Running in CI: publishing non-interactively."
    }

    # ── Version bump ──────────────────────────────────────────────────────────
    if (-not $SkipVersionBump) {
        Write-Host "Bumping versions ($bumpType)..."
        $pkgJsonFiles = Get-ChildItem -Path (Join-Path $appDir "packages") -Recurse -Depth 1 -Filter "package.json" |
                        Select-Object -ExpandProperty FullName
        foreach ($f in $pkgJsonFiles) {
            Update-PackageVersion -PkgJson $f -BumpType $bumpType
        }

        if ($isCI -and -not $DryRun -and $pkgJsonFiles.Count -gt 0) {
            Write-Host "Committing version bump..."
            git -C $repoRoot config user.name  "github-actions[bot]"
            git -C $repoRoot config user.email "github-actions[bot]@users.noreply.github.com"
            git -C $repoRoot add ($pkgJsonFiles | ForEach-Object { $_ })
            $commitResult = git -C $repoRoot commit -m "chore: bump versions ($bumpType) [skip ci]" 2>&1
            if ($LASTEXITCODE -ne 0) { Write-Warning "Nothing to commit: $commitResult" }
            git -C $repoRoot push origin HEAD
            if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        }
    }

    # ── Install & build ───────────────────────────────────────────────────────
    Set-Location -Path $appDir

    Write-Host "Installing dependencies..."
    if ($isCI) {
        Invoke-Native { pnpm install --frozen-lockfile }
    } else {
        Invoke-Native { pnpm install }
    }

    if (-not $SkipBuild) {
        Write-Host "Building all packages..."
        Invoke-Native { pnpm run build }
    }

    # ── Publish ───────────────────────────────────────────────────────────────
    $publishArgs = @("-r", "--filter", "./packages/**", "publish", "--access", "public", "--tag", $Tag)
    if ($SkipGitChecks -or $isCI) { $publishArgs += "--no-git-checks" }
    if ($DryRun)                  { $publishArgs += "--dry-run" }

    Write-Host "Running: pnpm $($publishArgs -join ' ')"
    & pnpm @publishArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Error "One or more packages failed to publish. Check output above."
        exit $LASTEXITCODE
    }

    Write-Host "Publish complete."
}

Publish
