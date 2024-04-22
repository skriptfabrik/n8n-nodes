import { type IHttpRequestHelper } from 'n8n-workflow';
import { mockClear, mockDeep } from 'jest-mock-extended';
import { CronhooksApi } from './CronhooksApi.credentials';

describe('CronhooksApi', () => {
  const httpRequestHelper = mockDeep<IHttpRequestHelper>({});

  let cronhooksApi: CronhooksApi;

  beforeEach(() => {
    cronhooksApi = new CronhooksApi();
  });

  afterEach(() => {
    mockClear(httpRequestHelper);
  });

  it('should be defined', () => {
    expect(cronhooksApi).toBeDefined();
  });
});
