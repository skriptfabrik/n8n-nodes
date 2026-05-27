import { configWithoutCloudSupport } from '@n8n/node-cli/eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...configWithoutCloudSupport,
  {
    files: ['package.json'],
    rules: {
      '@n8n/community-nodes/no-runtime-dependencies': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
]);
