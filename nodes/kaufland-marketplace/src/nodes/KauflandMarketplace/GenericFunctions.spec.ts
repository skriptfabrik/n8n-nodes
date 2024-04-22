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
});
