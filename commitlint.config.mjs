export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'references-empty': [2, 'never'],
  },
  ignores: [
    (message) =>
      /^Signed-off-by: (dependabot|github-actions)\[bot\] <support@github\.com>$/m.test(
        message,
      ),
    (message) =>
      /^Signed-off-by: (dependabot|github-actions)\[bot\] <(49699333|41898282)\+(dependabot|github-actions)\[bot\]@users.noreply.github\.com>$/m.test(
        message,
      ),
  ],
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['DWBN-', 'INTERN-', 'LAA-', 'N8N-', '#'],
    },
  },
};
