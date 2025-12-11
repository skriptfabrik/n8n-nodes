import { ConventionalGitClient } from '@conventional-changelog/git-client';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HEADER_PATTERN =
  /^(breaking|ci|feat|fix|chore|docs|refactor|test|style|perf)(\((.+)\))?:\s+(.+)$/;

/**
 * Get the latest tag matching the given pattern
 * @param {ConventionalGitClient} client
 * @param {RegExp} pattern
 * @returns {Promise<string|undefined>}
 */
async function getLatestTag(client, pattern) {
  for await (const tag of client.getTags()) {
    const match = tag.match(pattern);
    if (match) {
      return tag;
    }
  }
}

/**
 * Get all conventional commits since the given tag
 * @param {ConventionalGitClient} client
 * @param {string} tag
 * @returns {Promise<Array>}
 */
async function getCommitsSinceTag(client, tag) {
  const commits = [];
  for await (const commit of client.getCommits({
    from: tag,
    merges: false,
    filterReverts: true,
  })) {
    const match = commit.header.match(HEADER_PATTERN);
    if (!match) {
      continue;
    }
    commits.push({
      type: match[1],
      scope: match[3],
      message: match[4],
    });
  }
  return commits;
}

async function main() {
  const client = new ConventionalGitClient(process.cwd());
  const node = process.argv[2] || basename(process.cwd());
  const tag = await getLatestTag(client, new RegExp(`^${node}-(.+)$`));
  let bump = 'patch';

  for (const { type, scope } of await getCommitsSinceTag(client, tag)) {
    if (type === 'breaking') {
      bump = 'major';
      break;
    }
    if (type === 'feat' && (scope === undefined || scope === node)) {
      bump = 'minor';
    }
  }
  console.log(bump);
}

process.argv[1] === fileURLToPath(import.meta.url) && main();
