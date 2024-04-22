import { mockClear, mockDeep } from 'jest-mock-extended';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError, sleep } from 'n8n-workflow';
import {
  fulfillmenttoolsApiRequest,
  fulfillmenttoolsApiRequestAllItems,
} from './GenericFunctions';

jest.mock('n8n-workflow');

describe('GenericFunctions', () => {
  const executeFunctions = mockDeep<IExecuteFunctions>();
  const mockedSleep = jest.mocked(sleep);

  afterEach(() => {
    mockClear(executeFunctions);
    mockClear(mockedSleep);
  });

  it('should make a simple API request', () => {
    const body = {
      status: 'UP',
      dependencies: [
        {
          name: 'database',
          status: 'UP',
        },
      ],
    };

    const responses = [{ body, statusCode: 200 }];

    executeFunctions.getCredentials
      .calledWith('fulfillmenttoolsApi')
      .mockResolvedValue({ subDomain: '_example_' });
    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('fulfillmenttoolsApi', expect.any(Object))
      .mockImplementation(() => Promise.resolve(responses.shift()));

    expect(
      fulfillmenttoolsApiRequest.call(executeFunctions, 'GET', '/health'),
    ).resolves.toEqual(body);
  });

  it('should make a second API request because of version missmatch', () => {
    const body = {
      version: 3,
    };

    const responses = [
      { body: [{ version: 2 }], statusCode: 409 },
      { body, statusCode: 200 },
    ];

    executeFunctions.getCredentials
      .calledWith('fulfillmenttoolsApi')
      .mockResolvedValue({ subDomain: '_example_' });
    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('fulfillmenttoolsApi', expect.any(Object))
      .mockImplementation(() => Promise.resolve(responses.shift()));

    expect(
      fulfillmenttoolsApiRequest.call(executeFunctions, 'POST', '/example', {
        version: 1,
      }),
    ).resolves.toEqual(body);
  });

  it('should make a second API request because of too many requests', () => {
    const body = {
      version: 3,
    };

    const responses = [
      { body: [], statusCode: 429 },
      { body, statusCode: 200 },
    ];

    executeFunctions.getCredentials
      .calledWith('fulfillmenttoolsApi')
      .mockResolvedValue({ subDomain: '_example_' });
    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('fulfillmenttoolsApi', expect.any(Object))
      .mockImplementation(() => Promise.resolve(responses.shift()));

    expect(
      fulfillmenttoolsApiRequest.call(executeFunctions, 'POST', '/example', {
        version: 1,
      }),
    ).resolves.toEqual(body);
  });

  it('should throw immediatly because of invalid input', () => {
    const responses = [
      { body: [{ summary: 'Invalid input' }], statusCode: 400 },
    ];

    executeFunctions.getCredentials
      .calledWith('fulfillmenttoolsApi')
      .mockResolvedValue({ subDomain: '_example_' });
    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('fulfillmenttoolsApi', expect.any(Object))
      .mockImplementation(() => Promise.resolve(responses.shift()));

    expect(
      fulfillmenttoolsApiRequest.call(executeFunctions, 'POST', '/example', {
        version: 1,
      }),
    ).rejects.toBeInstanceOf(NodeApiError);
  });

  it('should throw immediatly because of version missmatch without version in response', () => {
    const responses = [
      {
        body: [{ summary: 'Conflict while processing something' }],
        statusCode: 409,
      },
    ];

    executeFunctions.getCredentials
      .calledWith('fulfillmenttoolsApi')
      .mockResolvedValue({ subDomain: '_example_' });
    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('fulfillmenttoolsApi', expect.any(Object))
      .mockImplementation(() => Promise.resolve(responses.shift()));

    expect(
      fulfillmenttoolsApiRequest.call(executeFunctions, 'POST', '/example', {
        version: 1,
      }),
    ).rejects.toBeInstanceOf(NodeApiError);
  });

  it('should throw after 2 retries because of version missmatch', () => {
    const responses = [
      { body: [{ version: 2 }], statusCode: 409 },
      { body: [{ version: 2 }], statusCode: 409 },
    ];

    executeFunctions.getCredentials
      .calledWith('fulfillmenttoolsApi')
      .mockResolvedValue({ subDomain: '_example_' });
    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('fulfillmenttoolsApi', expect.any(Object))
      .mockImplementation(() => Promise.resolve(responses.shift()));

    expect(
      fulfillmenttoolsApiRequest.call(executeFunctions, 'POST', '/example', {
        version: 1,
      }),
    ).rejects.toBeInstanceOf(NodeApiError);
  });

  it('should throw after 9 retries because of too many requests', () => {
    const responses = [
      { body: [], statusCode: 429 },
      { body: [], statusCode: 429 },
      { body: [], statusCode: 429 },
      { body: [], statusCode: 429 },
      { body: [], statusCode: 429 },
      { body: [], statusCode: 429 },
      { body: [], statusCode: 429 },
      { body: [], statusCode: 429 },
      { body: [], statusCode: 429 },
    ];

    executeFunctions.getCredentials
      .calledWith('fulfillmenttoolsApi')
      .mockResolvedValue({ subDomain: '_example_' });
    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('fulfillmenttoolsApi', expect.any(Object))
      .mockImplementation(() => Promise.resolve(responses.shift()));

    expect(
      fulfillmenttoolsApiRequest.call(executeFunctions, 'POST', '/example', {
        version: 1,
      }),
    ).rejects.toBeInstanceOf(NodeApiError);
  });

  it('should make an API request to get all items', () => {
    const body = [
      {
        id: '005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
        created: '2023-11-02T13:14:22.443Z',
        lastModified: '2023-11-02T13:14:22.443Z',
        orderDate: '2023-11-02T13:14:20.631Z',
        version: 1,
        status: 'OPEN',
        orderLineItems: [
          {
            quantity: 1,
            title: 'Longsleeve in mehrfarbigem Streifendesign',
          },
        ],
      },
    ];

    const responses = [
      { body, statusCode: 200 },
      { body: [], statusCode: 200 },
    ];

    executeFunctions.getCredentials
      .calledWith('fulfillmenttoolsApi')
      .mockResolvedValue({ subDomain: '_example_' });
    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('fulfillmenttoolsApi', expect.any(Object))
      .mockImplementation(() => Promise.resolve(responses.shift()));

    expect(
      fulfillmenttoolsApiRequestAllItems.call(
        executeFunctions,
        undefined,
        'GET',
        '/orders',
      ),
    ).resolves.toEqual(body);
  });

  it('should make an API request to get some items', () => {
    const body = {
      orders: [
        {
          id: '005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
          created: '2023-11-02T13:14:22.443Z',
          lastModified: '2023-11-02T13:14:22.443Z',
          orderDate: '2023-11-02T13:14:20.631Z',
          version: 1,
          status: 'OPEN',
          orderLineItems: [
            {
              quantity: 1,
              title: 'Longsleeve in mehrfarbigem Streifendesign',
            },
          ],
        },
        {
          id: '005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
          created: '2023-11-02T13:14:22.443Z',
          lastModified: '2023-11-02T13:14:22.443Z',
          orderDate: '2023-11-02T13:14:20.631Z',
          version: 1,
          status: 'OPEN',
          orderLineItems: [
            {
              quantity: 1,
              title: 'Longsleeve in mehrfarbigem Streifendesign',
            },
          ],
        },
      ],
      total: 2,
    };

    const responses = [
      { body, statusCode: 200 },
      { body: { orders: [], total: 0 }, statusCode: 200 },
    ];

    executeFunctions.getCredentials
      .calledWith('fulfillmenttoolsApi')
      .mockResolvedValue({ subDomain: '_example_' });
    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('fulfillmenttoolsApi', expect.any(Object))
      .mockImplementation(() => Promise.resolve(responses.shift()));

    expect(
      fulfillmenttoolsApiRequestAllItems.call(
        executeFunctions,
        'orders',
        'GET',
        '/orders',
        undefined,
        { limit: 1 },
      ),
    ).resolves.toEqual([body.orders[0]]);
  });
});
