const nx = require('@nx/eslint-plugin');
const { fixupPluginRules } = require('@eslint/compat');
const eslintPluginN8nNodesBase = require('eslint-plugin-n8n-nodes-base');

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      'n8n-nodes-base': fixupPluginRules(eslintPluginN8nNodesBase),
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'warn',
      'n8n-nodes-base/node-class-description-outputs-wrong': 'warn',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
