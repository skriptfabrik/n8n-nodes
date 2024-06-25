export default {
  extends: ['@commitlint/config-conventional', '@commitlint/config-nx-scopes'],
  rules: {
    'references-empty': [2, 'never'],
  },
  ignores: [
    (message) =>
      /^Signed-off-by: dependabot\[bot\] <support@github\.com>$/m.test(message),
  ],
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['N8N-'],
    },
  },
};
