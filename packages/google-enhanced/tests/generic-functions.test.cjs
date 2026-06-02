const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const {
  createMultipartForm,
  parseBodyData,
  requestServiceAccount,
} = require('../dist/nodes/GenericFunctions.js');
const {
  googleApiRequest,
  googleApiRequestAllItems,
} = require('../dist/nodes/GoogleCloudStorageEnhanced/GenericFunctions.js');

test('parseBodyData parses configured JSON fields and leaves invalid JSON untouched', () => {
  const input = {
    acl: '{"entity":"allUsers","role":"READER"}',
    metadata: '{"team":"platform"}',
    broken: '{not-json}',
    untouched: 'value',
  };

  const parsed = parseBodyData(input, ['acl', 'metadata', 'broken']);

  assert.deepEqual(parsed.acl, { entity: 'allUsers', role: 'READER' });
  assert.deepEqual(parsed.metadata, { team: 'platform' });
  assert.equal(parsed.broken, '{not-json}');
  assert.equal(parsed.untouched, 'value');
});

test('createMultipartForm assembles metadata and file parts', async () => {
  const body = await createMultipartForm(
    { name: 'report.txt', metadata: { env: 'test' } },
    'hello world',
    'text/plain',
    11,
  );

  const serialized = body.getBuffer().toString('utf8');

  assert.ok(body.getBoundary().length > 0);
  assert.ok(body.getLengthSync() > 0);
  assert.match(serialized, /name="metadata"/);
  assert.match(serialized, /application\/json/);
  assert.match(
    serialized,
    /\{"name":"report.txt","metadata":\{"env":"test"\}\}/,
  );
  assert.match(serialized, /name="file"/);
  assert.match(serialized, /hello world/);
});

test('requestServiceAccount requests token and forwards Authorization header', async () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });

  const calls = [];

  const context = {
    async getCredentials(type) {
      assert.equal(type, 'googleApi');
      return {
        email: ' service-account@example.com ',
        delegatedEmail: '',
        privateKey: privateKey.export({ type: 'pkcs8', format: 'pem' }),
      };
    },
    helpers: {
      async httpRequestWithAuthentication(type, options) {
        calls.push({ type, options });

        if (options.url === 'https://oauth2.googleapis.com/token') {
          return { access_token: 'access-token-123' };
        }

        return {
          ok: true,
          authorization: options.headers.Authorization,
        };
      },
    },
  };

  const response = await requestServiceAccount.call(
    context,
    'googleApi',
    {
      method: 'GET',
      url: 'https://storage.googleapis.com/storage/v1/b/example',
      headers: {
        'X-Test': 'true',
      },
    },
    ['scope:test'],
  );

  const assertion = calls[0].options.body.assertion;
  const [headerPart, payloadPart, signaturePart] = assertion.split('.');

  const unsignedToken = `${headerPart}.${payloadPart}`;
  const signature = Buffer.from(signaturePart, 'base64url');
  const payload = JSON.parse(
    Buffer.from(payloadPart, 'base64url').toString('utf8'),
  );
  const header = JSON.parse(
    Buffer.from(headerPart, 'base64url').toString('utf8'),
  );

  const isSignatureValid = crypto.verify(
    'RSA-SHA256',
    Buffer.from(unsignedToken),
    publicKey,
    signature,
  );

  assert.equal(calls.length, 2);
  assert.equal(calls[0].options.url, 'https://oauth2.googleapis.com/token');
  assert.equal(isSignatureValid, true);
  assert.equal(header.alg, 'RS256');
  assert.equal(payload.iss, 'service-account@example.com');
  assert.equal(payload.sub, 'service-account@example.com');
  assert.equal(payload.scope, 'scope:test');
  assert.equal(payload.aud, 'https://oauth2.googleapis.com/token');
  assert.equal(payload.exp - payload.iat, 3600);
  assert.equal(
    calls[1].options.headers.Authorization,
    'Bearer access-token-123',
  );
  assert.deepEqual(response, {
    ok: true,
    authorization: 'Bearer access-token-123',
  });
});

test('googleApiRequest sets arraybuffer encoding for media downloads', async () => {
  const calls = [];

  const context = {
    getNodeParameter(name) {
      if (name === 'authentication') {
        return 'oAuth2';
      }

      throw new Error(`Unexpected parameter requested: ${name}`);
    },
    helpers: {
      async httpRequestWithAuthentication(type, options) {
        calls.push({ type, options });
        return { ok: true };
      },
    },
  };

  await googleApiRequest.call(context, 'GET', '/b/sample/o/object', undefined, {
    alt: 'media',
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].type, 'googleApi');
  assert.equal(
    calls[0].options.baseURL,
    'https://storage.googleapis.com/storage/v1',
  );
  assert.equal(calls[0].options.url, '/b/sample/o/object');
  assert.equal(calls[0].options.encoding, 'arraybuffer');
});

test('googleApiRequestAllItems follows page tokens and returns all items', async () => {
  const capturedQs = [];
  let callIndex = 0;

  const context = {
    getNodeParameter(name) {
      if (name === 'authentication') {
        return 'oAuth2';
      }

      throw new Error(`Unexpected parameter requested: ${name}`);
    },
    helpers: {
      async httpRequestWithAuthentication(_type, options) {
        capturedQs.push({ ...options.qs });

        if (callIndex === 0) {
          callIndex += 1;
          return {
            items: [{ id: 'first' }],
            nextPageToken: 'next-page',
          };
        }

        return {
          items: [{ id: 'second' }],
        };
      },
    },
  };

  const result = await googleApiRequestAllItems.call(
    context,
    'GET',
    '/b/sample/o',
    undefined,
    {
      projection: 'full',
    },
  );

  assert.deepEqual(result, [{ id: 'first' }, { id: 'second' }]);
  assert.equal(capturedQs.length, 2);
  assert.equal(capturedQs[0].projection, 'full');
  assert.equal(capturedQs[1].pageToken, 'next-page');
});
