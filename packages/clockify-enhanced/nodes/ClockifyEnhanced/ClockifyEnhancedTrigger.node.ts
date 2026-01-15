import { components } from '../../types/api';
import {
  clockifyApiRequest,
  clockifyApiRequestAllItems,
} from './GenericFunctions';
import type {
  IDataObject,
  IHookFunctions,
  ILoadOptionsFunctions,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

export type Workspace = components['schemas']['WorkspaceDtoV1'];
export type Webhook = components['schemas']['WebhookDtoV1'];
export type WebhookCreate = components['schemas']['CreateWebhookRequestV1'];
export type Webhooks = components['schemas']['WebhooksDtoV1'];

export interface StaticData extends IDataObject {
  webhookAuthToken?: string;
  webhookId?: string;
}

export enum WebhookEvent {
  APPROVAL_REQUEST_STATUS_UPDATED = 'APPROVAL_REQUEST_STATUS_UPDATED',
  BALANCE_UPDATED = 'BALANCE_UPDATED',
  INVOICE_UPDATED = 'INVOICE_UPDATED',
  NEW_APPROVAL_REQUEST = 'NEW_APPROVAL_REQUEST',
  NEW_CLIENT = 'NEW_CLIENT',
  NEW_INVOICE = 'NEW_INVOICE',
  NEW_PROJECT = 'NEW_PROJECT',
  NEW_TAG = 'NEW_TAG',
  NEW_TASK = 'NEW_TASK',
  NEW_TIME_ENTRY = 'NEW_TIME_ENTRY',
  NEW_TIMER_STARTED = 'NEW_TIMER_STARTED',
  TIME_ENTRY_DELETED = 'TIME_ENTRY_DELETED',
  TIME_ENTRY_UPDATED = 'TIME_ENTRY_UPDATED',
  TIME_OFF_REQUEST_APPROVED = 'TIME_OFF_REQUEST_APPROVED',
  TIME_OFF_REQUEST_REJECTED = 'TIME_OFF_REQUEST_REJECTED',
  TIME_OFF_REQUEST_WITHDRAWN = 'TIME_OFF_REQUEST_WITHDRAWN',
  TIME_OFF_REQUESTED = 'TIME_OFF_REQUESTED',
  TIMER_STOPPED = 'TIMER_STOPPED',
  USER_ACTIVATED_ON_WORKSPACE = 'USER_ACTIVATED_ON_WORKSPACE',
  USER_DEACTIVATED_ON_WORKSPACE = 'USER_DEACTIVATED_ON_WORKSPACE',
  USER_DELETED_FROM_WORKSPACE = 'USER_DELETED_FROM_WORKSPACE',
  USER_EMAIL_CHANGED = 'USER_EMAIL_CHANGED',
  USER_JOINED_WORKSPACE = 'USER_JOINED_WORKSPACE',
  USER_UPDATED = 'USER_UPDATED',
}

export class ClockifyEnhancedTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Clockify Enhanced Trigger',
    name: 'clockifyEnhancedTrigger',
    icon: 'file:../../icons/Clockify.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["name"]}}',
    description: 'Listen to Clockify events',
    defaults: {
      name: 'Clockify Enhanced Trigger',
    },
    usableAsTool: true,
    inputs: [],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: 'clockifyEnhancedApi',
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
        displayName: 'Workspace Name or ID',
        name: 'workspaceId',
        type: 'options',
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        typeOptions: {
          loadOptionsMethod: 'listWorkspaces',
        },
        required: true,
        default: '',
      },
      {
        displayName: 'Webhook Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
      },
      {
        displayName: 'Webhook Event',
        name: 'webhookEvent',
        type: 'options',
        options: [
          {
            name: 'Approval Request Status Updated',
            value: WebhookEvent.APPROVAL_REQUEST_STATUS_UPDATED,
          },
          {
            name: 'Balance Updated',
            value: WebhookEvent.BALANCE_UPDATED,
          },
          {
            name: 'Client Created',
            value: WebhookEvent.NEW_CLIENT,
          },
          {
            name: 'Invoice Created',
            value: WebhookEvent.NEW_INVOICE,
          },
          {
            name: 'Invoice Updated',
            value: WebhookEvent.INVOICE_UPDATED,
          },
          {
            name: 'New Approval Request',
            value: WebhookEvent.NEW_APPROVAL_REQUEST,
          },
          {
            name: 'Project Created',
            value: WebhookEvent.NEW_PROJECT,
          },
          {
            name: 'Tag Created',
            value: WebhookEvent.NEW_TAG,
          },
          {
            name: 'Task Created',
            value: WebhookEvent.NEW_TASK,
          },
          {
            name: 'Time Entry Created',
            value: WebhookEvent.NEW_TIME_ENTRY,
          },
          {
            name: 'Time Entry Deleted',
            value: WebhookEvent.TIME_ENTRY_DELETED,
          },
          {
            name: 'Time Entry Updated',
            value: WebhookEvent.TIME_ENTRY_UPDATED,
          },
          {
            name: 'Time Off Request Approved',
            value: WebhookEvent.TIME_OFF_REQUEST_APPROVED,
          },
          {
            name: 'Time Off Request Rejected',
            value: WebhookEvent.TIME_OFF_REQUEST_REJECTED,
          },
          {
            name: 'Time Off Request Withdrawn',
            value: WebhookEvent.TIME_OFF_REQUEST_WITHDRAWN,
          },
          {
            name: 'Time Off Requested',
            value: WebhookEvent.TIME_OFF_REQUESTED,
          },
          {
            name: 'Timer Started',
            value: WebhookEvent.NEW_TIMER_STARTED,
          },
          {
            name: 'Timer Stopped',
            value: WebhookEvent.TIMER_STOPPED,
          },
          {
            name: 'User Activated On Workspace',
            value: WebhookEvent.USER_ACTIVATED_ON_WORKSPACE,
          },
          {
            name: 'User Deactivated On Workspace',
            value: WebhookEvent.USER_DEACTIVATED_ON_WORKSPACE,
          },
          {
            name: 'User Deleted From Workspace',
            value: WebhookEvent.USER_DELETED_FROM_WORKSPACE,
          },
          {
            name: 'User Email Changed',
            value: WebhookEvent.USER_EMAIL_CHANGED,
          },
          {
            name: 'User Joined Workspace',
            value: WebhookEvent.USER_JOINED_WORKSPACE,
          },
          {
            name: 'User Updated',
            value: WebhookEvent.USER_UPDATED,
          },
        ],
        required: true,
        default: `${WebhookEvent.APPROVAL_REQUEST_STATUS_UPDATED}`,
      },
    ],
  };

  methods = {
    loadOptions: {
      async listWorkspaces(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        const workspaces = await (clockifyApiRequestAllItems<Workspace>).call(
          this,
          'GET',
          '/workspaces',
        );

        for (const workspace of workspaces) {
          if (workspace.name === undefined || workspace.id === undefined) {
            continue;
          }

          returnData.push({
            name: workspace.name,
            value: workspace.id,
          });
        }

        return returnData;
      },
    },
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const workspaceId = this.getNodeParameter('workspaceId');

        const responseData = await (clockifyApiRequest<Webhooks>).call(
          this,
          'GET',
          `/workspaces/${workspaceId}/webhooks`,
        );

        if (responseData.webhooks === undefined) {
          return false;
        }

        const webhookUrl = this.getNodeWebhookUrl('default');
        const webhookData: StaticData = this.getWorkflowStaticData('node');

        for (const webhook of responseData.webhooks) {
          if (webhook.url === webhookUrl) {
            webhookData.webhookAuthToken = webhook.authToken;
            webhookData.webhookId = webhook.id;
            return true;
          }
        }

        return false;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        const workspaceId = this.getNodeParameter('workspaceId');
        const name = this.getNodeParameter('name') as string;
        const webhookUrl = this.getNodeWebhookUrl('default') as string;
        const webhookEvent = this.getNodeParameter(
          'webhookEvent',
        ) as WebhookEvent;

        const body: WebhookCreate = {
          name,
          triggerSource: [],
          triggerSourceType: 'WORKSPACE_ID',
          url: webhookUrl,
          webhookEvent,
        };

        const responseData = await (clockifyApiRequest<Webhook>).call(
          this,
          'POST',
          `/workspaces/${workspaceId}/webhooks`,
          body,
        );

        if (
          responseData.authToken === undefined ||
          responseData.id === undefined
        ) {
          return false;
        }

        const webhookData: StaticData = this.getWorkflowStaticData('node');

        webhookData.webhookAuthToken = responseData.authToken;
        webhookData.webhookId = responseData.id;

        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData: StaticData = this.getWorkflowStaticData('node');

        if (webhookData.webhookId === undefined) {
          return true;
        }

        const workspaceId = this.getNodeParameter('workspaceId');

        try {
          await clockifyApiRequest.call(
            this,
            'DELETE',
            `/workspaces/${workspaceId}/webhooks/${webhookData.webhookId}`,
          );
        } catch {
          return false;
        }

        delete webhookData.webhookAuthToken;
        delete webhookData.webhookId;

        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const headerData = this.getHeaderData();

    if (
      headerData['clockify-signature'] === undefined ||
      headerData['clockify-webhook-event-type'] === undefined
    ) {
      return {};
    }

    const webhookData: StaticData = this.getWorkflowStaticData('node');

    if (headerData['clockify-signature'] !== webhookData.webhookAuthToken) {
      return {};
    }

    const webhookEvent = this.getNodeParameter('webhookEvent');

    if (headerData['clockify-webhook-event-type'] !== webhookEvent) {
      return {};
    }

    const req = this.getRequestObject();

    return {
      workflowData: [this.helpers.returnJsonArray(req.body)],
    };
  }
}
