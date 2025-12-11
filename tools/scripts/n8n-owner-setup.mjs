import { fileURLToPath } from 'node:url';

const N8N_HOST = process.env.N8N_HOST || process.env.HOSTNAME || 'localhost';
const N8N_URL = process.env.N8N_URL || `http://${N8N_HOST}:5678`;
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'owner@n8n.local';
const OWNER_FIRST_NAME = process.env.OWNER_FIRST_NAME || 'n8n';
const OWNER_LAST_NAME = process.env.OWNER_LAST_NAME || 'owner';
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || 'n8nOwner';

async function getSettings() {
  const url = new URL('/rest/settings', N8N_URL);
  const response = await fetch(url);

  if (response.status === 200) {
    return response.json();
  }

  return {
    error: {
      code: response.status,
      message: await response.text(),
    },
  };
}

async function createOwnerSetup(data) {
  const url = new URL('/rest/owner/setup', N8N_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.status === 200) {
    return response.json();
  }

  return {
    error: await response.json(),
  };
}

async function main() {
  const settings = await getSettings();

  if (settings.error) {
    process.stderr.write(`${settings.error.message}\n`);
    process.exit(1);
  }

  const data = {
    email: OWNER_EMAIL,
    firstName: OWNER_FIRST_NAME,
    lastName: OWNER_LAST_NAME,
    password: OWNER_PASSWORD,
  };

  if (!settings.data.userManagement.showSetupOnFirstLoad) {
    process.stdout.write('Owner already exists. Exiting...\n');
    process.exit(0);
  }

  const owner = await createOwnerSetup(data);

  if (owner.error) {
    process.stderr.write(`${owner.error.message}\n`);
    process.exit(1);
  }

  process.stdout.write(
    `Owner ${owner.data.firstName} ${owner.data.lastName} <${owner.data.email}> created.\n`,
  );
}

process.argv[1] === fileURLToPath(import.meta.url) && main();
