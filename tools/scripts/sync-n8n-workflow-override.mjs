import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXIT_OK = 0;
const EXIT_FAIL = 1;
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '..', '..');
const WORKSPACE_FILE = join(REPO_ROOT, 'pnpm-workspace.yaml');

function printHelp() {
  process.stdout.write(
    `Sync the n8n-workflow override in pnpm-workspace.yaml with the version n8n itself depends on.
 Usage:
   node tools/scripts/sync-n8n-workflow-override.mjs [--check]
 Options:
   --check      Fail if the override is out of date instead of writing the fix
   --help, -h   Show this help message
 `,
  );
}

function getN8nWorkflowVersion() {
  const n8nPackageJsonPath = join(
    REPO_ROOT,
    'node_modules',
    'n8n',
    'package.json',
  );
  const n8nPackageJson = JSON.parse(readFileSync(n8nPackageJsonPath, 'utf8'));
  const version = n8nPackageJson.dependencies?.['n8n-workflow'];

  if (!version) {
    throw new Error(
      `Could not find an "n8n-workflow" dependency in ${n8nPackageJsonPath}`,
    );
  }

  return version;
}

function withSyncedOverride(workspaceYaml, version) {
  const lines = workspaceYaml.split('\n');
  const overrideLine = `  n8n-workflow: ${version}`;
  const overridesHeaderIndex = lines.findIndex((line) =>
    /^overrides:\s*$/.test(line),
  );

  if (overridesHeaderIndex === -1) {
    throw new Error(
      'Could not find an "overrides:" section in pnpm-workspace.yaml',
    );
  }

  let blockEndIndex = overridesHeaderIndex + 1;

  while (blockEndIndex < lines.length && /^ {2}\S/.test(lines[blockEndIndex])) {
    blockEndIndex += 1;
  }

  const existingEntryIndex = lines.findIndex(
    (line, index) =>
      index > overridesHeaderIndex &&
      index < blockEndIndex &&
      /^ {2}n8n-workflow:/.test(line),
  );

  if (existingEntryIndex !== -1) {
    lines[existingEntryIndex] = overrideLine;
  } else {
    lines.splice(blockEndIndex, 0, overrideLine);
  }

  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(EXIT_OK);
  }

  const checkOnly = args.includes('--check');
  const version = getN8nWorkflowVersion();
  const currentContent = readFileSync(WORKSPACE_FILE, 'utf8');
  const nextContent = withSyncedOverride(currentContent, version);

  if (currentContent === nextContent) {
    process.stdout.write(`n8n-workflow override is up to date (${version}).\n`);
    process.exit(EXIT_OK);
  }

  if (checkOnly) {
    process.stderr.write(
      `n8n-workflow override in pnpm-workspace.yaml is out of date, expected ${version}.\n` +
        'Run "pnpm run fix:n8n-workflow" to update it.\n',
    );
    process.exit(EXIT_FAIL);
  }

  writeFileSync(WORKSPACE_FILE, nextContent);
  process.stdout.write(`Updated n8n-workflow override to ${version}.\n`);
  process.exit(EXIT_OK);
}

main();
