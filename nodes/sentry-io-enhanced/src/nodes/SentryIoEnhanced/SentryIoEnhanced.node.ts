import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeApiError,
} from 'n8n-workflow';

import type { SentryIoDSNApiCredential } from '../../credentials/SentryIoDSNApi.credentials';

export class SentryIoEnhanced implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Sentry.io Enhanced',

    name: 'sentryIoEnhanced',

    icon: 'file:icons/sentry.io.svg',

    group: ['transform'],

    version: 1,

    description: 'Allows you to send envelopes to Sentry.io.',

    defaults: {
      name: 'Sentry.io Enhanced',
    },

    inputs: ['main'],

    outputs: ['main'],

    credentials: [
      {
        name: 'sentryIoDSNApi',
        required: true,
      },
    ],

    properties: [
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        description: 'The message to send',
        required: true,
        default: undefined,
      },
      {
        displayName: 'Level',
        name: 'level',
        type: 'options',
        noDataExpression: true,
        description: 'The record severity',
        default: 'error',
        options: [
          {
            name: 'Debug',
            value: 'debug',
          },
          {
            name: 'Error',
            value: 'error',
          },
          {
            name: 'Fatal',
            value: 'fatal',
          },
          {
            name: 'Info',
            value: 'info',
          },
          {
            name: 'Log',
            value: 'log',
          },
          {
            name: 'Warning',
            value: 'warning',
          },
        ],
      },
      {
        displayName: 'Environment',
        name: 'environment',
        type: 'string',
        description: 'The environment name, such as production or staging',
        default: 'production',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credential = (await this.getCredentials(
      'sentryIoDSNApi',
    )) as SentryIoDSNApiCredential;

    const workflow = this.getWorkflow();
    const commonTags = {
      workflow_id: workflow.id,
      workflow_name: workflow.name,
    };

    const executionId = this.getExecutionId();
    const commonExtra = {
      execution_id: executionId,
      execution_url: `${this.getInstanceBaseUrl()}workflow/${workflow.id}/execution/${executionId}`,
      trigger_name: this.getNode().name,
    };

    const items = this.getInputData();

    const returnData: INodeExecutionData[] = [];

    let responseData: IDataObject | IDataObject[] = {};

    for (let item = 0; item < items.length; item++) {
      try {
        const eventPayload = JSON.stringify({
          message: this.getNodeParameter('message', item) as string,
          level: this.getNodeParameter('level', item) as string,
          platform: 'node',
          transaction: `${this.getInstanceBaseUrl()}workflow/${workflow.id}`,
          server_name: new URL(this.getInstanceBaseUrl()).hostname,
          environment: this.getNodeParameter('environment', item) as string,
          tags: commonTags,
          extra: commonExtra,
        });

        const itemHeaders = JSON.stringify({
          type: 'event',
          length: eventPayload.length,
        });

        responseData = await this.helpers.httpRequestWithAuthentication.call(
          this,
          'sentryIoDSNApi',
          {
            url: `/api/${credential.projectId}/envelope/`,
            body: `${itemHeaders}\n${eventPayload}`,
          },
        );

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData as IDataObject[]),
          { itemData: { item } },
        );

        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as NodeApiError).message },
            pairedItem: { item },
          });
          continue;
        }

        throw error;
      }
    }

    return [returnData];
  }
}
