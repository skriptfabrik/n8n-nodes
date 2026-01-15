import { basename } from 'node:path';

const nodeName = basename(import.meta.dirname);

/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  tagFormat: nodeName + '-${version}',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { breaking: true, scope: false, release: 'major' },
          { breaking: true, scope: '*', release: false },
          { breaking: true, scope: nodeName, release: 'major' },
          { revert: true, scope: false, release: 'patch' },
          { revert: true, scope: '*', release: false },
          { revert: true, scope: nodeName, release: 'patch' },
          { type: 'feat', scope: false, release: 'minor' },
          { type: 'feat', scope: '*', release: false },
          { type: 'feat', scope: nodeName, release: 'minor' },
          { type: 'fix', scope: false, release: 'patch' },
          { type: 'fix', scope: '*', release: false },
          { type: 'fix', scope: nodeName, release: 'patch' },
          { type: 'perf', scope: false, release: 'patch' },
          { type: 'perf', scope: '*', release: false },
          { type: 'perf', scope: nodeName, release: 'patch' },
        ],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          issuePrefixes: ['N8N-'],
          issueUrlFormat:
            'https://skriptfabrik.atlassian.net/browse/{{prefix}}{{id}}',
          ignoreCommits: /bump n8n-(nodes-base|workflow) version/,
          scope: [nodeName],
          types: [
            {
              type: 'breaking',
              section: '💥 Breaking Changes',
              hidden: false,
            },
            {
              type: 'ci',
              section: '👷 Continuous Integration',
              hidden: true,
            },
            {
              type: 'feat',
              section: '✨ New Features',
              hidden: false,
            },
            {
              type: 'fix',
              section: '🐛 Bug Fixes',
              hidden: false,
            },
            {
              type: 'chore',
              section: '🔨 Maintenance and Housekeeping',
              hidden: true,
            },
            {
              type: 'docs',
              section: '📝 Documentation Changes',
              hidden: true,
            },
            {
              type: 'refactor',
              section: '♻️ Refactorings',
              hidden: true,
            },
            {
              type: 'perf',
              section: '🚀 Performance Improvements',
              hidden: false,
            },
            {
              type: 'style',
              section: '🎨 Improvements to Structure and Style',
              hidden: true,
            },
            {
              type: 'test',
              section: '✅ Changes to Test Assets',
              hidden: true,
            },
          ],
        },
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogTitle: '# Changelog',
      },
    ],
    [
      '@semantic-release/npm',
      {
        tarballDir: 'dist',
      },
    ],
    // Because @semantic-release/git is not able to use SSH to push we use exec here, see https://github.com/semantic-release/git/issues/422
    [
      '@semantic-release/exec',
      {
        prepareCmd:
          "git add --force --ignore-errors package.json CHANGELOG.md && git commit -m 'chore(release): ${nextRelease.gitTag}' && git push --tags origin HEAD:${branch.name} && echo 'Prepared Git release: ${nextRelease.gitTag}'",
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: 'dist/*.tgz',
        // disable commenting issues/pull requests, see https://github.com/semantic-release/github/issues/1017
        successCommentCondition: '<% return false; %>',
        releaseNameTemplate: '<%= nextRelease.gitTag %>',
      },
    ],
  ],
};
