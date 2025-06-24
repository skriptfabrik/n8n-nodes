import { type IExecuteFunctions, INodeTypeDescription } from 'n8n-workflow';
import { mockClear, mockDeep } from 'jest-mock-extended';
import { OttoMarket } from './OttoMarket.node';
import { OttoMarketRequest } from './GenericFunctions';

jest.mock('./GenericFunctions');

describe('OTTO Market', () => {
  const executeFunctions = mockDeep<IExecuteFunctions>({
    helpers: {
      returnJsonArray: jest.fn().mockReturnValue([{ json: { foo: 'bar' } }]),
    },
  });

  let ottoMarketProperties: INodeTypeDescription;

  let ottoMarket: OttoMarket;

  beforeAll(() => {
    executeFunctions.getInputData.mockImplementation(() => [
      {
        json: {
          foo: 'bar',
        },
      },
    ]);
  });

  beforeEach(() => {
    ottoMarket = new OttoMarket();
  });

  afterEach(() => {
    mockClear(executeFunctions);
  });

  it('should be defined', () => {
    expect(ottoMarket).toBeDefined();
  });

  it('should initialize with correct configuration', () => {
    ottoMarketProperties = ottoMarket.description;
    expect(ottoMarketProperties.displayName).toBe('OTTO Market');
    expect(ottoMarketProperties.name).toBe('ottoMarket');
    expect(ottoMarketProperties.group).toEqual(['transform']);
    expect(ottoMarketProperties.version).toBe(1);
    expect(ottoMarketProperties.documentationUrl).toBe(
      'https://api.otto.market/docs#section/Home',
    );
  });

  it('should call otto api for orders:getOne', async () => {
    jest
      .mocked(OttoMarketRequest)
      .mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
      ({
        resource: 'orders',
        operation: 'getOne',
        id: 'abc123',
      })[parameterName],
    );

    await ottoMarket.execute.call(executeFunctions);
    expect(OttoMarketRequest).toHaveBeenCalledWith(
      executeFunctions,
      {
        body: '',
        method: 'GET',
        uri: '/v4/orders/abc123',
      },
      0,
    );
  });

  it('should call otto api for returns:list', async () => {
    jest
      .mocked(OttoMarketRequest)
      .mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'list',
          status: 'status',
        })[parameterName],
    );
    await ottoMarket.execute.call(executeFunctions);
    expect(OttoMarketRequest).toHaveBeenCalledWith(
      executeFunctions,
      {
        body: '',
        method: 'GET',
        uri: '/v2/returns?limit=50&page=1&status=status',
      },
      0,
    );
  });

  it('should call otto api for returns:accept', async () => {
    jest
      .mocked(OttoMarketRequest)
      .mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'accept',
          positionItems: [],
        })[parameterName],
    );
    await ottoMarket.execute.call(executeFunctions);
    expect(OttoMarketRequest).toHaveBeenCalledWith(
      executeFunctions,
      {
        body: {
          positionItems: [],
        },
        method: 'POST',
        uri: '/v2/returns/acceptance',
      },
      0,
    );
  });

  it('should call otto api for returns:reject', async () => {
    jest
      .mocked(OttoMarketRequest)
      .mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'reject',
          positionItems: [],
        })[parameterName],
    );
    await ottoMarket.execute.call(executeFunctions);
    expect(OttoMarketRequest).toHaveBeenCalledWith(
      executeFunctions,
      {
        body: {
          positionItems: [],
        },
        method: 'POST',
        uri: '/v2/returns/rejection',
      },
      0,
    );
  });
});
