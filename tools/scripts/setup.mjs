import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const N8N_CREDENTIALS = process.env.N8N_CREDENTIALS || '{"credentials":[]}';
const N8N_URL = process.env.N8N_URL || 'http://localhost:5678';
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'owner@n8n.local';
const OWNER_FIRST_NAME = process.env.OWNER_FIRST_NAME || 'n8n';
const OWNER_LAST_NAME = process.env.OWNER_LAST_NAME || 'owner';
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || 'n8nOwner';

export async function parseArgs(args) {
  return {
    arguments: args.slice(2).filter((arg) => !arg.startsWith('--')),
    options: args
      .slice(2)
      .filter((arg) => arg.startsWith('--'))
      .reduce((options, arg) => {
        const [name, value] = arg.split('=', 2);
        const key = name
          .substring(2)
          .split('-')
          .map((string, index) =>
            index === 0
              ? string
              : `${string.charAt(0).toUpperCase()}${string.slice(1)}`,
          )
          .join('');
        options[key] = value ? value : true;
        return options;
      }, {}),
  };
}

export async function directoryExists(dirpath) {
  try {
    return (await fs.stat(dirpath)).isDirectory();
  } catch (e) {
    return false;
  }
}

export async function fileExists(filepath) {
  try {
    return (await fs.stat(filepath)).isFile();
  } catch (e) {
    return false;
  }
}

export async function readText(filepath) {
  return fs.readFile(filepath, 'utf-8');
}

export async function readJson(filepath) {
  return JSON.parse(await fs.readFile(filepath));
}

export async function readJsonCollection(dirpath) {
  const collection = [];

  for (const filename of await fs.readdir(dirpath)) {
    collection.push(await readJson(path.join(dirpath, filename)));
  }

  return collection;
}

export async function writeJson(filepath, json) {
  await fs.writeFile(filepath, JSON.stringify(json, null, 2));

  return json;
}

export async function getSettings() {
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

export async function getSetupCookie() {
  const url = new URL('/rest/login', N8N_URL);
  const response = await fetch(url);

  if (response.status === 200) {
    return {
      cookie: response.headers
        .get('set-cookie')
        .split('; ')
        .find((tuple) => tuple.startsWith('n8n-auth=')),
    };
  }

  return {
    error: {
      code: response.status,
      message: await response.text(),
    },
  };
}

export async function createOwnerSetup(options) {
  const url = new URL('/rest/owner/setup', N8N_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: options.cookie,
    },
    body: JSON.stringify(options.data),
  });

  if (response.status === 200) {
    return response.json();
  }

  return {
    error: await response.json(),
  };
}

export async function createLogin(options) {
  const url = new URL('/rest/login', N8N_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(options.data),
  });

  if (response.status === 200) {
    return {
      cookie: response.headers
        .get('set-cookie')
        .split('; ')
        .find((tuple) => tuple.startsWith('n8n-auth=')),
      ...(await response.json()),
    };
  }

  return {
    error: await response.json(),
  };
}

export async function getApiKey(options) {
  const url = new URL('/rest/me/api-key', N8N_URL);
  const response = await fetch(url, {
    headers: {
      cookie: options.cookie,
    },
  });

  if (response.status === 200) {
    return response.json();
  }

  return {
    error: await response.json(),
  };
}

export async function createApiKey(options) {
  const url = new URL('/rest/me/api-key', N8N_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      cookie: options.cookie,
    },
  });

  if (response.status === 200) {
    return response.json();
  }

  return {
    error: await response.json(),
  };
}

export async function authorizeOwner() {
  const settings = await getSettings();

  if (settings.error) {
    return settings;
  }

  if (settings.data.userManagement.showSetupOnFirstLoad) {
    const setupCookie = await getSetupCookie();

    if (setupCookie.error) {
      return setupCookie;
    }

    const owner = await createOwnerSetup({
      cookie: setupCookie.cookie,
      data: {
        email: OWNER_EMAIL,
        firstName: OWNER_FIRST_NAME,
        lastName: OWNER_LAST_NAME,
        password: OWNER_PASSWORD,
      },
    });

    if (owner.error) {
      return owner;
    }
  }

  const login = await createLogin({
    data: {
      email: OWNER_EMAIL,
      password: OWNER_PASSWORD,
    },
  });

  if (login.error) {
    return login;
  }

  let apiKey = await getApiKey(login);

  if (apiKey.error) {
    return apiKey;
  }

  if (apiKey.data.apiKey !== null) {
    return {
      ...apiKey.data,
      ...login,
    };
  }

  apiKey = await createApiKey(login);

  if (apiKey.error) {
    return apiKey;
  }

  return {
    ...apiKey.data,
    ...login,
  };
}

