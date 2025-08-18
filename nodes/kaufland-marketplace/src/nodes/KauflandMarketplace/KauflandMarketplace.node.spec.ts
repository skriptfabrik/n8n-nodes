import { type IExecuteFunctions, INodeTypeDescription } from 'n8n-workflow';
import { mockClear, mockDeep } from 'jest-mock-extended';
import { KauflandMarketplace } from './KauflandMarketplace.node';
import { kauflandMarketplaceRequest } from './GenericFunctions';

jest.mock('./GenericFunctions');

describe('Kaufland Marketplace', () => {
  const executeFunctions = mockDeep<IExecuteFunctions>({
    helpers: {
      returnJsonArray: jest.fn().mockReturnValue({ data: [] }),
    },
  });

  let kauflandMarketplaceProperties: INodeTypeDescription;

  let kauflandMarketplace: KauflandMarketplace;

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
    kauflandMarketplace = new KauflandMarketplace();
  });

  afterEach(() => {
    mockClear(kauflandMarketplaceRequest);
    mockClear(executeFunctions);
  });

  it('should be defined', () => {
    expect(kauflandMarketplace).toBeDefined();
  });

  it('should initialize with correct configuration', () => {
    kauflandMarketplaceProperties = kauflandMarketplace.description;
    expect(kauflandMarketplaceProperties.displayName).toBe(
      'Kaufland Marketplace',
    );
    expect(kauflandMarketplaceProperties.name).toBe('kauflandMarketplace');
    expect(kauflandMarketplaceProperties.group).toEqual(['transform']);
    expect(kauflandMarketplaceProperties.version).toBe(1);
    expect(kauflandMarketplaceProperties.documentationUrl).toBe(
      'https://sellerapi.kaufland.com/',
    );
  });

  it('should not call kaufland api for unknown resource', async () => {
    jest.mocked(kauflandMarketplaceRequest);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: '_unknown_',
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledTimes(0);
  });

  it('should not call kaufland api for resource orders and operation other than getOne', async () => {
    jest.mocked(kauflandMarketplaceRequest);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'orders',
          operation: '_unknown_',
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledTimes(0);
  });

  it('should call kaufland api for orders:getOne', async () => {
    jest.mocked(kauflandMarketplaceRequest).mockResolvedValue({ data: [] });

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'orders',
          operation: 'getOne',
          id: 'abc123',
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledWith(executeFunctions, {
      body: '',
      method: 'GET',
      uri: 'https://sellerapi.kaufland.com/v2/orders/abc123',
    });
  });

  it('should call kaufland api for orders:getAll', async () => {
    jest.mocked(kauflandMarketplaceRequest).mockResolvedValue({
      data: ['order1', 'order2'],
    });

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'orders',
          operation: 'getAll',
          limit: 10,
          offset: 0,
          includeFbk: false,
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledWith(executeFunctions, {
      method: 'GET',
      uri: 'https://sellerapi.kaufland.com/v2/orders',
      body: '',
      qs: {
        limit: 10,
        offset: 0,
      },
    });
  });

  it('should include FBK filter when includeFbk=true for orders:getAll', async () => {
    jest.mocked(kauflandMarketplaceRequest).mockResolvedValue({ data: [] });

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'orders',
          operation: 'getAll',
          limit: 5,
          offset: 2,
          includeFbk: true,
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledWith(executeFunctions, {
      method: 'GET',
      uri: 'https://sellerapi.kaufland.com/v2/orders',
      body: '',
      qs: {
        limit: 5,
        offset: 2,
        filter: 'fulfilment_type eq FBK',
      },
    });
  });

  it('should not call kaufland api for resource returns and operation a unknown operation', async () => {
    jest.mocked(kauflandMarketplaceRequest);

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: '_unknown_',
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledTimes(0);
  });

  it('should call kaufland api for returns:returningOrderUnits', async () => {
    jest.mocked(kauflandMarketplaceRequest).mockResolvedValue({ data: [] });

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'returningOrderUnits',
          orderUnits: [],
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledWith(executeFunctions, {
      body: [],
      method: 'POST',
      uri: 'https://sellerapi.kaufland.com/v2/returns',
    });
  });

  it('should call kaufland api for returns:retrievingReturnInformationStatus', async () => {
    jest.mocked(kauflandMarketplaceRequest).mockResolvedValue({ data: [] });

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'retrievingReturnInformationStatus',
          status: ['status'],
          query: '',
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledWith(executeFunctions, {
      body: '',
      method: 'GET',
      uri: 'https://sellerapi.kaufland.com/v2/returns?status=status',
    });
  });

  it('should call kaufland api for returns:retrievingReturnInformationTracking', async () => {
    jest.mocked(kauflandMarketplaceRequest).mockResolvedValue({ data: [] });

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'retrievingReturnInformationTracking',
          trackingcode: 'foobar',
          query: '',
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledWith(executeFunctions, {
      body: '',
      method: 'GET',
      uri: 'https://sellerapi.kaufland.com/v2/returns?tracking_code=foobar',
    });
  });

  it('should call kaufland api for returns:retrievingReturnInformationId', async () => {
    jest.mocked(kauflandMarketplaceRequest).mockResolvedValue({ data: [] });

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'retrievingReturnInformationId',
          returnId: 'foobar',
          embedReturnUnits: true,
          embedBuyer: true,
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledWith(executeFunctions, {
      body: '',
      method: 'GET',
      uri: 'https://sellerapi.kaufland.com/v2/returns/foobar?status=buyer&status=return_units',
    });
  });

  it('should call kaufland api for returns:retrievingReturnInformationId without embedReturnUnits and embedBuyer', async () => {
    jest.mocked(kauflandMarketplaceRequest).mockResolvedValue({ data: [] });

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'retrievingReturnInformationId',
          returnId: 'foobar',
          embedReturnUnits: false,
          embedBuyer: false,
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledWith(executeFunctions, {
      body: '',
      method: 'GET',
      uri: 'https://sellerapi.kaufland.com/v2/returns/foobar?',
    });
  });

  it('should call kaufland api for returns:clarifyingReturns', async () => {
    jest.mocked(kauflandMarketplaceRequest).mockResolvedValue({ data: [] });

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'clarifyingReturns',
          returnUnitId: 'foobar',
          message: 'my message',
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledWith(executeFunctions, {
      body: { message: 'my message' },
      method: 'PATCH',
      uri: 'https://sellerapi.kaufland.com/v2/return-units/foobar/clarify',
    });
  });

  it('should call kaufland api for returns:rejectingReturns', async () => {
    jest.mocked(kauflandMarketplaceRequest).mockResolvedValue({ data: [] });

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'rejectingReturns',
          returnUnitId: 'foobar',
          message: 'my message',
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledWith(executeFunctions, {
      body: { message: 'my message' },
      method: 'PATCH',
      uri: 'https://sellerapi.kaufland.com/v2/return-units/foobar/reject',
    });
  });

  it('should call kaufland api for returns:repairingReturns', async () => {
    jest.mocked(kauflandMarketplaceRequest).mockResolvedValue({ data: [] });

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'repairingReturns',
          returnUnitId: 'foobar',
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledWith(executeFunctions, {
      body: '',
      method: 'PATCH',
      uri: 'https://sellerapi.kaufland.com/v2/return-units/foobar/repair',
    });
  });

  it('should call kaufland api for returns:acceptingReturns', async () => {
    jest.mocked(kauflandMarketplaceRequest).mockResolvedValue({ data: [] });

    executeFunctions.getNodeParameter.mockImplementation(
      // @ts-expect-error function does not match a overload signature
      (parameterName: string) =>
        ({
          resource: 'returns',
          operation: 'acceptingReturns',
          returnUnitId: 'foobar',
        })[parameterName],
    );

    await kauflandMarketplace.execute.call(executeFunctions);

    expect(kauflandMarketplaceRequest).toHaveBeenCalledWith(executeFunctions, {
      body: '',
      method: 'PATCH',
      uri: 'https://sellerapi.kaufland.com/v2/return-units/foobar/accept',
    });
  });
});
