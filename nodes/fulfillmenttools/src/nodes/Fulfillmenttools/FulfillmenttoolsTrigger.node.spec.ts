import { type Request } from 'express';
import { mock, mockClear, mockDeep } from 'jest-mock-extended';
import { type IHookFunctions, type IWebhookFunctions } from 'n8n-workflow';
import { FulfillmenttoolsTrigger } from './FulfillmenttoolsTrigger.node';
import { fulfillmenttoolsApiRequest } from './GenericFunctions';

jest.mock('./GenericFunctions');

describe('FulfillmenttoolsTrigger', () => {
  const hookFunctions = mockDeep<IHookFunctions>();
  const webhookFunctions = mockDeep<IWebhookFunctions>();

  let fulfillmenttoolsTrigger: FulfillmenttoolsTrigger;

  beforeEach(() => {
    fulfillmenttoolsTrigger = new FulfillmenttoolsTrigger();
  });

  afterEach(() => {
    mockClear(hookFunctions);
    mockClear(webhookFunctions);
  });

  it('should be defined', () => {
    expect(fulfillmenttoolsTrigger).toBeDefined();
  });

  it('should check that a webhook exists', () => {
    const callbackUrl =
      'http://localhost:5678/webhook/c940f948-0c2e-4cba-9d47-1b38790d77bb';
    const staticData: { subscriptionId?: string } = {};

    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(callbackUrl);
    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue({
      subscriptions: [
        {
          callbackUrl,
          event: 'ORDER_CREATED',
          headers: [
            {
              key: 'user-agent',
              value: 'ocff-xxx-pre/1.0',
            },
            {
              key: 'x-fulfillmenttools-event',
              value: 'ORDER_CREATED',
            },
            {
              key: 'x-fulfillmenttools-token',
              value: '43c983a2ab084b8c75f3dfa6a60dbb16',
            },
          ],
          name: 'order created',
          id: 'b9753da1-3e57-4c98-86f4-acada6226e09',
          created: '2024-01-29T13:19:44.453Z',
        },
      ],
    });

    expect(
      fulfillmenttoolsTrigger.webhookMethods.default.checkExists.call(
        hookFunctions,
      ),
    ).resolves.toBe(true);
  });

  it('should check that a webhook does not exist', () => {
    const callbackUrl =
      'http://localhost:5678/webhook/c940f948-0c2e-4cba-9d47-1b38790d77bb';
    const staticData: { subscriptionId?: string } = {};

    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(callbackUrl);
    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue({
      subscriptions: [
        {
          callbackUrl:
            'http://localhost:5678/webhook/5e632a06-6a4c-4372-a4e0-30afe130dbae',
          event: 'ORDER_CREATED',
          headers: [
            {
              key: 'user-agent',
              value: 'ocff-xxx-pre/1.0',
            },
            {
              key: 'x-fulfillmenttools-event',
              value: 'ORDER_CREATED',
            },
            {
              key: 'x-fulfillmenttools-token',
              value: '43c983a2ab084b8c75f3dfa6a60dbb16',
            },
          ],
          name: 'order created',
          id: 'b9753da1-3e57-4c98-86f4-acada6226e09',
          created: '2024-01-29T13:19:44.453Z',
        },
      ],
    });

    expect(
      fulfillmenttoolsTrigger.webhookMethods.default.checkExists.call(
        hookFunctions,
      ),
    ).resolves.toBe(false);
  });

  it('should create a webhook', () => {
    const callbackUrl =
      'http://localhost:5678/webhook/c940f948-0c2e-4cba-9d47-1b38790d77bb';
    const event = 'ORDER_CREATED';
    const credentials = { webhookToken: '43c983a2ab084b8c75f3dfa6a60dbb16' };
    const staticData: { subscriptionId?: string } = {};

    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(callbackUrl);
    hookFunctions.getNodeParameter.calledWith('event').mockReturnValue(event);
    hookFunctions.getCredentials
      .calledWith('fulfillmenttoolsApi')
      .mockResolvedValue(credentials);
    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue({
      callbackUrl:
        'http://localhost:5678/webhook/5e632a06-6a4c-4372-a4e0-30afe130dbae',
      event: 'ORDER_CREATED',
      headers: [
        {
          key: 'user-agent',
          value: 'ocff-xxx-pre/1.0',
        },
        {
          key: 'x-fulfillmenttools-event',
          value: 'ORDER_CREATED',
        },
        {
          key: 'x-fulfillmenttools-token',
          value: '43c983a2ab084b8c75f3dfa6a60dbb16',
        },
      ],
      name: 'order created',
      id: 'b9753da1-3e57-4c98-86f4-acada6226e09',
      created: '2024-01-29T13:19:44.453Z',
      lastModified: '2024-01-29T13:19:44.453Z',
    });

    expect(
      fulfillmenttoolsTrigger.webhookMethods.default.create.call(hookFunctions),
    ).resolves.toBe(true);
  });

  it('should not create a webhook', () => {
    const callbackUrl =
      'http://localhost:5678/webhook/c940f948-0c2e-4cba-9d47-1b38790d77bb';
    const event = 'ORDER_CREATED';
    const credentials = { webhookToken: '43c983a2ab084b8c75f3dfa6a60dbb16' };
    const staticData: { subscriptionId?: string } = {};

    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(callbackUrl);
    hookFunctions.getNodeParameter.calledWith('event').mockReturnValue(event);
    hookFunctions.getCredentials
      .calledWith('fulfillmenttoolsApi')
      .mockResolvedValue(credentials);
    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue({
      callbackUrl:
        'http://localhost:5678/webhook/5e632a06-6a4c-4372-a4e0-30afe130dbae',
      event: 'ORDER_CREATED',
      headers: [
        {
          key: 'user-agent',
          value: 'ocff-xxx-pre/1.0',
        },
        {
          key: 'x-fulfillmenttools-event',
          value: 'ORDER_CREATED',
        },
        {
          key: 'x-fulfillmenttools-token',
          value: '43c983a2ab084b8c75f3dfa6a60dbb16',
        },
      ],
      name: 'order created',
      id: undefined,
      created: '2024-01-29T13:19:44.453Z',
      lastModified: '2024-01-29T13:19:44.453Z',
    });

    expect(
      fulfillmenttoolsTrigger.webhookMethods.default.create.call(hookFunctions),
    ).resolves.toBe(false);
  });

  it('should delete a webhook', () => {
    const staticData: { subscriptionId?: string } = {};

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    expect(
      fulfillmenttoolsTrigger.webhookMethods.default.delete.call(hookFunctions),
    ).resolves.toBe(true);
  });

  it('should delete a webhook in the API', () => {
    const staticData: { subscriptionId?: string } = {
      subscriptionId: 'b9753da1-3e57-4c98-86f4-acada6226e09',
    };

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue({
      callbackUrl:
        'http://localhost:5678/webhook/5e632a06-6a4c-4372-a4e0-30afe130dbae',
      event: 'ORDER_CREATED',
      headers: [
        {
          key: 'user-agent',
          value: 'ocff-xxx-pre/1.0',
        },
        {
          key: 'x-fulfillmenttools-event',
          value: 'ORDER_CREATED',
        },
        {
          key: 'x-fulfillmenttools-token',
          value: '43c983a2ab084b8c75f3dfa6a60dbb16',
        },
      ],
      name: 'order created',
      id: 'b9753da1-3e57-4c98-86f4-acada6226e09',
      created: '2024-01-29T13:19:44.453Z',
      lastModified: '2024-01-29T13:19:44.453Z',
    });

    expect(
      fulfillmenttoolsTrigger.webhookMethods.default.delete.call(hookFunctions),
    ).resolves.toBe(true);
  });

  it('should not delete a webhook in the API', () => {
    const staticData: { subscriptionId?: string } = {
      subscriptionId: 'b9753da1-3e57-4c98-86f4-acada6226e09',
    };

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    jest.mocked(fulfillmenttoolsApiRequest).mockRejectedValue(new Error());

    expect(
      fulfillmenttoolsTrigger.webhookMethods.default.delete.call(hookFunctions),
    ).resolves.toBe(false);
  });

  it('should not provide workflow data when event header is missing', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'x-fulfillmenttools-token': '43c983a2ab084b8c75f3dfa6a60dbb16',
    });

    expect(
      fulfillmenttoolsTrigger.webhook.call(webhookFunctions),
    ).resolves.toEqual({});
  });

  it('should not provide workflow data when token header is missing', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'x-fulfillmenttools-event': 'ORDER_CREATED',
    });

    expect(
      fulfillmenttoolsTrigger.webhook.call(webhookFunctions),
    ).resolves.toEqual({});
  });

  it('should not provide workflow data when event does not match', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'x-fulfillmenttools-event': 'ORDER_CREATED',
      'x-fulfillmenttools-token': '43c983a2ab084b8c75f3dfa6a60dbb16',
    });
    webhookFunctions.getNodeParameter
      .calledWith('event')
      .mockReturnValue('ORDER_CANCELED');

    expect(
      fulfillmenttoolsTrigger.webhook.call(webhookFunctions),
    ).resolves.toEqual({});
  });

  it('should not provide workflow data when token does not match', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'x-fulfillmenttools-event': 'ORDER_CREATED',
      'x-fulfillmenttools-token': '43c983a2ab084b8c75f3dfa6a60dbb16',
    });
    webhookFunctions.getNodeParameter
      .calledWith('event')
      .mockReturnValue('ORDER_CREATED');
    webhookFunctions.getCredentials
      .calledWith('fulfillmenttoolsApi')
      .mockResolvedValue({ webhookToken: '53c983a2ab084b8c75f3dfa6a60dbb17' });

    expect(
      fulfillmenttoolsTrigger.webhook.call(webhookFunctions),
    ).resolves.toEqual({});
  });

  it('should provide workflow data', () => {
    const body = {
      event: 'ORDER_CREATED',
      eventId: '5e632a06-6a4c-4372-a4e0-30afe130dbae',
      payload: {
        consumer: {
          addresses: [
            {
              city: 'Langenfeld',
              country: 'DE',
              houseNumber: '42a',
              postalCode: '40764',
              street: 'Hauptstr.',
            },
          ],
        },
        orderDate: '2020-02-03T08:45:50.525Z',
        orderLineItems: [
          {
            article: {
              tenantArticleId: '4711',
              title: 'Cologne Water',
            },
            quantity: 21,
          },
        ],
        status: 'OPEN',
        version: 1,
        id: 'c940f948-0c2e-4cba-9d47-1b38790d77bb',
      },
    };
    const jsonArray = [{ json: body }];

    webhookFunctions.getHeaderData.mockReturnValue({
      'x-fulfillmenttools-event': 'ORDER_CREATED',
      'x-fulfillmenttools-token': '43c983a2ab084b8c75f3dfa6a60dbb16',
    });
    webhookFunctions.getRequestObject.mockReturnValue(
      mock<Request>({
        body,
      }),
    );
    webhookFunctions.getNodeParameter
      .calledWith('event')
      .mockReturnValue('ORDER_CREATED');
    webhookFunctions.getCredentials
      .calledWith('fulfillmenttoolsApi')
      .mockResolvedValue({ webhookToken: '43c983a2ab084b8c75f3dfa6a60dbb16' });
    webhookFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    expect(
      fulfillmenttoolsTrigger.webhook.call(webhookFunctions),
    ).resolves.toEqual({
      workflowData: [jsonArray],
    });
  });
});
