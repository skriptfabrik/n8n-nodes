import { ChannableRequest, ChannableRequestData } from './GenericFunctions';
import { mockDeep } from 'jest-mock-extended';
import { IExecuteFunctions, INode, NodeOperationError } from 'n8n-workflow';
describe('ChannableRequest', () => {
  let instance: IExecuteFunctions;
  beforeAll(() => {
    instance = mockDeep<IExecuteFunctions>({
      helpers: {},
      getCredentials: jest.fn().mockResolvedValue({
        projectId: 'projectIdCredential',
        companyId: 'companyId',
        accessToken: 'accessToken',
      }),
      getNodeParameter: jest
        .fn()
        .mockReturnValueOnce('projectIdParam')
        .mockReturnValue(''),
    });
  });

  it('should be defined', () => {
    expect(ChannableRequest).toBeDefined();
  });

  it('should create a paginated request with projectId as param', async () => {
    instance.helpers.requestWithAuthenticationPaginated = jest
      .fn()
      .mockResolvedValueOnce([
        {
          body: {
            orders: [
              {
                id: 'uuid',
              },
            ],
            total: 128,
          },
        },
      ]);
    const requestData: ChannableRequestData = {
      method: 'GET',
      uri: `/v2/returns`,
      body: '',
    };
    expect(await ChannableRequest(instance, requestData, 1)).toEqual([
      { orders: [{ id: 'uuid' }], total: 128 },
    ]);
  });

  it('should create a paginated request without projectId as param', async () => {
    instance.helpers.requestWithAuthenticationPaginated = jest
      .fn()
      .mockResolvedValueOnce([
        {
          body: {
            orders: [
              {
                id: 'uuid',
              },
            ],
            total: 128,
          },
        },
      ]);
    const requestData: ChannableRequestData = {
      method: 'GET',
      uri: `/v2/returns`,
      body: '',
    };
    expect(await ChannableRequest(instance, requestData, 1)).toEqual([
      { orders: [{ id: 'uuid' }], total: 128 },
    ]);
  });

  it('should throw an error on statuscode >400', async () => {
    instance.helpers.requestWithAuthenticationPaginated = jest
      .fn()
      .mockResolvedValueOnce([
        {
          statusCode: 403,
          body: {
            error: 'an error occured',
          },
        },
      ]);
    const requestData: ChannableRequestData = {
      method: 'GET',
      uri: `/v2/returns`,
      body: '',
    };
    await expect(ChannableRequest(instance, requestData, 1)).rejects.toThrow();
  });

  it('should throw an error', async () => {
    instance.helpers.requestWithAuthenticationPaginated = jest
      .fn()
      .mockRejectedValueOnce(
        new NodeOperationError(mockDeep<INode>(), 'an error occured'),
      );
    const requestData: ChannableRequestData = {
      method: 'GET',
      uri: `/v2/returns`,
      body: '',
    };
    await expect(ChannableRequest(instance, requestData, 1)).rejects.toThrow();
  });
});
