export default {
  extends: ['@commitlint/config-conventional', '@commitlint/config-nx-scopes'],
  rules: {
    'references-empty': [2, 'never'],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*) \(N8N-[0-9]+\)$/,
      issuePrefixes: ['N8N-'],
    },
  },
};