export async function buildCredentials(workflows) {
  const credentials = [];
  const json = (await fileExists(N8N_CREDENTIALS))
    ? await readJson(N8N_CREDENTIALS)
    : JSON.parse(N8N_CREDENTIALS);

  for (const workflow of workflows) {
    for (const node of workflow.nodes || []) {
      for (const [type, { id, name }] of Object.entries(
        node.credentials || {},
      )) {
        const data = (json.credentials || json.data).find(
          (credentials) => credentials.id === id,
        );

        if (data === undefined) {
          continue;
        }

        const index = credentials.findIndex(
          (credentials) => credentials.id === id,
        );

        if (index === -1) {
          credentials.push({
            id,
            name,
            ...data,
            type,
            nodesAccess: [
              {
                nodeType: node.type,
              },
            ],
          });

          continue;
        }

        if (
          credentials[index].nodesAccess.find(
            (nodesAccess) => nodesAccess.nodeType === node.type,
          )
        ) {
          continue;
        }

        credentials[index].nodesAccess.push({
          nodeType: node.type,
        });
      }
    }
  }

  return credentials;
}

export async function getRemoteWorkflow(id, options) {
  const url = new URL(`/api/v1/workflows/${id}`, N8N_URL);
  const response = await fetch(url, {
    headers: {
      'x-n8n-api-key': options.apiKey,
    },
  });

  if (response.status === 200) {
    return response.json();
  }

  return {
    error: await response.json(),
  };
}

export async function getRemoteWorkflows(options) {
  const url = new URL('/api/v1/workflows', N8N_URL);

  if (options.cursor) {
    url.searchParams.set('cursor', options.cursor);
  }

  const response = await fetch(url, {
    headers: {
      'x-n8n-api-key': options.apiKey,
    },
  });

  if (response.status === 200) {
    return response.json();
  }

  return {
    error: await response.json(),
  };
}

export async function getAllRemoteWorkflows(options) {
  const data = [];

  do {
    const workflows = await getRemoteWorkflows(options);

    if (workflows.error) {
      return workflows;
    }

    data.push(...workflows.data);

    options.cursor = workflows.nextCursor;
  } while (options.cursor !== null);

  return { data };
}

export async function importCredentials(collection, userId) {
  const dirpath = await fs.mkdtemp(path.join(os.tmpdir(), 'tmp.'));

  for (const json of collection) {
    await writeJson(path.join(dirpath, `${json.id}.json`), json);
  }

  const args = [
    'n8n',
    'import:credentials',
    '--separate',
    `"--input=${dirpath}"`,
    `"--userId=${userId}"`,
  ];

  const execution = await new Promise((resolve) =>
    exec(args.join(' '), (error, stdout, stderr) =>
      resolve({ error, stdout, stderr }),
    ),
  );

  await fs.rm(dirpath, { recursive: true });

  return execution;
}

export async function importWorkflows(collection, userId) {
  const dirpath = await fs.mkdtemp(path.join(os.tmpdir(), 'tmp.'));

  for (const json of collection) {
    await writeJson(path.join(dirpath, `${json.id}.json`), json);
  }

  const args = [
    'n8n',
    'import:workflow',
    '--separate',
    `"--input=${dirpath}"`,
    `"--userId=${userId}"`,
  ];

  const execution = await new Promise((resolve) =>
    exec(args.join(' '), (error, stdout, stderr) =>
      resolve({ error, stdout, stderr }),
    ),
  );

  await fs.rm(dirpath, { recursive: true });

  return execution;
}

export async function activateWorkflows(collection) {
  const stdout = [];

  for (const { id } of collection) {
    const args = ['n8n', 'update:workflow', '--active=true', `"--id=${id}"`];

    const execution = await new Promise((resolve) =>
      exec(args.join(' '), (error, stdout, stderr) =>
        resolve({ error, stdout, stderr }),
      ),
    );

    if (execution.stdout.length) {
      stdout.push(execution.stdout);
    }

    if (execution.error || execution.stderr.length) {
      return {
        error: execution.error,
        stdout: stdout.join('\n'),
        stderr: execution.stderr,
      };
    }
  }

  return {
    error: null,
    stdout: stdout.join('\n'),
    stderr: '',
  };
}

