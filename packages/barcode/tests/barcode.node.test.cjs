const test = require('node:test');
const assert = require('node:assert/strict');

const { Barcode } = require('../dist/nodes/Barcode/Barcode.node.js');

function createContext(parameters, continueOnFail = false, options = {}) {
  return {
    context: {
      getNodeParameter(name) {
        if (!(name in parameters)) {
          throw new Error(`Unexpected parameter requested: ${name}`);
        }

        return parameters[name];
      },
      continueOnFail() {
        return continueOnFail;
      },
      getNode() {
        return { name: 'Barcode' };
      },
      helpers: {
        async prepareBinaryData(buffer, _fileName, mimeType) {
          if (options.throwInPrepareBinaryData) {
            throw new Error('prepareBinaryData failed');
          }

          return {
            data: buffer.toString('base64'),
            mimeType,
            fileSize: buffer.length,
          };
        },
      },
    },
  };
}

test('Barcode.execute returns PNG payload and binary output under selected field', async () => {
  const node = new Barcode();
  const { context } = createContext({
    data: 'HELLO-123',
    output: 'barcodeOutput',
    options: {
      format: 'CODE128',
      displayValue: true,
      width: 2,
      height: 100,
    },
  });

  const result = await node.execute.call(context);

  assert.equal(result.length, 1);
  assert.equal(result[0].length, 1);

  const firstItem = result[0][0];
  assert.equal(firstItem.json.mimeType, 'image/png');
  assert.ok(
    typeof firstItem.json.data === 'string' && firstItem.json.data.length > 0,
  );

  assert.ok(firstItem.binary);
  assert.ok(firstItem.binary.barcodeOutput);
  assert.equal(firstItem.binary.barcodeOutput.mimeType, 'image/png');
  assert.ok(firstItem.binary.barcodeOutput.fileSize > 0);
  assert.equal(firstItem.pairedItem.item, 0);
});

test('Barcode.execute returns an error item when continueOnFail is enabled', async () => {
  const node = new Barcode();
  const { context } = createContext(
    {
      data: 'HELLO-123',
      output: 'barcodeOutput',
      options: {
        format: 'CODE128',
      },
    },
    true,
    {
      throwInPrepareBinaryData: true,
    },
  );

  const result = await node.execute.call(context);

  assert.equal(result.length, 1);
  assert.equal(result[0].length, 1);
  assert.ok(typeof result[0][0].json.error === 'string');
  assert.ok(result[0][0].json.error.length > 0);
  assert.equal(result[0][0].pairedItem.item, 0);
});

test('Barcode.execute throws when barcode generation fails and continueOnFail is disabled', async () => {
  const node = new Barcode();
  const { context } = createContext(
    {
      data: 'HELLO-123',
      output: 'barcodeOutput',
      options: {
        format: 'CODE128',
      },
    },
    false,
    {
      throwInPrepareBinaryData: true,
    },
  );

  await assert.rejects(async () => {
    await node.execute.call(context);
  });
});
