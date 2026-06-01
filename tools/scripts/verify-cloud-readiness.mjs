import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXIT_OK = 0;
const EXIT_FAIL = 1;

function parseArgs(argv) {
  const args = {
    packageName: null,
    all: false,
    retries: 5,
    delayMs: 15000,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--all') {
      args.all = true;
      continue;
    }

    if (arg === '--retries') {
      const value = Number(argv[i + 1]);
      if (!Number.isInteger(value) || value < 1) {
        throw new Error('Invalid value for --retries. Expected integer >= 1.');
      }
      args.retries = value;
      i += 1;
      continue;
    }

    if (arg === '--delay-ms') {
      const value = Number(argv[i + 1]);
      if (!Number.isInteger(value) || value < 0) {
        throw new Error('Invalid value for --delay-ms. Expected integer >= 0.');
      }
      args.delayMs = value;
      i += 1;
      continue;
    }

    if (!arg.startsWith('--') && !args.packageName) {
      args.packageName = arg;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!args.all && !args.packageName) {
    throw new Error(
      'Missing package argument. Use: node tools/scripts/verify-cloud-readiness.mjs <workspace-package> [--retries N] [--delay-ms N] or --all',
    );
  }

  if (args.all && args.packageName) {
    throw new Error('Use either a single package or --all, not both.');
  }

  return args;
}

function getWorkspacePackages() {
  const packagesDir = 'packages';

  return readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => {
      try {
        const packageJsonPath = join(packagesDir, name, 'package.json');
        readFileSync(packageJsonPath, 'utf8');
        return true;
      } catch {
        return false;
      }
    })
    .sort((a, b) => a.localeCompare(b));
}

function getPublishedPackageName(workspacePackage) {
  const packageJsonPath = join('packages', workspacePackage, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  if (!packageJson.name) {
    throw new Error(`Missing name in ${packageJsonPath}`);
  }

  return packageJson.name;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runScanner(publishedPackageName) {
  const result = spawnSync(
    'npx',
    ['-y', '@n8n/scan-community-package', publishedPackageName],
    {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  const output = `${result.stdout || ''}${result.stderr || ''}`;
  const passed =
    result.status === 0 && output.includes('has passed all security checks');

  return {
    passed,
    status: result.status,
    output,
  };
}

async function verifyPublishedPackage(workspacePackage, retries, delayMs) {
  const publishedPackageName = getPublishedPackageName(workspacePackage);
  let lastResult = null;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    process.stdout.write(
      `[${workspacePackage}] Scan attempt ${attempt}/${retries} for ${publishedPackageName}\n`,
    );

    const result = runScanner(publishedPackageName);
    lastResult = result;

    if (result.passed) {
      process.stdout.write(`[${workspacePackage}] PASS\n`);
      return {
        workspacePackage,
        publishedPackageName,
        passed: true,
        output: result.output,
      };
    }

    process.stdout.write(
      `[${workspacePackage}] FAIL (exit code: ${result.status ?? 'null'})\n`,
    );

    if (attempt < retries && delayMs > 0) {
      process.stdout.write(
        `[${workspacePackage}] Waiting ${delayMs}ms before retry\n`,
      );
      await sleep(delayMs);
    }
  }

  return {
    workspacePackage,
    publishedPackageName,
    passed: false,
    output: lastResult?.output || 'No scanner output captured.',
  };
}

function printSummary(results) {
  process.stdout.write('\nCloud readiness summary:\n');

  for (const result of results) {
    const status = result.passed ? 'PASS' : 'FAIL';
    process.stdout.write(
      `- ${result.workspacePackage} (${result.publishedPackageName}): ${status}\n`,
    );
  }
}

function printFailureDetails(results) {
  const failures = results.filter((result) => !result.passed);

  if (failures.length === 0) {
    return;
  }

  process.stdout.write('\nFailure details:\n');

  for (const failure of failures) {
    process.stdout.write(
      `\n=== ${failure.workspacePackage} (${failure.publishedPackageName}) ===\n`,
    );
    process.stdout.write(`${failure.output}\n`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const packages = args.all ? getWorkspacePackages() : [args.packageName];

  const results = [];

  for (const workspacePackage of packages) {
    const result = await verifyPublishedPackage(
      workspacePackage,
      args.retries,
      args.delayMs,
    );
    results.push(result);
  }

  printSummary(results);

  const hasFailure = results.some((result) => !result.passed);

  if (hasFailure) {
    printFailureDetails(results);
    process.exit(EXIT_FAIL);
  }

  process.exit(EXIT_OK);
}

process.argv[1] === fileURLToPath(import.meta.url) && main();
