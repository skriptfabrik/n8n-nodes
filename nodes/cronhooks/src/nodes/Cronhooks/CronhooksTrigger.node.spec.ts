import { mockClear, mockDeep } from 'jest-mock-extended';
import {
  type ILoadOptionsFunctions,
  type IHookFunctions,
  type IWebhookFunctions,
  NodeApiError,
} from 'n8n-workflow';
import { CronhooksTrigger } from './CronhooksTrigger.node';
import {
  cronhooksApiRequest,
  cronhooksApiRequestAllItems,
} from './GenericFunctions';

jest.mock('./GenericFunctions');

describe('CronhooksTrigger', () => {
  const loadOptionsFunctions = mockDeep<ILoadOptionsFunctions>();
  const hookFunctions = mockDeep<IHookFunctions>();
  const webhookFunctions = mockDeep<IWebhookFunctions>();

  let cronhooksTrigger: CronhooksTrigger;

  beforeEach(() => {
    cronhooksTrigger = new CronhooksTrigger();
  });

  afterEach(() => {
    mockClear(loadOptionsFunctions);
    mockClear(hookFunctions);
    mockClear(webhookFunctions);
  });

  it('should be defined', () => {
    expect(cronhooksTrigger).toBeDefined();
  });

  it('should retrieve all groups', () => {
    jest.mocked(cronhooksApiRequestAllItems).mockResolvedValue([
      {
        name: 'Group 1',
        id: '3a11c05f-fe4b-15f1-46ff-d5efc4e512ae',
      },
    ]);

    expect(
      cronhooksTrigger.methods.loadOptions.getGroups.call(loadOptionsFunctions),
    ).resolves.toStrictEqual([
      { name: 'None', value: 'none' },
      { name: 'Group 1', value: '3a11c05f-fe4b-15f1-46ff-d5efc4e512ae' },
    ]);
  });

  it('should throw an error when retrieving all groups', () => {
    jest.mocked(cronhooksApiRequestAllItems).mockRejectedValueOnce('_error_');

    expect(
      cronhooksTrigger.methods.loadOptions.getGroups.call(loadOptionsFunctions),
    ).rejects.toBeInstanceOf(NodeApiError);
  });

  it('should check that a webhook exists', () => {
    const callbackUrl =
      'http://localhost:5678/webhook/c940f948-0c2e-4cba-9d47-1b38790d77bb';
    const staticData: { scheduleId?: string } = {};

    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(callbackUrl);

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    jest.mocked(cronhooksApiRequestAllItems).mockResolvedValue([
      {
        url: callbackUrl,
        headers: {
          'x-cronhooks-token': '43c983a2ab084b8c75f3dfa6a60dbb16',
        },
        name: 'Schedule',
        id: 'b9753da1-3e57-4c98-86f4-acada6226e09',
        created: '2024-01-29T13:19:44.453Z',
      },
    ]);

    expect(
      cronhooksTrigger.webhookMethods.default.checkExists.call(hookFunctions),
    ).resolves.toBe(true);
  });

  it('should check that a webhook does not exist', () => {
    const callbackUrl =
      'http://localhost:5678/webhook/c940f948-0c2e-4cba-9d47-1b38790d77bb';
    const staticData: { scheduleId?: string } = {};

    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(callbackUrl);

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    jest.mocked(cronhooksApiRequestAllItems).mockResolvedValue([
      {
        url: 'http://localhost:5678/webhook/5e632a06-6a4c-4372-a4e0-30afe130dbae',
        headers: {
          'x-cronhooks-token': '43c983a2ab084b8c75f3dfa6a60dbb16',
        },
        name: 'Schedule',
        id: 'b9753da1-3e57-4c98-86f4-acada6226e09',
        created: '2024-01-29T13:19:44.453Z',
      },
    ]);

    expect(
      cronhooksTrigger.webhookMethods.default.checkExists.call(hookFunctions),
    ).resolves.toBe(false);
  });

  it.each([
    { groupNodeParameter: undefined },
    { groupNodeParameter: '_group_' },
  ])('should create a webhook', ({ groupNodeParameter }) => {
    const callbackUrl =
      'http://localhost:5678/webhook/c940f948-0c2e-4cba-9d47-1b38790d77bb';
    const event = 'ORDER_CREATED';
    const credentials = { webhookToken: '43c983a2ab084b8c75f3dfa6a60dbb16' };
    const staticData: { scheduleId?: string } = {};

    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(callbackUrl);

    hookFunctions.getNodeParameter.calledWith('event').mockReturnValue(event);

    hookFunctions.getNodeParameter
      .calledWith('group')
      .mockReturnValue(groupNodeParameter);

    hookFunctions.getCredentials
      .calledWith('cronhooksApi')
      .mockResolvedValue(credentials);

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    jest.mocked(cronhooksApiRequest).mockResolvedValue({
      url: 'http://localhost:5678/webhook/5e632a06-6a4c-4372-a4e0-30afe130dbae',
      headers: {
        'x-cronhooks-token': '43c983a2ab084b8c75f3dfa6a60dbb16',
      },
      name: 'Schedule',
      id: 'b9753da1-3e57-4c98-86f4-acada6226e09',
      created: '2024-01-29T13:19:44.453Z',
      lastModified: '2024-01-29T13:19:44.453Z',
    });

    expect(
      cronhooksTrigger.webhookMethods.default.create.call(hookFunctions),
    ).resolves.toBe(true);
  });

  it('should not create a webhook', () => {
    const callbackUrl =
      'http://localhost:5678/webhook/c940f948-0c2e-4cba-9d47-1b38790d77bb';
    const credentials = { webhookToken: '43c983a2ab084b8c75f3dfa6a60dbb16' };
    const staticData: { schedule?: string } = {};

    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(callbackUrl);

    hookFunctions.getCredentials
      .calledWith('cronhooksApi')
      .mockResolvedValue(credentials);

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    jest.mocked(cronhooksApiRequest).mockResolvedValue({
      url: 'http://localhost:5678/webhook/5e632a06-6a4c-4372-a4e0-30afe130dbae',
      headers: {
        'x-cronhooks-token': '43c983a2ab084b8c75f3dfa6a60dbb16',
      },
      name: 'Schedule',
      id: undefined,
      created: '2024-01-29T13:19:44.453Z',
      lastModified: '2024-01-29T13:19:44.453Z',
    });

    expect(
      cronhooksTrigger.webhookMethods.default.create.call(hookFunctions),
    ).resolves.toBe(false);
  });

  it('should delete a webhook', () => {
    const staticData: { scheduleId?: string } = {};

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    expect(
      cronhooksTrigger.webhookMethods.default.delete.call(hookFunctions),
    ).resolves.toBe(true);
  });

  it('should delete a webhook in the API', () => {
    const staticData: { scheduleId?: string } = {
      scheduleId: 'b9753da1-3e57-4c98-86f4-acada6226e09',
    };

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    jest.mocked(cronhooksApiRequest).mockResolvedValue({
      url: 'http://localhost:5678/webhook/5e632a06-6a4c-4372-a4e0-30afe130dbae',
      headers: {
        'x-cronhooks-token': '43c983a2ab084b8c75f3dfa6a60dbb16',
      },
      name: 'Schedule',
      id: 'b9753da1-3e57-4c98-86f4-acada6226e09',
      created: '2024-01-29T13:19:44.453Z',
      lastModified: '2024-01-29T13:19:44.453Z',
    });

    expect(
      cronhooksTrigger.webhookMethods.default.delete.call(hookFunctions),
    ).resolves.toBe(true);
  });

  it('should not delete a webhook in the API', () => {
    const staticData: { scheduleId?: string } = {
      scheduleId: 'b9753da1-3e57-4c98-86f4-acada6226e09',
    };

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    jest.mocked(cronhooksApiRequest).mockRejectedValue(new Error());

    expect(
      cronhooksTrigger.webhookMethods.default.delete.call(hookFunctions),
    ).resolves.toBe(false);
  });

  it('should not provide workflow data when signature does not match', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'cronhooks-signature':
        '821f6f8386fd33e6706c626b73ad4d4bcc0af5543585058a38b51af3e17000bc',
    });

    webhookFunctions.getBodyData.mockReturnValue({
      cronhook: {
        GroupId: '3a11c05f-fe4b-15f1-46ff-d5efc4e512ae',
        OrganizationId: '3a11c029-6fc2-b59f-9ddd-ed4722952bd5',
        Title: 'Sync Stock Changes from Store Sales 2 FFT',
        Url: 'https://{{N8N_HOST}}/webhook/1d167455-52dd-48f3-9306-759f0fd91ecb',
        Timezone: 'Europe/Berlin',
        Method: 'POST',
        Headers: '{"Authorization":"Bearer {{N8N_WEBHOOK_TOKEN}}"}',
        Payload: '',
        ContentType: 'application/json; charset=utf-8',
        IsRecurring: true,
        IsPaused: false,
        CronExpression: '*/5 * * * *',
        Status: 'succeeded',
        ErrorMessage: null,
        RunAt: '2024-04-15T17:55:00Z',
        NextRunAt: '2024-04-15T17:55:00Z',
        LastRunAt: '2024-04-15T17:50:13.403638Z',
        JobId: 'cronhooks-3a11ddd0-352d-000a-4e5c-25de423dd19a',
        SendCronhookObject: true,
        Tags: null,
        SendFailureAlert: true,
        RetryCount: 0,
        RetryIntervalSeconds: null,
        StartsAt: null,
        EndsAt: null,
        LastModificationTime: '2024-04-15T17:50:13.408292Z',
        LastModifierId: null,
        CreationTime: '2024-04-11T05:31:04.911694Z',
        CreatorId: '3a11c02c-c644-4526-c521-ceddf808e306',
        ExtraProperties: {
          retryAttempt: 0,
        },
        ConcurrencyStamp: 'cf4ac6bfe7d94d14a4f9a51234f6e158',
        Id: '3a11ddd0-352d-000a-4e5c-25de423dd19a',
      },
    });

    webhookFunctions.getCredentials
      .calledWith('cronhooksApi')
      .mockResolvedValue({
        webhookSecret: 'wh_97baf994c4274f8e8cdb0a2fd3afa12c',
      });

    expect(cronhooksTrigger.webhook.call(webhookFunctions)).resolves.toEqual(
      {},
    );
  });

  it('should provide workflow data', () => {
    const body = {
      cronhook: {
        GroupId: '3a11c05f-fe4b-15f1-46ff-d5efc4e512ae',
        OrganizationId: '3a11c029-6fc2-b59f-9ddd-ed4722952bd5',
        Title: 'Sync Stock Changes from Store Sales 2 FFT',
        Url: 'https://{{N8N_HOST}}/webhook/1d167455-52dd-48f3-9306-759f0fd91ecb',
        Timezone: 'Europe/Berlin',
        Method: 'POST',
        Headers: '{"Authorization":"Bearer {{N8N_WEBHOOK_TOKEN}}"}',
        Payload: '',
        ContentType: 'application/json; charset=utf-8',
        IsRecurring: true,
        IsPaused: false,
        CronExpression: '*/5 * * * *',
        Status: 'succeeded',
        ErrorMessage: null,
        RunAt: '2024-04-15T17:55:00Z',
        NextRunAt: '2024-04-15T17:55:00Z',
        LastRunAt: '2024-04-15T17:50:13.403638Z',
        JobId: 'cronhooks-3a11ddd0-352d-000a-4e5c-25de423dd19a',
        SendCronhookObject: true,
        Tags: null,
        SendFailureAlert: true,
        RetryCount: 0,
        RetryIntervalSeconds: null,
        StartsAt: null,
        EndsAt: null,
        LastModificationTime: '2024-04-15T17:50:13.408292Z',
        LastModifierId: null,
        CreationTime: '2024-04-11T05:31:04.911694Z',
        CreatorId: '3a11c02c-c644-4526-c521-ceddf808e306',
        ExtraProperties: {
          retryAttempt: 0,
        },
        ConcurrencyStamp: 'cf4ac6bfe7d94d14a4f9a51234f6e158',
        Id: '3a11ddd0-352d-000a-4e5c-25de423dd19a',
      },
    };
    const jsonArray = [{ json: body }];

    webhookFunctions.getHeaderData.mockReturnValue({
      'cronhooks-signature':
        '821f6f8386fd33e6706c356b73ad4d4bcc0af5543585058a38b51af3e17000ea',
    });
    webhookFunctions.getBodyData.mockReturnValue(body);

    webhookFunctions.getCredentials
      .calledWith('cronhooksApi')
      .mockResolvedValue({
        webhookSecret: 'wh_97baf994c4274f8e8cdb0a2fd3afa12c',
      });

    webhookFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    expect(cronhooksTrigger.webhook.call(webhookFunctions)).resolves.toEqual({
      workflowData: [jsonArray],
    });
  });
});
