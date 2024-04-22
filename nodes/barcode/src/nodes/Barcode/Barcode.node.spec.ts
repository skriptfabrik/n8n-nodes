import { IBinaryData, type IExecuteFunctions } from 'n8n-workflow';
import { mock, mockClear, mockDeep } from 'jest-mock-extended';
import { Barcode } from './Barcode.node';

describe('Barcode', () => {
  const executeFunctions = mockDeep<IExecuteFunctions>();

  let barcode: Barcode;

  beforeEach(() => {
    barcode = new Barcode();
  });

  afterEach(() => {
    mockClear(executeFunctions);
  });

  it('should be defined', () => {
    expect(barcode).toBeDefined();
  });

  it('should create a barcode', async () => {
    const binaryData = mock<IBinaryData>();

    executeFunctions.getNodeParameter.mockImplementation(
      (paramName: string) => {
        switch (paramName) {
          case 'data':
            return 'data';
          case 'output':
            return 'data';
          case 'options':
            return {};
          default:
            return undefined;
        }
      },
    );

    executeFunctions.helpers.prepareBinaryData.mockResolvedValue(binaryData);

    await barcode.execute.call(executeFunctions);

    expect(executeFunctions.prepareOutputData).toHaveBeenCalledWith([
      {
        json: {
          data: expect.stringMatching(/^[A-Za-z0-9+-/]+={0,3}$/),
          mimeType: 'image/png',
        },
        binary: {
          data: binaryData,
        },
      },
    ]);
  });
});
