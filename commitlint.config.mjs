export default {
  extends: ['@commitlint/config-conventional', '@commitlint/config-nx-scopes'],
  rules: {
    'references-empty': [2, 'never'],
  },
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['N8N-'],
    },
  },
};
