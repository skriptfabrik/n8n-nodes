import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readCachedProjectGraph } from '@nx/devkit';
import { parseArgs } from './setup.mjs';

async function linkCustomPackage(cwd) {
  const args = ['pnpm', 'link', '--global'];

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

    const install = await linkCustomPackage(outputPath);

    if (install.error) {
      console.error(install.stderr);
      process.exit(1);
    }

    if (install.stderr.length) {
      process.stderr.write(install.stderr);
      process.exit(1);
    }

    process.stdout.write(`Linked project "${name}"\n`);
  }
}

process.argv[1] === fileURLToPath(import.meta.url) && main();
