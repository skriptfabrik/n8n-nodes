import { type IExecuteFunctions, INodeTypeDescription } from 'n8n-workflow';
import { mockClear, mockDeep } from 'jest-mock-extended';
import { Channable } from './Channable.node';
import { ChannableRequest } from './GenericFunctions';

jest.mock('./GenericFunctions');

describe('Channable', () => {
  const executeFunctions = mockDeep<IExecuteFunctions>({
    helpers: {
      returnJsonArray: jest.fn().mockReturnValue([{ json: { foo: 'bar' } }]),
    },
  });

  let channableProperties: INodeTypeDescription;

  let channable: Channable;

  beforeAll(() => {
    executeFunctions.getInputData.mockImplementation(() => [
      {
        json: {
          foo: 'bar',
        },
      },
    ]);
    executeFunctions.getCredentials.mockResolvedValue({
      companyId: 'companyId',
      accessToken: 'accessToken',
    });
  });

  beforeEach(() => {
    channable = new Channable();
  });

  afterEach(() => {
    mockClear(ChannableRequest);
    mockClear(executeFunctions);
  });

  it('should be defined', () => {
    expect(channable).toBeDefined();
  });

  it('should initialize with correct configuration', () => {
    channableProperties = channable.description;
    expect(channableProperties.displayName).toBe('Channable');
    expect(channableProperties.name).toBe('channable');
    expect(channableProperties.group).toEqual(['transform']);
    expect(channableProperties.version).toBe(1);
    expect(channableProperties.documentationUrl).toBe(
      'https://api.channable.com/v1/docs#section/Introduction',
    );
  });

  it('should not call channable api for unknown resource', async () => {
    jest.mocked(ChannableRequest).mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: '_unknown_',
        })[parameterName],
    );

    await channable.execute.call(executeFunctions);

    expect(ChannableRequest).toHaveBeenCalledTimes(0);
  });

  it('should not call channable api resource orders and a unknown operation', async () => {
    jest.mocked(ChannableRequest).mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'orders',
          operation: '_unknown_',
        })[parameterName],
    );

    await channable.execute.call(executeFunctions);

    expect(ChannableRequest).toHaveBeenCalledTimes(0);
  });

  it('should call channable api for orders:getOne', async () => {
    jest.mocked(ChannableRequest).mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'orders',
          operation: 'getOne',
          projectId: 'projectId',
          id: 'abc123',
        })[parameterName],
    );

    await channable.execute.call(executeFunctions);

    expect(ChannableRequest).toHaveBeenCalledWith(
      executeFunctions,
      {
        body: '',
        method: 'GET',
        uri: '/orders/abc123',
      },
      0,
    );
  });

  it('should call channable api for orders:returnManual', async () => {
    jest.mocked(ChannableRequest).mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'orders',
          operation: 'returnManual',
          projectId: 'projectId',
          id: 'abc123',
          products: [],
        })[parameterName],
    );

    await channable.execute.call(executeFunctions);

    expect(ChannableRequest).toHaveBeenCalledWith(
      executeFunctions,
      {
        body: { products: [] },
        method: 'POST',
        uri: '/orders/abc123/return',
      },
      0,
    );
  });

  it('should not call channable api resource stockUpdates and a unknown operation', async () => {
    jest.mocked(ChannableRequest).mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'stockUpdates',
          operation: '_unknown_',
        })[parameterName],
    );

    await channable.execute.call(executeFunctions);

    expect(ChannableRequest).toHaveBeenCalledTimes(0);
  });

  it('should call channable api for stockUpdates:updateStock', async () => {
    jest.mocked(ChannableRequest).mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'stockUpdates',
          operation: 'updateStock',
          projectId: 'projectId',
          stocks: [],
        })[parameterName],
    );

    await channable.execute.call(executeFunctions);

    expect(ChannableRequest).toHaveBeenCalledWith(
      executeFunctions,
      {
        body: [],
        method: 'POST',
        uri: '/stock_updates',
      },
      0,
    );
  });

  it('should not call channable api resource returns and a unknown operation', async () => {
    jest.mocked(ChannableRequest).mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: '_unknown_',
        })[parameterName],
    );

    await channable.execute.call(executeFunctions);

    expect(ChannableRequest).toHaveBeenCalledTimes(0);
  });

  it('should call channable api for returns:list', async () => {
    jest.mocked(ChannableRequest).mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'list',
          projectId: 'projectId',
          additionalFields: {
            search: 'foobar',
          },
        })[parameterName],
    );

    await channable.execute.call(executeFunctions);

    expect(ChannableRequest).toHaveBeenCalledWith(
      executeFunctions,
      {
        body: '',
        method: 'GET',
        uri: '/returns',
        qs: {
          search: 'foobar',
        },
      },
      0,
    );
  });

  it('should call channable api for returns:listAnonymized', async () => {
    jest.mocked(ChannableRequest).mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'listAnonymized',
          projectId: 'projectId',
          additionalFields: {
            search: 'foobar',
          },
        })[parameterName],
    );

    await channable.execute.call(executeFunctions);

    expect(ChannableRequest).toHaveBeenCalledWith(
      executeFunctions,
      {
        body: '',
        method: 'GET',
        uri: '/anonymous_returns',
        qs: {
          search: 'foobar',
        },
      },
      0,
    );
  });

  it('should call channable api for returns:getOne', async () => {
    jest.mocked(ChannableRequest).mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'getOne',
          projectId: 'projectId',
          id: 'abc123',
        })[parameterName],
    );

    await channable.execute.call(executeFunctions);

    expect(ChannableRequest).toHaveBeenCalledWith(
      executeFunctions,
      {
        body: '',
        method: 'GET',
        uri: '/returns/abc123',
      },
      0,
    );
  });

  it('should call channable api for returns:createTest', async () => {
    jest.mocked(ChannableRequest).mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'createTest',
          projectId: 'projectId',
          id: 'abc123',
        })[parameterName],
    );

    await channable.execute.call(executeFunctions);

    expect(ChannableRequest).toHaveBeenCalledWith(
      executeFunctions,
      {
        body: {
          order_id: 'abc123',
        },
        method: 'POST',
        uri: '/returns/test',
      },
      0,
    );
  });

  it('should call channable api for returns:update', async () => {
    jest.mocked(ChannableRequest).mockResolvedValue([{ json: { foo: 'bar' } }]);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'update',
          projectId: 'projectId',
          id: 'abc123',
          status: 'accepted',
        })[parameterName],
    );
    await channable.execute.call(executeFunctions);

    expect(ChannableRequest).toHaveBeenCalledWith(
      executeFunctions,
      {
        body: {
          status: 'accepted',
        },
        method: 'POST',
        uri: '/returns/abc123/status',
      },
      0,
    );
  });
});
