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

function Bootstrap {
    $repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
    $appDir = Join-Path $repoRoot "application"

    if (-not (Test-CommandExists node)) {
        Write-Host "Node.js is not installed. This script contains an optional installer for Node.js (NVM). Do you want to install Node.js using NVM? The latest LTS version will be used (Y/N)"
        $response = Read-Host
        if ($response -eq "Y") {
            winget install -e --id CoreyButler.NVMforWindows
            nvm install lts
            nvm use lts
        }
        if (-not (Test-CommandExists node)) {
            Write-Error "Node.js is required to continue. Install it and re-run this script."
            exit 1
        }
    }

    if (-not (Test-CommandExists pnpm)) {
        Write-Host "pnpm is not installed on this machine. This script contains an optional installer for pnpm. Do you want to install pnpm? (Y/N)"
        $response = Read-Host
        if ($response -eq "Y") {
            npm install -g pnpm
        }
        if (-not (Test-CommandExists pnpm)) {
            Write-Error "pnpm is required to continue. Install it and re-run this script."
            exit 1
        }
    }

    Set-Location -Path $appDir

    Write-Host "Installing dependencies..."
    Invoke-Native { pnpm install }

    Write-Host "Building packages and linking them into demos..."
    Invoke-Native { node (Join-Path $PSScriptRoot "link-local-packages.mjs") }

    Write-Host "Running dev script from the root package.json..."
    pnpm run dev
}

Bootstrap
