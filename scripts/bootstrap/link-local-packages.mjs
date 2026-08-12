#!/usr/bin/env node
// Builds every package under application/packages, packs each into a tarball,
// then copies the tarballs into every demo under demos/ and points that demo's
// package.json at the local tarball (file:) instead of the registry version.
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = join(scriptDir, "..", "..");
const packagesDir = join(repoRoot, "application", "packages");
const demosDir = join(repoRoot, "demos");
const tarballDir = join(packagesDir, ".tarballs");
const isWindows = process.platform === "win32";

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: isWindows });
  if (result.status !== 0) {
    console.error(`Command failed: ${command} ${args.join(" ")} (cwd=${cwd})`);
    process.exit(result.status ?? 1);
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, data) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}

function listSubdirsWithPackageJson(dir) {
  return readdirSync(dir).filter((entry) => {
    const entryPath = join(dir, entry);
    return statSync(entryPath).isDirectory() && existsSync(join(entryPath, "package.json"));
  });
}

function tarballName(name, version) {
  const cleanName = name.startsWith("@") ? name.slice(1).replace("/", "-") : name;
  return `${cleanName}-${version}.tgz`;
}

function detectPackageManager(projectDir) {
  if (existsSync(join(projectDir, "bun.lock")) || existsSync(join(projectDir, "bun.lockb"))) return "bun";
  if (existsSync(join(projectDir, "pnpm-lock.yaml"))) return "pnpm";
  return "npm";
}

function buildAndPackPackages() {
  const packages = listSubdirsWithPackageJson(packagesDir).map((dir) => {
    const path = join(packagesDir, dir);
    const pkgJson = readJson(join(path, "package.json"));
    return { path, name: pkgJson.name, version: pkgJson.version };
  });

  console.log(`Building ${packages.length} package(s)...`);
  for (const pkg of packages) {
    console.log(`  build: ${pkg.name}`);
    run("pnpm", ["run", "build"], pkg.path);
  }

  rmSync(tarballDir, { recursive: true, force: true });
  mkdirSync(tarballDir, { recursive: true });

  console.log("Packing tarballs...");
  for (const pkg of packages) {
    run("pnpm", ["pack", "--pack-destination", tarballDir], pkg.path);
    pkg.tarball = tarballName(pkg.name, pkg.version);
    if (!existsSync(join(tarballDir, pkg.tarball))) {
      console.error(`Expected tarball not found after packing: ${pkg.tarball}`);
      process.exit(1);
    }
  }

  return packages;
}

function linkPackagesIntoDemos(packages) {
  const demos = listSubdirsWithPackageJson(demosDir);

  for (const demo of demos) {
    const demoPath = join(demosDir, demo);
    const demoPkgPath = join(demoPath, "package.json");
    const demoPkg = readJson(demoPkgPath);
    const localPackagesDir = join(demoPath, "local-packages");

    rmSync(localPackagesDir, { recursive: true, force: true });
    mkdirSync(localPackagesDir, { recursive: true });

    let changed = false;
    for (const depField of ["dependencies", "devDependencies"]) {
      const deps = demoPkg[depField];
      if (!deps) continue;
      for (const pkg of packages) {
        if (!(pkg.name in deps)) continue;
        copyFileSync(join(tarballDir, pkg.tarball), join(localPackagesDir, pkg.tarball));
        deps[pkg.name] = `file:./local-packages/${pkg.tarball}`;
        changed = true;
      }
    }

    if (!changed) {
      rmSync(localPackagesDir, { recursive: true, force: true });
      continue;
    }

    writeJson(demoPkgPath, demoPkg);
    console.log(`Updated demos/${demo}/package.json to use local tarballs`);

    const packageManager = detectPackageManager(demoPath);
    console.log(`Installing demos/${demo} with ${packageManager}...`);
    run(packageManager, ["install"], demoPath);
  }
}

function main() {
  const packages = buildAndPackPackages();
  linkPackagesIntoDemos(packages);
  console.log("Local packages built, packed, and linked into demos.");
}

main();