async function main() {
  const args = await parseArgs(process.argv);

  const owner = await authorizeOwner();

  if (owner.error) {
    process.stderr.write(`${owner.error.message}\n`);
    process.exit(1);
  }

  process.stdout.write(
    `Authorized ${owner.data.firstName} ${owner.data.lastName} <${owner.data.email}>\n`,
  );

  if (args.arguments.length === 0) {
    return;
  }

  if (!(await directoryExists(args.arguments[0]))) {
    process.stderr.write('Please provide workflows directory as an argument\n');
    process.exit(1);
  }

  const workflowCollection = await readJsonCollection(args.arguments[0]);

  if (!args.options.skipCredentials) {
    const credentials = await buildCredentials(workflowCollection);

    const credentialsImport = await importCredentials(
      credentials,
      owner.data.id,
    );

    if (credentialsImport.error) {
      console.error(credentialsImport.stdout);
      process.exit(1);
    }

    if (credentialsImport.stderr.length) {
      process.stderr.write(credentialsImport.stderr);
      process.exit(1);
    }

    process.stdout.write(
      `Imported ${credentials.length} credential${
        credentials.length === 1 ? '' : 's'
      }\n`,
    );
  }

  if (!args.options.skipWorkflows) {
    const remoteWorkflows = await getAllRemoteWorkflows(owner);

    if (remoteWorkflows.error) {
      process.stderr.write(`${remoteWorkflows.error.message}\n`);
      process.exit(1);
    }

    const newWorkflows = workflowCollection.filter((workflow) => {
      const remoteWorkflow = remoteWorkflows.data.find(
        (remoteWorkflow) => remoteWorkflow.id === workflow.id,
      );

      return remoteWorkflow === undefined;
    });

    const updatedWorkflows = workflowCollection.filter((workflow) => {
      const remoteWorkflow = remoteWorkflows.data.find(
        (remoteWorkflow) => remoteWorkflow.id === workflow.id,
      );

      if (remoteWorkflow === undefined) {
        return false;
      }

      return new Date(workflow.updatedAt) > new Date(remoteWorkflow.updatedAt);
    });

    const workflows = args.options.forceWorkflows
      ? workflowCollection
      : [...newWorkflows, ...updatedWorkflows];

    const workflowsImport = await importWorkflows(workflows, owner.data.id);

    if (workflowsImport.error) {
      console.error(workflowsImport.stdout);
      process.exit(1);
    }

    if (workflowsImport.stderr.length) {
      process.stderr.write(workflowsImport.stderr);
      process.exit(1);
    }

    if (args.options.forceWorkflows) {
      process.stdout.write(
        `Imported ${workflows.length} workflow${
          workflows.length === 1 ? '' : 's'
        }\n`,
      );
    } else {
      process.stdout.write(
        `Imported ${newWorkflows.length} new workflow${
          newWorkflows.length === 1 ? '' : 's'
        }\n`,
      );
      process.stdout.write(
        `Imported ${updatedWorkflows.length} updated workflow${
          updatedWorkflows.length === 1 ? '' : 's'
        }\n`,
      );
    }

    if (!args.options.skipActivation) {
      const activeWorkflows = workflows
        .map(({ id, name, active }) => {
          const remoteWorkflow = remoteWorkflows.data.find(
            (remoteWorkflow) => remoteWorkflow.id === id,
          );

          if (
            remoteWorkflow === undefined ||
            remoteWorkflow.active === active
          ) {
            return { id, name, active };
          }

          return { id, name, active: remoteWorkflow.active };
        })
        .filter(({ active }) => active);

      const workflowsActivation = await activateWorkflows(activeWorkflows);

      if (workflowsActivation.error) {
        console.error(workflowsActivation.stdout);
        process.exit(1);
      }

      if (workflowsActivation.stderr.length) {
        process.stderr.write(workflowsActivation.stderr);
        process.exit(1);
      }

      process.stdout.write(
        `Activated ${activeWorkflows.length} workflow${
          activeWorkflows.length === 1 ? '' : 's'
        }\n`,
      );
    }
  }
}

process.argv[1] === fileURLToPath(import.meta.url) && main();
