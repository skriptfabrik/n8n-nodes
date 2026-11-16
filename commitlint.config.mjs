export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'references-empty': [2, 'never'],
  },
  ignores: [
    (message) =>
      /^Signed-off-by: github-actions\[bot\] <support@github\.com>$/m.test(
        message,
      ),
    (message) =>
      /^Signed-off-by: github-actions\[bot\] <41898282\+github-actions\[bot\]@users.noreply.github\.com>$/m.test(
        message,
      ),
    (message) =>
      /^Signed-off-by: renovate\[bot\] <29139614\+renovate\[bot\]@users\.noreply\.github\.com>$/m.test(
        message,
      ),
  ],
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['#', 'DWBN-', 'INTERN-', 'LAA-', 'N8N-'],
    },
  },
};
