import {
  KauflandRequestData,
  kauflandMarketplaceRequest,
} from './GenericFunctions';
import { mockDeep } from 'jest-mock-extended';
import { IExecuteFunctions } from 'n8n-workflow';

describe('Kaufland Marketplace Request', () => {
  let instance: IExecuteFunctions;

  it('should be defined', () => {
    expect(kauflandMarketplaceRequest).toBeDefined();
  });

  it('should not create a paginated request', async () => {
    instance = mockDeep<IExecuteFunctions>({
      getCredentials: jest.fn().mockResolvedValue({
        clientId: 'testClientId',
        clientSecret: 'testClientSecret',
      }),
      helpers: {
        requestWithAuthentication: jest.fn().mockResolvedValueOnce({
          data: ['item 1', 'item 2'],
        }),
      },
    });

    const requestData: KauflandRequestData = {
      method: 'POST',
      uri: `https://sellerapi.kaufland.com/v2/returns`,
      body: [],
    };

    expect(
      await kauflandMarketplaceRequest(instance, requestData),
    ).toStrictEqual({ data: ['item 1', 'item 2'] });
  });

  it('should create a paginated request', async () => {
    instance = mockDeep<IExecuteFunctions>({
      getCredentials: jest.fn().mockResolvedValue({
        clientId: 'testClientId',
        clientSecret: 'testClientSecret',
      }),
      helpers: {
        requestWithAuthentication: jest
          .fn()
          .mockResolvedValueOnce({
            data: ['item 1', 'item 2'],
            pagination: {
              offset: 0,
              limit: 2,
              total: 3,
            },
          })
          .mockResolvedValueOnce({
            data: ['item 3'],
            pagination: {
              offset: 2,
              limit: 2,
              total: 3,
            },
          }),
      },
    });

    const requestData: KauflandRequestData = {
      method: 'POST',
      uri: `https://sellerapi.kaufland.com/v2/returns`,
      body: [],
    };

    expect(
      await kauflandMarketplaceRequest(instance, requestData),
    ).toStrictEqual({ data: ['item 1', 'item 2', 'item 3'] });
  });

  it('should create a paginated request with get parameters', async () => {
    instance = mockDeep<IExecuteFunctions>({
      getCredentials: jest.fn().mockResolvedValue({
        clientId: 'testClientId',
        clientSecret: 'testClientSecret',
      }),
      helpers: {
        requestWithAuthentication: jest
          .fn()
          .mockResolvedValueOnce({
            data: ['item 1', 'item 2'],
            pagination: {
              offset: 0,
              limit: 2,
              total: 3,
            },
          })
          .mockResolvedValueOnce({
            data: ['item 3'],
            pagination: {
              offset: 2,
              limit: 2,
              total: 3,
            },
          }),
      },
    });

    const requestData: KauflandRequestData = {
      method: 'POST',
      uri: `https://sellerapi.kaufland.com/v2/returns?foo=bar`,
      body: [],
    };

    expect(
      await kauflandMarketplaceRequest(instance, requestData, 2),
    ).toStrictEqual({ data: ['item 1', 'item 2', 'item 3'] });
  });

  it('should throw an error', async () => {
    instance = mockDeep<IExecuteFunctions>({
      getCredentials: jest.fn().mockResolvedValue({
        clientId: 'testClientId',
        clientSecret: 'testClientSecret',
      }),
      helpers: {
        requestWithAuthentication: jest
          .fn()
          .mockRejectedValueOnce(new Error('an error occured')),
      },
    });

    const requestData: KauflandRequestData = {
      method: 'GET',
      uri: `/v2/returns`,
      body: '',
    };

    await expect(
      kauflandMarketplaceRequest(instance, requestData, 1),
    ).rejects.toThrow();
  });

  it('should fetch all pages when pagination indicates more data', async () => {
    const firstPage = {
      data: [{ foo: 1 }],
      pagination: { offset: 0, limit: 1, total: 2 },
    };
    const secondPage = {
      data: [{ foo: 2 }],
      pagination: { offset: 1, limit: 1, total: 2 },
    };

    const instance = mockDeep<IExecuteFunctions>({
      getCredentials: jest.fn().mockResolvedValue({
        clientId: 'testClientId',
        clientSecret: 'testClientSecret',
      }),
      helpers: {
        requestWithAuthentication: jest
          .fn()
          .mockResolvedValueOnce(firstPage)
          .mockResolvedValueOnce(secondPage),
      },
    });

    const requestData: KauflandRequestData = {
      method: 'GET',
      uri: `/v2/test`,
      body: '',
      // no qs so it uses default
    };

    const expected = [...firstPage.data, ...secondPage.data];
    const result = await kauflandMarketplaceRequest(instance, requestData);

    expect(result.data).toStrictEqual(expected);
  });

  it('handles an undefined response safely', async () => {
    const instance = mockDeep<IExecuteFunctions>({
      getCredentials: jest.fn().mockResolvedValue({
        clientId: 'testClientId',
        clientSecret: 'testClientSecret',
      }),

      helpers: {
        requestWithAuthentication: jest
          .fn()
          .mockResolvedValueOnce(undefined as any),
      },
    });
    const result = await kauflandMarketplaceRequest(instance, {
      method: 'GET',
      uri: '/v2/foo',
      body: '',
    });

    expect(result).toEqual(undefined);
  });
});
