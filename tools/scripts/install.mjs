import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCachedProjectGraph } from '@nx/devkit';
import { parseArgs, readJson } from './setup.mjs';

const N8N_USER_FOLDER = process.env.N8N_USER_FOLDER || os.homedir();

async function initCustomDirectory(cwd) {
  try {
    await fs.access(path.join(cwd, 'package.json'), fs.constants.F_OK);

    return Promise.resolve({ error: null, stdout: '', stderr: '' });
  } catch {
    await fs.mkdir(cwd, { recursive: true });

    const args = ['pnpm', 'init'];

    return await new Promise((resolve) =>
      exec(args.join(' '), { cwd }, (error, stdout, stderr) =>
        resolve({ error, stdout, stderr }),
      ),
    );
  }
}

async function installCustomPackageLink(cwd, name) {
  const args = ['pnpm', 'link', '--global', name];

  return await new Promise((resolve) =>
    exec(args.join(' '), { cwd }, (error, stdout, stderr) =>
      resolve({ error, stdout, stderr }),
    ),
  );
}

async function main() {
  const args = await parseArgs(process.argv);

  if (args.arguments.length < 1) {
    process.stderr.write('Please provide project name as an argument\n');
    process.exit(1);
  }

  const customDirectory = path.join(N8N_USER_FOLDER, '.n8n', 'custom');

  const init = await initCustomDirectory(customDirectory);

  if (init.error) {
    console.error(init.stderr);
    process.exit(1);
  }

  if (init.stderr.length) {
    process.stderr.write(init.stderr);
    process.exit(1);
  }

  const graph = readCachedProjectGraph();

  for (const nodeName of args.arguments) {
    const project = graph.nodes[nodeName];

    if (!project) {
      console.error(`Could not find project "${nodeName}".`);
      process.exit(1);
    }

    const name = project.data?.name;
    const outputPath = project.data?.targets?.build?.options?.outputPath;

    if (!outputPath) {
      console.error(
        `Could not find "build.options.outputPath" of project "${name}". Is project.json configured correctly?`,
      );
      process.exit(1);
    }

    const packageJson = await readJson(path.join(outputPath, 'package.json'));
    const install = await installCustomPackageLink(
      customDirectory,
      packageJson.name,
    );

    if (install.error) {
      console.error(install.stderr);
      process.exit(1);
    }

    if (install.stderr.length) {
      process.stderr.write(install.stderr);
      process.exit(1);
    }

    process.stdout.write(
      `Installed link of project "${name}" into custom directory "${customDirectory}"\n`,
    );
  }
}

process.argv[1] === fileURLToPath(import.meta.url) && main();
