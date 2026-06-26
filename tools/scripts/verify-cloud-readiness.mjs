import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXIT_OK = 0;
const EXIT_FAIL = 1;
const SCRIPT_PATH = realpathSync(fileURLToPath(import.meta.url));
const SCRIPT_DIR = dirname(SCRIPT_PATH);
const REPO_ROOT = resolve(SCRIPT_DIR, '..', '..');
const PACKAGES_DIR = join(REPO_ROOT, 'packages');

function printHelp() {
  process.stdout.write(
    `Verify n8n cloud readiness for one or more workspace packages.\n\nUsage:\n  node tools/scripts/verify-cloud-readiness.mjs <workspace-package> [--retries N] [--delay-ms N]\n  node tools/scripts/verify-cloud-readiness.mjs --all [--retries N] [--delay-ms N]\n\nOptions:\n  --all         Verify every package in ./packages\n  --retries N   Number of scan attempts per package (default: 5)\n  --delay-ms N  Delay between retry attempts in milliseconds (default: 15000)\n  --help, -h    Show this help message\n`,
  );
}

function parseArgs(argv) {
  const args = {
    packageName: null,
    all: false,
    retries: 5,
    delayMs: 15000,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      args.help = true;
      continue;
    }

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

  if (args.help) {
    return args;
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
  return readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => {
      try {
        const packageJsonPath = join(PACKAGES_DIR, name, 'package.json');
        readFileSync(packageJsonPath, 'utf8');
        return true;
      } catch {
        return false;
      }
    })
    .sort((a, b) => a.localeCompare(b));
}

function getPublishedPackageName(workspacePackage) {
  const packageJsonPath = join(PACKAGES_DIR, workspacePackage, 'package.json');
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
  const passed = result.status === 0;

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

  if (args.help) {
    printHelp();
    process.exit(EXIT_OK);
  }

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
const invokedPath = process.argv[1]
  ? realpathSync(resolve(process.argv[1]))
  : null;

invokedPath === SCRIPT_PATH &&
  main().catch((error) => {
    printHelp();
    console.log('\n\n');
    console.error(error);
  });
