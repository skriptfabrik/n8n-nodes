import { Hmac, createHmac } from 'crypto';
import type { Request } from 'express';
import { mock, mockClear, mockDeep } from 'jest-mock-extended';
import type {
  IHookFunctions,
  ILoadOptionsFunctions,
  IWebhookFunctions,
} from 'n8n-workflow';
import { mocoApiRequest, mocoApiRequestAllItems } from './GenericFunctions';
import { MocoTrigger } from './MocoTrigger.node';

jest.mock('crypto');
jest.mock('./GenericFunctions');

describe('MocoTrigger', () => {
  const hookFunctions = mockDeep<IHookFunctions>();
  const loadOptionsFunctions = mockDeep<ILoadOptionsFunctions>();
  const webhookFunctions = mockDeep<IWebhookFunctions>();
  const mockedApiRequest = jest.mocked(mocoApiRequest);
  const mockedApiRequestAllItems = jest.mocked(mocoApiRequestAllItems);
  const mockedCreateHmac = jest.mocked(createHmac);

  let trigger: MocoTrigger;

  beforeEach(() => {
    trigger = new MocoTrigger();
  });

  afterEach(() => {
    mockClear(hookFunctions);
    mockClear(loadOptionsFunctions);
    mockClear(webhookFunctions);
    mockClear(mockedApiRequest);
    mockClear(mockedApiRequestAllItems);
    mockClear(mockedCreateHmac);
  });

  it('should be defined', () => {
    expect(trigger).toBeDefined();
  });

  it('should check that a webhook exists', async () => {
    const staticData: { hookId?: string } = {
      hookId: undefined,
    };

    mockedApiRequestAllItems.mockResolvedValue([
      {
        id: 123,
        target: 'Activity',
        event: 'create',
        hook: 'http://localhost:5678/webhook/985dc3e9-b382-4dd0-922e-0ceee97023e9',
        disabled: false,
        disabled_at: null,
        created_at: '2018-10-17T09:33:46Z',
        updated_at: '2018-10-17T09:33:46Z',
      },
    ]);
    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(
        'http://localhost:5678/webhook/985dc3e9-b382-4dd0-922e-0ceee97023e9',
      );
    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    expect(
      trigger.webhookMethods.default.checkExists.call(hookFunctions),
    ).resolves.toBe(true);

    expect(mockedApiRequestAllItems).toHaveBeenCalledWith(
      undefined,
      'GET',
      '/account/web_hooks',
    );

    await new Promise(process.nextTick);

    expect(staticData.hookId).toBe(123);
  });

  it('should check that a webhook does not exist', async () => {
    const staticData: { hookId?: string } = {
      hookId: undefined,
    };

    mockedApiRequestAllItems.mockResolvedValue([
      {
        id: 123,
        target: 'Activity',
        event: 'create',
        hook: 'http://localhost:5678/webhook/67f02646-ee9c-4d5e-97bd-5fa6218dbdd0',
        disabled: false,
        disabled_at: null,
        created_at: '2018-10-17T09:33:46Z',
        updated_at: '2018-10-17T09:33:46Z',
      },
    ]);
    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(
        'http://localhost:5678/webhook/985dc3e9-b382-4dd0-922e-0ceee97023e9',
      );
    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    expect(
      trigger.webhookMethods.default.checkExists.call(hookFunctions),
    ).resolves.toBe(false);

    expect(mockedApiRequestAllItems).toHaveBeenCalledWith(
      undefined,
      'GET',
      '/account/web_hooks',
    );

    await new Promise(process.nextTick);

    expect(staticData.hookId).toBeUndefined();
  });

  it('should create webhook', async () => {
    const staticData: { hookId?: string } = {
      hookId: undefined,
    };

    hookFunctions.getNodeParameter
      .calledWith('triggerOn')
      .mockReturnValue('Activity/create');
    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(
        'http://localhost:5678/webhook/985dc3e9-b382-4dd0-922e-0ceee97023e9',
      );
    mockedApiRequest.mockResolvedValue({
      id: 123,
      target: 'Activity',
      event: 'create',
      hook: 'http://localhost:5678/webhook/985dc3e9-b382-4dd0-922e-0ceee97023e9',
      disabled: false,
      disabled_at: null,
      created_at: '2018-10-17T09:33:46Z',
      updated_at: '2018-10-17T09:33:46Z',
    });
    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    expect(
      trigger.webhookMethods.default.create.call(hookFunctions),
    ).resolves.toBe(true);

    expect(mockedApiRequest).toHaveBeenCalledWith(
      undefined,
      'POST',
      '/account/web_hooks',
      {
        body: {
          target: 'Activity',
          event: 'create',
          hook: 'http://localhost:5678/webhook/985dc3e9-b382-4dd0-922e-0ceee97023e9',
        },
      },
    );

    await new Promise(process.nextTick);

    expect(staticData.hookId).toBe(123);
  });

  it('should not create webhook because of undefined id', async () => {
    const staticData: { hookId?: string } = {
      hookId: undefined,
    };

    hookFunctions.getNodeParameter
      .calledWith('triggerOn')
      .mockReturnValue('Activity/create');
    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(
        'http://localhost:5678/webhook/985dc3e9-b382-4dd0-922e-0ceee97023e9',
      );
    mockedApiRequest.mockResolvedValue({
      id: undefined,
      target: 'Activity',
      event: 'create',
      hook: 'http://localhost:5678/webhook/985dc3e9-b382-4dd0-922e-0ceee97023e9',
      disabled: false,
      disabled_at: null,
      created_at: '2018-10-17T09:33:46Z',
      updated_at: '2018-10-17T09:33:46Z',
    });

    expect(
      trigger.webhookMethods.default.create.call(hookFunctions),
    ).resolves.toBe(false);

    expect(mockedApiRequest).toHaveBeenCalledWith(
      undefined,
      'POST',
      '/account/web_hooks',
      {
        body: {
          target: 'Activity',
          event: 'create',
          hook: 'http://localhost:5678/webhook/985dc3e9-b382-4dd0-922e-0ceee97023e9',
        },
      },
    );

    await new Promise(process.nextTick);

    expect(staticData.hookId).toBeUndefined();
  });

  it('should delete webhook', async () => {
    const staticData: { hookId?: string } = {
      hookId: '76a687e29ae1f428e7ebe101',
    };

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    expect(
      trigger.webhookMethods.default.delete.call(hookFunctions),
    ).resolves.toBe(true);

    expect(mockedApiRequest).toHaveBeenCalledWith(
      undefined,
      'DELETE',
      '/account/web_hooks/76a687e29ae1f428e7ebe101',
    );

    await new Promise(process.nextTick);

    expect(staticData.hookId).toBeUndefined();
  });

  it('should not delete webhook because of undefined id', async () => {
    const staticData: { hookId?: string } = {
      hookId: undefined,
    };

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    expect(
      trigger.webhookMethods.default.delete.call(hookFunctions),
    ).resolves.toBe(true);

    expect(mockedApiRequest).not.toHaveBeenCalled();

    await new Promise(process.nextTick);

    expect(staticData.hookId).toBeUndefined();
  });

  it('should not delete webhook because of api exception', async () => {
    const staticData: { hookId?: string } = {
      hookId: '76a687e29ae1f428e7ebe101',
    };

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);
    mockedApiRequest.mockRejectedValue(new Error());

    expect(
      trigger.webhookMethods.default.delete.call(hookFunctions),
    ).resolves.toBe(false);

    expect(mockedApiRequest).toHaveBeenCalledWith(
      undefined,
      'DELETE',
      '/account/web_hooks/76a687e29ae1f428e7ebe101',
    );

    await new Promise(process.nextTick);

    expect(staticData.hookId).toBe('76a687e29ae1f428e7ebe101');
  });

  it('should provide workflow data', () => {
    const body = {
      id: 982237015,
      date: '2018-07-03',
      hours: 1.25,
      seconds: 4500,
      description: 'Analysis context and dependencies',
      billed: false,
      invoice_id: null,
      billable: false,
      tag: '',
      remote_service: 'trello',
      remote_id: '9qzOS8AA',
      remote_url: 'https://trello.com/c/9qzOS8AA/123-analyse',
      project: {
        id: 944587499,
        name: 'Website Relaunch',
        billable: false,
      },
      task: {
        id: 658636,
        name: 'Concept',
        billable: false,
      },
      customer: {
        id: 760253684,
        name: 'Example Inc.',
      },
      user: {
        id: 933590696,
        firstname: 'John',
        lastname: 'Doe',
      },
      hourly_rate: 150,
      timer_started_at: null,
      created_at: '2018-10-17T09:33:46Z',
      updated_at: '2018-10-17T09:33:46Z',
    };

    webhookFunctions.getHeaderData.mockReturnValue({
      'x-moco-target': 'Activity',
      'x-moco-event': 'create',
      'x-moco-timestamp': '2018-10-17T09:33:46Z',
      'x-moco-signature': '__signature__',
      'x-moco-user-id': '123',
      'x-moco-account-url': 'http://localhost:5678',
    });

    webhookFunctions.getCredentials.calledWith('mocoApi').mockResolvedValue({
      webhookSecret: '__secret__',
    });

    webhookFunctions.getRequestObject.mockReturnValue(mock<Request>({ body }));

    const hmac = mock<Hmac>();

    hmac.update.mockReturnValue(hmac);
    hmac.digest.mockReturnValue('__signature__');

    mockedCreateHmac.mockReturnValue(hmac);

    webhookFunctions.getNodeParameter
      .calledWith('triggerOn')
      .mockReturnValue('Activity/create');

    webhookFunctions.helpers.returnJsonArray.mockReturnValue([{ json: body }]);

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({
      workflowData: [[{ json: body }]],
    });
  });

  it('should not provide workflow data because of missing x-moco-target header', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      //'x-moco-target': 'Activity',
      'x-moco-event': 'create',
      'x-moco-timestamp': '2018-10-17T09:33:46Z',
      'x-moco-signature': '__signature__',
      'x-moco-user-id': '123',
      'x-moco-account-url': 'http://localhost:5678',
    });

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({});
  });

  it('should not provide workflow data because of missing x-moco-event header', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'x-moco-target': 'Activity',
      //'x-moco-event': 'create',
      'x-moco-timestamp': '2018-10-17T09:33:46Z',
      'x-moco-signature': '__signature__',
      'x-moco-user-id': '123',
      'x-moco-account-url': 'http://localhost:5678',
    });

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({});
  });

  it('should not provide workflow data because of missing x-moco-timestamp header', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'x-moco-target': 'Activity',
      'x-moco-event': 'create',
      //'x-moco-timestamp': '2018-10-17T09:33:46Z',
      'x-moco-signature': '__signature__',
      'x-moco-user-id': '123',
      'x-moco-account-url': 'http://localhost:5678',
    });

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({});
  });

  it('should not provide workflow data because of missing x-moco-signature header', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'x-moco-target': 'Activity',
      'x-moco-event': 'create',
      'x-moco-timestamp': '2018-10-17T09:33:46Z',
      //'x-moco-signature': '__signature__',
      'x-moco-user-id': '123',
      'x-moco-account-url': 'http://localhost:5678',
    });

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({});
  });

  it('should not provide workflow data because of missing x-moco-user-id header', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'x-moco-target': 'Activity',
      'x-moco-event': 'create',
      'x-moco-timestamp': '2018-10-17T09:33:46Z',
      'x-moco-signature': '__signature__',
      //'x-moco-user-id': '123',
      'x-moco-account-url': 'http://localhost:5678',
    });

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({});
  });

  it('should not provide workflow data because of missing x-moco-account-url header', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'x-moco-target': 'Activity',
      'x-moco-event': 'create',
      'x-moco-timestamp': '2018-10-17T09:33:46Z',
      'x-moco-signature': '__signature__',
      'x-moco-user-id': '123',
      //'x-moco-account-url': 'http://localhost:5678',
    });

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({});
  });

  it('should not provide workflow data because of invalid signature header', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'x-moco-target': 'Activity',
      'x-moco-event': 'create',
      'x-moco-timestamp': '2018-10-17T09:33:46Z',
      'x-moco-signature': '__invalid_signature__',
      'x-moco-user-id': '123',
      'x-moco-account-url': 'http://localhost:5678',
    });

    webhookFunctions.getCredentials.calledWith('mocoApi').mockResolvedValue({
      webhookSecret: '__secret__',
    });

    webhookFunctions.getRequestObject.mockReturnValue(mock<Request>());

    const hmac = mock<Hmac>();

    hmac.update.mockReturnValue(hmac);
    hmac.digest.mockReturnValue('__signature__');

    mockedCreateHmac.mockReturnValue(hmac);

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({});
  });

  it('should not provide workflow data because of invalid target header', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'x-moco-target': 'Invalid',
      'x-moco-event': 'create',
      'x-moco-timestamp': '2018-10-17T09:33:46Z',
      'x-moco-signature': '__signature__',
      'x-moco-user-id': '123',
      'x-moco-account-url': 'http://localhost:5678',
    });

    webhookFunctions.getCredentials.calledWith('mocoApi').mockResolvedValue({
      webhookSecret: '__secret__',
    });

    webhookFunctions.getRequestObject.mockReturnValue(mock<Request>());

    const hmac = mock<Hmac>();

    hmac.update.mockReturnValue(hmac);
    hmac.digest.mockReturnValue('__signature__');

    mockedCreateHmac.mockReturnValue(hmac);

    webhookFunctions.getNodeParameter
      .calledWith('triggerOn')
      .mockReturnValue('Activity/create');

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({});
  });

  it('should not provide workflow data because of invalid event header', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'x-moco-target': 'Activity',
      'x-moco-event': 'invalid',
      'x-moco-timestamp': '2018-10-17T09:33:46Z',
      'x-moco-signature': '__signature__',
      'x-moco-user-id': '123',
      'x-moco-account-url': 'http://localhost:5678',
    });

    webhookFunctions.getCredentials.calledWith('mocoApi').mockResolvedValue({
      webhookSecret: '__secret__',
    });

    webhookFunctions.getRequestObject.mockReturnValue(mock<Request>());

    const hmac = mock<Hmac>();

    hmac.update.mockReturnValue(hmac);
    hmac.digest.mockReturnValue('__signature__');

    mockedCreateHmac.mockReturnValue(hmac);

    webhookFunctions.getNodeParameter
      .calledWith('triggerOn')
      .mockReturnValue('Activity/create');

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({});
  });
});
