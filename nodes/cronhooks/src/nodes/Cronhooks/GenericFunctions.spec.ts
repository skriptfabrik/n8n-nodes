import { mockClear, mockDeep } from 'jest-mock-extended';
import { type IExecuteFunctions } from 'n8n-workflow';
import {
  cronhooksApiRequest,
  cronhooksApiRequestAllItems,
} from './GenericFunctions';

describe('GenericFunctions', () => {
  const executeFunctions = mockDeep<IExecuteFunctions>();

  afterEach(() => {
    mockClear(executeFunctions);
  });

  it('should make an API request', () => {
    const responseData = {
      status: 'UP',
      dependencies: [
        {
          name: 'database',
          status: 'UP',
        },
      ],
    };

    executeFunctions.helpers.requestWithAuthentication
      .calledWith('cronhooksApi', expect.any(Object))
      .mockResolvedValue(responseData);

    expect(
      cronhooksApiRequest.call(executeFunctions, 'GET', '/health'),
    ).resolves.toEqual(responseData);
  });

  it('should make an API request to get all items', () => {
    const responseData = [
      {
        id: '3a012d1f-fe83-4855-2860-84f8a85e154c',
        groupId: '3a0136ac-123f-c222-5b2d-ae5b0c5937a6',
        title: 'Send email to inactive users',
        description:
          'Send an email to users who are inactive for more than 60 days and offer a discount for upgrading subscriptions.',
        url: 'https://example.com/webhooks/inactive-email',
        timezone: 'asia/karachi',
        method: 'POST',
        headers: {
          additionalProp1: 'string',
          additionalProp2: 'string',
          additionalProp3: 'string',
        },
        contentType: 'application/json; charset=utf-8',
        status: 'scheduled',
        errorMessage: '',
        isRecurring: false,
        cronExpression: '',
        runAt: '2019-02-01T12:48:26.983',
        sendCronhookObject: true,
        sendFailureAlert: true,
        startsAt: '2023-02-01T13:00:00',
        endsAt: '2023-03-01T13:00:00',
        retryCount: '3',
        retryIntervalSeconds: '5',
        creationTime: '2019-02-01T09:35:27.568Z',
        lastModificationTime: '2019-02-01T09:35:27.568Z',
      },
    ];

    executeFunctions.helpers.requestWithAuthentication
      .calledWith('cronhooksApi', expect.any(Object))
      .mockResolvedValueOnce({ items: responseData })
      .mockResolvedValueOnce({ items: [] });

    expect(
      cronhooksApiRequestAllItems.call(executeFunctions, 'GET', '/schedules'),
    ).resolves.toEqual(responseData);
  });
});
