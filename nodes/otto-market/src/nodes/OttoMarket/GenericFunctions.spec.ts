import { OttoMarketRequest, OttoMarketRequestData } from './GenericFunctions';
import { mockDeep } from 'jest-mock-extended';
import { IExecuteFunctions } from 'n8n-workflow';
describe('OttoMarket', () => {
  let instance: IExecuteFunctions;

  it('should be defined', () => {
    expect(OttoMarketRequest).toBeDefined();
  });
  it('should create a paginated request', async () => {
    instance = mockDeep<IExecuteFunctions>({
      helpers: {
        requestWithAuthenticationPaginated: jest.fn().mockResolvedValueOnce([
          {
            body: {
              resources: [
                {
                  salesOrderId: 'uuid',
                },
              ],
              links: [
                {
                  rel: 'next',
                  href: '/next',
                },
              ],
            },
          },
        ]),
      },
    });
    const requestData: OttoMarketRequestData = {
      method: 'GET',
      uri: `/v2/returns`,
      body: '',
    };
    expect(await OttoMarketRequest(instance, requestData, 1)).toEqual([
      {
        resources: [
          {
            salesOrderId: 'uuid',
          },
        ],
        links: [
          {
            rel: 'next',
            href: '/next',
          },
        ],
      },
    ]);
  });

  it('should throw an error on statuscode >400', async () => {
    instance = mockDeep<IExecuteFunctions>({
      helpers: {
        requestWithAuthenticationPaginated: jest.fn().mockResolvedValueOnce([
          {
            statusCode: 403,
            body: {
              error: 'an error occured',
            },
          },
        ]),
      },
    });
    const requestData: OttoMarketRequestData = {
      method: 'GET',
      uri: `/v2/returns`,
      body: '',
    };
    await expect(OttoMarketRequest(instance, requestData, 1)).rejects.toThrow();
  });
});
