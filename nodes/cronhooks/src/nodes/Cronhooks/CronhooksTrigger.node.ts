import {
  IHookFunctions,
  ILoadOptionsFunctions,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
  NodeApiError,
  NodeConnectionTypes,
} from 'n8n-workflow';
import {
  cronhooksApiRequest,
  cronhooksApiRequestAllItems,
} from './GenericFunctions';
import { createHmac } from 'crypto';

type Credentials = {
  apiKey: string;
  webhookSecret: string;
};

type StaticData = {
  scheduleId?: string;
};

type HeaderData = {
  'cronhooks-signature'?: string;
};

export class CronhooksTrigger implements INodeType {
  description: INodeTypeDescription = {
    name: 'cronhooksTrigger',

    displayName: 'cronhooks.io Trigger',

    icon: 'file:icons/cronhooks.svg',

    group: ['trigger'],

    version: 1,

    subtitle: '={{$parameter["name"]}}',

    description: 'Listen to cronhooks.io triggers',

    defaults: {
      name: 'cronhooks.io Trigger',
    },

    inputs: [],

    outputs: [NodeConnectionTypes.Main],

    credentials: [
      {
        name: 'cronhooksApi',
        required: true,
      },
    ],

    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],

    properties: [
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        required: true,
        default: undefined,
      },
      {
        displayName: 'CRON Expression',
        name: 'cronExpression',
        type: 'string',
        required: true,
        placeholder: '*/5 * * * *',
        default: undefined,
      },
      {
        displayName: 'Group Name or ID',
        name: 'group',
        type: 'options',
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        placeholder: 'Group',
        default: '',
        typeOptions: {
          loadOptionsMethod: 'getGroups',
        },
      },
    ],
  };

  methods = {
    loadOptions: {
      // Get all Collections
      async getGroups(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        let collections: { name: string; id: string }[] = [];

        try {
          collections = (await cronhooksApiRequestAllItems.call(
            this,
            'GET',
            '/groups',
          )) as { name: string; id: string }[];
        } catch (error) {
          throw new NodeApiError(this.getNode(), { error: error as string });
        }

        return [
          {
            name: 'None',
            value: 'none',
          },
          ...collections.map(({ name, id }) => ({ name, value: id })),
        ];
      },
    },
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const callbackUrl = this.getNodeWebhookUrl('default') as string;
        const staticData = this.getWorkflowStaticData('node') as StaticData;

        const schedules = (await cronhooksApiRequestAllItems.call(
          this,
          'GET',
          '/schedules',
        )) as { url: string; id: string }[];

        for (const schedule of schedules) {
          if (schedule.url === callbackUrl) {
            staticData.scheduleId = schedule.id;
            return true;
          }
        }

        return false;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        const callbackUrl = this.getNodeWebhookUrl('default') as string;
        const title = this.getNodeParameter('title') as string;
        const cronExpression = this.getNodeParameter(
          'cronExpression',
        ) as string;
        const group = this.getNodeParameter('group') as string;
        const staticData = this.getWorkflowStaticData('node') as StaticData;

        const responseData = (await cronhooksApiRequest.call(
          this,
          'POST',
          '/schedules',
          {
            url: callbackUrl,
            title,
            timezone: 'europe/berlin',
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            isRecurring: true,
            sendCronhookObject: true,
            sendFailureAlert: true,
            cronExpression,
            ...(group && group.length > 0 && group !== 'none' ? { group } : {}),
          },
        )) as { id?: string };

        if (responseData.id === undefined) {
          return false;
        }

        staticData.scheduleId = responseData.id;

        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        const staticData = this.getWorkflowStaticData('node') as StaticData;

        if (staticData.scheduleId === undefined) {
          return true;
        }

        try {
          await cronhooksApiRequest.call(
            this,
            'DELETE',
            `/schedules/${staticData.scheduleId}`,
          );
        } catch {
          return false;
        }

        delete staticData.scheduleId;

        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const headerData = this.getHeaderData() as HeaderData;

    const credentials = (await this.getCredentials(
      'cronhooksApi',
    )) as Credentials;

    const cronhooksSignature = headerData['cronhooks-signature'];

    const body = this.getBodyData();

    const expectedSignature = createHmac('sha256', credentials.webhookSecret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (cronhooksSignature !== expectedSignature) {
      return {};
    }

    return {
      workflowData: [this.helpers.returnJsonArray(body)],
    };
  }
}
