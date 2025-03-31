import { createHmac } from 'crypto';
import {
  NodeConnectionTypes,
  type IDataObject,
  type IHookFunctions,
  type INodeType,
  type INodeTypeDescription,
  type IWebhookFunctions,
  type IWebhookResponseData,
} from 'n8n-workflow';
import { CredentialData } from '../../credentials/MocoApi.credentials';
import { mocoApiRequest, mocoApiRequestAllItems } from './GenericFunctions';

export interface StaticData extends IDataObject {
  hookId?: string;
}

export class MocoTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'MOCO Trigger',
    name: 'mocoTrigger',
    icon: 'file:moco.svg',
    group: ['trigger'],
    version: 1,
    subtitle:
      "={{$parameter[\"triggerOn\"].toLowerCase().split('/').reverse().join(': ')}}",
    description: 'Listen to MOCO events',
    defaults: {
      name: 'MOCO Trigger',
    },
    inputs: [],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: 'mocoApi',
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
        displayName: 'Trigger On',
        name: 'triggerOn',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Activity Created',
            value: 'Activity/create',
          },
          {
            name: 'Activity Deleted',
            value: 'Activity/delete',
          },
          {
            name: 'Activity Updated',
            value: 'Activity/update',
          },
          {
            name: 'Comment Created',
            value: 'Comment/create',
          },
          {
            name: 'Comment Deleted',
            value: 'Comment/delete',
          },
          {
            name: 'Comment Updated',
            value: 'Comment/update',
          },
          {
            name: 'Company Created',
            value: 'Company/create',
          },
          {
            name: 'Company Deleted',
            value: 'Company/delete',
          },
          {
            name: 'Company Updated',
            value: 'Company/update',
          },
          {
            name: 'Contact Created',
            value: 'Contact/create',
          },
          {
            name: 'Contact Deleted',
            value: 'Contact/delete',
          },
          {
            name: 'Contact Updated',
            value: 'Contact/update',
          },
          {
            name: 'Contract Created',
            value: 'Contract/create',
          },
          {
            name: 'Contract Deleted',
            value: 'Contract/delete',
          },
          {
            name: 'Contract Updated',
            value: 'Contract/update',
          },
          {
            name: 'Deal Created',
            value: 'Deal/create',
          },
          {
            name: 'Deal Deleted',
            value: 'Deal/delete',
          },
          {
            name: 'Deal Updated',
            value: 'Deal/update',
          },
          {
            name: 'Expense Created',
            value: 'Expense/create',
          },
          {
            name: 'Expense Deleted',
            value: 'Expense/delete',
          },
          {
            name: 'Expense Updated',
            value: 'Expense/update',
          },
          {
            name: 'Invoice Created',
            value: 'Invoice/create',
          },
          {
            name: 'Invoice Deleted',
            value: 'Invoice/delete',
          },
          {
            name: 'Invoice Updated',
            value: 'Invoice/update',
          },
          {
            name: 'Invoice/Payment Created',
            value: 'Invoice::Payment/create',
          },
          {
            name: 'Invoice/Payment Deleted',
            value: 'Invoice::Payment/delete',
          },
          {
            name: 'Invoice/Payment Updated',
            value: 'Invoice::Payment/update',
          },
          {
            name: 'InvoiceDraft Created',
            value: 'InvoiceDraft/create',
          },
          {
            name: 'InvoiceDraft Deleted',
            value: 'InvoiceDraft/delete',
          },
          {
            name: 'InvoiceDraft Updated',
            value: 'InvoiceDraft/update',
          },
          {
            name: 'Offer Created',
            value: 'Offer/create',
          },
          {
            name: 'Offer Deleted',
            value: 'Offer/delete',
          },
          {
            name: 'Offer Updated',
            value: 'Offer/update',
          },
          {
            name: 'PlanningEntry Created',
            value: 'PlanningEntry/create',
          },
          {
            name: 'PlanningEntry Deleted',
            value: 'PlanningEntry/delete',
          },
          {
            name: 'PlanningEntry Updated',
            value: 'PlanningEntry/update',
          },
          {
            name: 'Presence Created',
            value: 'Presence/create',
          },
          {
            name: 'Presence Deleted',
            value: 'Presence/delete',
          },
          {
            name: 'Presence Updated',
            value: 'Presence/update',
          },
          {
            name: 'Project Created',
            value: 'Project/create',
          },
          {
            name: 'Project Deleted',
            value: 'Project/delete',
          },
          {
            name: 'Project Updated',
            value: 'Project/update',
          },
          {
            name: 'Project/PaymentSchedule Created',
            value: 'Project::PaymentSchedule/create',
          },
          {
            name: 'Project/PaymentSchedule Deleted',
            value: 'Project::PaymentSchedule/delete',
          },
          {
            name: 'Project/PaymentSchedule Updated',
            value: 'Project::PaymentSchedule/update',
          },
          {
            name: 'Purchase Created',
            value: 'Purchase/create',
          },
          {
            name: 'Purchase Deleted',
            value: 'Purchase/delete',
          },
          {
            name: 'Purchase Updated',
            value: 'Purchase/update',
          },
          {
            name: 'Purchase/Approval Created',
            value: 'Purchase::Approval/create',
          },
          {
            name: 'Purchase/Approval Deleted',
            value: 'Purchase::Approval/delete',
          },
          {
            name: 'Purchase/Approval Updated',
            value: 'Purchase::Approval/update',
          },
          {
            name: 'Purchase/Draft Created',
            value: 'Purchase::Draft/create',
          },
          {
            name: 'Purchase/Draft Deleted',
            value: 'Purchase::Draft/delete',
          },
          {
            name: 'Purchase/Draft Updated',
            value: 'Purchase::Draft/update',
          },
          {
            name: 'Purchase/Payment Created',
            value: 'Purchase::Payment/create',
          },
          {
            name: 'Purchase/Payment Deleted',
            value: 'Purchase::Payment/delete',
          },
          {
            name: 'Purchase/Payment Updated',
            value: 'Purchase::Payment/update',
          },
          {
            name: 'RecurringExpense Created',
            value: 'RecurringExpense/create',
          },
          {
            name: 'RecurringExpense Deleted',
            value: 'RecurringExpense/delete',
          },
          {
            name: 'RecurringExpense Updated',
            value: 'RecurringExpense/update',
          },
          {
            name: 'Schedule Created',
            value: 'Schedule/create',
          },
          {
            name: 'Schedule Deleted',
            value: 'Schedule/delete',
          },
          {
            name: 'Schedule Updated',
            value: 'Schedule/update',
          },
          {
            name: 'Task Created',
            value: 'Task/create',
          },
          {
            name: 'Task Deleted',
            value: 'Task/delete',
          },
          {
            name: 'Task Updated',
            value: 'Task/update',
          },
          {
            name: 'User Created',
            value: 'User/create',
          },
          {
            name: 'User Deleted',
            value: 'User/delete',
          },
          {
            name: 'User Updated',
            value: 'User/update',
          },
          {
            name: 'User/HolidayRequest Created',
            value: 'User::HolidayRequest/create',
          },
          {
            name: 'User/HolidayRequest Deleted',
            value: 'User::HolidayRequest/delete',
          },
          {
            name: 'User/HolidayRequest Updated',
            value: 'User::HolidayRequest/update',
          },
        ],
        default: 'Activity/create',
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhooks = await mocoApiRequestAllItems.call(
          this,
          undefined,
          'GET',
          '/account/web_hooks',
        );

        const webhookUrl = this.getNodeWebhookUrl('default');
        const webhookData: StaticData = this.getWorkflowStaticData('node');

        for (const webhook of webhooks) {
          if (webhook.hook === webhookUrl) {
            webhookData.hookId = webhook.id;
            return true;
          }
        }

        return false;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        const triggerOn = this.getNodeParameter('triggerOn') as string;
        const [target, event] = triggerOn.split('/', 2);
        const hook = this.getNodeWebhookUrl('default');

        const body = {
          target,
          event,
          hook,
        };

        const responseData = await mocoApiRequest.call(
          this,
          undefined,
          'POST',
          '/account/web_hooks',
          { body },
        );

        if (responseData.id === undefined) {
          return false;
        }

        const webhookData: StaticData = this.getWorkflowStaticData('node');

        webhookData.hookId = responseData.id;

        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData: StaticData = this.getWorkflowStaticData('node');

        if (webhookData.hookId === undefined) {
          return true;
        }

        try {
          await mocoApiRequest.call(
            this,
            undefined,
            'DELETE',
            `/account/web_hooks/${webhookData.hookId}`,
          );
        } catch {
          return false;
        }

        delete webhookData.hookId;

        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const headerData = this.getHeaderData();

    if (
      headerData['x-moco-target'] === undefined ||
      headerData['x-moco-event'] === undefined ||
      headerData['x-moco-timestamp'] === undefined ||
      headerData['x-moco-signature'] === undefined ||
      headerData['x-moco-user-id'] === undefined ||
      headerData['x-moco-account-url'] === undefined
    ) {
      return {};
    }

    const credentials = (await this.getCredentials(
      'mocoApi',
    )) as CredentialData;
    const req = this.getRequestObject();

    const computedSignature = createHmac('sha256', credentials.webhookSecret)
      .update(req.rawBody)
      .digest('hex');

    if (headerData['x-moco-signature'] !== computedSignature) {
      return {};
    }

    const triggerOn = this.getNodeParameter('triggerOn') as string;
    const [target, event] = triggerOn.split('/', 2);

    if (target !== headerData['x-moco-target']) {
      return {};
    }

    if (event !== headerData['x-moco-event']) {
      return {};
    }

    return {
      workflowData: [this.helpers.returnJsonArray(req.body)],
    };
  }
}
