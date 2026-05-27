import { configWithoutCloudSupport } from '@n8n/node-cli/eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...configWithoutCloudSupport,
  {
    rules: {
      '@n8n/community-nodes/no-runtime-dependencies': 'off',
    },
  },
]);
