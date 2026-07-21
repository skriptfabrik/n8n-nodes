import * as esbuild from 'esbuild';
import * as fs from 'node:fs';

const entry = process.argv[2];
const bundle = entry.replace('.node.js', '.node.bundle.js');

await esbuild.build({
  entryPoints: [entry],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node18',
  external: ['n8n-workflow'],
  outfile: bundle,
});

await fs.promises.copyFile(bundle, entry);

await fs.promises.unlink(bundle);
