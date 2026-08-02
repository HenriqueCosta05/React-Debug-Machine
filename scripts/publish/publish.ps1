[CmdletBinding()]
param(
    [switch]$DryRun,
    [switch]$SkipBuild,
    [switch]$SkipGitChecks,
    [string]$Tag = "latest"
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
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}

function Publish {
    $repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
    $appDir = Join-Path $repoRoot "application"
    $isCI = $env:CI -eq "true"

    if (-not (Test-CommandExists pnpm)) {
        Write-Error "pnpm is required. Run scripts/bootstrap first."
        exit 1
    }

    if (-not $isCI) {
        $whoami = (& npm whoami 2>$null)
        if (-not $whoami) {
            Write-Error "Not logged in to npm. Run 'npm login' first."
            exit 1
        }
        Write-Host "Publishing as npm user: $whoami"

        if (-not $DryRun) {
            $confirm = Read-Host "Publish application/packages/* to npm with tag '$Tag'? Type 'yes' to continue"
            if ($confirm -ne "yes") {
                Write-Host "Aborted."
                exit 0
            }
        }
    }
    else {
        if (-not $env:NODE_AUTH_TOKEN) {
            Write-Error "NODE_AUTH_TOKEN is not set. Configure the NPM_TOKEN secret and wire it via actions/setup-node's registry-url."
            exit 1
        }
        Write-Host "Running in CI: publishing non-interactively."
    }

    Set-Location -Path $appDir

    Write-Host "Installing dependencies..."
    if ($isCI) {
        Invoke-Native { pnpm install --frozen-lockfile }
    }
    else {
        Invoke-Native { pnpm install }
    }

    if (-not $SkipBuild) {
        Write-Host "Building all packages..."
        Invoke-Native { pnpm run build }
    }

    $publishArgs = @("-r", "--filter", "./packages/**", "publish", "--access", "public", "--tag", $Tag, "--no-bail")
    if ($SkipGitChecks -or $isCI) {
        $publishArgs += "--no-git-checks"
    }
    if ($DryRun) {
        $publishArgs += "--dry-run"
    }

    Write-Host "Running: pnpm $($publishArgs -join ' ')"
    & pnpm @publishArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Error "One or more packages failed to publish. Check output above (an 'already published version' error is expected and non-fatal when a package's version was not bumped)."
        exit $LASTEXITCODE
    }

    Write-Host "Publish complete."
}

Publish
