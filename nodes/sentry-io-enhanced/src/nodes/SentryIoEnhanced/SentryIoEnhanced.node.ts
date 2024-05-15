import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeApiError,
} from 'n8n-workflow';

import type { SentryIoDSNApiCredential } from '../../credentials/SentryIoDSNApi.credentials';
import { getOptionsFromNodeParameter } from './GenericFunctions';

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
        default: '',
        required: true,
      },
      {
        displayName: 'Level',
        name: 'level',
        type: 'options',
        default: 'error',
        description: 'The record severity',
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
        noDataExpression: true,
      },
      {
        displayName: 'Environment',
        name: 'environment',
        type: 'string',
        default: 'production',
        description: 'The environment name, such as production or staging',
        validateType: 'string',
      },
      {
        displayName:
          'By default the workflow ID (workflow_id) and name (workflow_name) are added as tags. Add additional tags here.',
        name: 'notice',
        type: 'notice',
        default: '',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
          sortable: true,
        },
        default: [],
        options: [
          {
            name: 'values',
            displayName: 'Values',
            values: [
              {
                displayName: 'Key',
                name: 'key',
                type: 'string',
                default: '',
                placeholder: 'Tag name',
                description: 'Name of the tag to set the value of',
                noDataExpression: true,
                required: true,
                requiresDataPath: 'single',
                validateType: 'string',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                placeholder: 'Tag value',
                description: 'Value of the tag',
                required: true,
                validateType: 'string',
              },
            ],
          },
        ],
        placeholder: 'Add tag',
      },
      {
        displayName:
          'By default the execution ID (execution_id), execution URL (execution_url), and trigger name (trigger_name) are added as extra. Add additional extra here.',
        name: 'notice',
        type: 'notice',
        default: '',
      },
      {
        displayName: 'Extra',
        name: 'extra',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
          sortable: true,
        },
        default: {},
        options: [
          {
            name: 'values',
            displayName: 'Values',
            values: [
              {
                displayName: 'Key',
                name: 'key',
                type: 'string',
                default: '',
                placeholder: 'Extra name',
                description: 'Name of the extra to set the value of',
                noDataExpression: true,
                required: true,
                requiresDataPath: 'single',
                validateType: 'string',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                placeholder: 'Extra value',
                description: 'Value of the extra',
                required: true,
                validateType: 'string',
              },
            ],
          },
        ],
        placeholder: 'Add extra',
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
          tags: {
            ...commonTags,
            ...getOptionsFromNodeParameter.call(this, 'tags.values', item),
          },
          extra: {
            ...commonExtra,
            ...getOptionsFromNodeParameter.call(this, 'extra.values', item),
          },
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
