const test = require('node:test');
const assert = require('node:assert/strict');

const { GoogleCloudStorageEnhanced } = require('../dist/nodes/GoogleCloudStorageEnhanced/GoogleCloudStorageEnhanced.node.js');

function createExecutionContext(parameters, options = {}) {
  const requestCalls = [];
  const shouldThrowRequest = options.throwOnRequest ?? false;

  const context = {
    getInputData() {
      return [{ json: { seed: true } }];
    },
    getNodeParameter(name) {
      if (!(name in parameters)) {
        throw new Error(`Unexpected parameter requested: ${name}`);
      }

      return parameters[name];
    },
    continueOnFail() {
      return options.continueOnFail ?? false;
    },
    getNode() {
      return { name: 'Google Cloud Storage Enhanced' };
    },
    helpers: {
      async httpRequestWithAuthentication(type, requestOptions) {
        requestCalls.push({ type, requestOptions });

        if (shouldThrowRequest) {
          throw new Error('request failed');
        }

        return {
          bucket: 'my-bucket',
          kind: 'storage#bucket',
        };
      },
      returnJsonArray(data) {
        return Array.isArray(data) ? data : [data];
      },
      constructExecutionMetaData(items, { itemData }) {
        return items.map((json) => ({
          json,
          pairedItem: { item: itemData.item },
        }));
      },
    },
  };

  return { context, requestCalls };
}

test('GoogleCloudStorageEnhanced.execute dispatches bucket get operation', async () => {
  const node = new GoogleCloudStorageEnhanced();
  const { context, requestCalls } = createExecutionContext({
    authentication: 'oAuth2',
    resource: 'bucket',
    operation: 'get',
    bucketName: 'my-bucket',
    getFilters: {
      ifMetagenerationMatch: 2,
    },
    projection: 'noAcl',
  });

  const result = await node.execute.call(context);

  assert.equal(requestCalls.length, 1);
  assert.equal(requestCalls[0].type, 'googleApi');
  assert.equal(requestCalls[0].requestOptions.method, 'GET');
  assert.equal(requestCalls[0].requestOptions.baseURL, 'https://storage.googleapis.com/storage/v1');
  assert.equal(requestCalls[0].requestOptions.url, '/b/my-bucket');
  assert.deepEqual(requestCalls[0].requestOptions.qs, {
    ifMetagenerationMatch: 2,
    projection: 'noAcl',
  });

  assert.equal(result.length, 1);
  assert.equal(result[0].length, 1);
  assert.deepEqual(result[0][0].json, {
    bucket: 'my-bucket',
    kind: 'storage#bucket',
  });
  assert.equal(result[0][0].pairedItem.item, 0);
});

test('GoogleCloudStorageEnhanced.execute returns item error when continueOnFail is enabled', async () => {
  const node = new GoogleCloudStorageEnhanced();
  const { context } = createExecutionContext(
    {
      authentication: 'oAuth2',
      resource: 'bucket',
      operation: 'get',
      bucketName: 'my-bucket',
      getFilters: {},
      projection: 'full',
    },
    {
      continueOnFail: true,
      throwOnRequest: true,
    },
  );

  const result = await node.execute.call(context);

  assert.equal(result.length, 1);
  assert.equal(result[0].length, 1);
  assert.ok(typeof result[0][0].json.error === 'string');
  assert.match(result[0][0].json.error, /request failed/i);
  assert.equal(result[0][0].pairedItem.item, 0);
});
