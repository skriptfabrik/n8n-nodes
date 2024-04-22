import type {
  IDataObject,
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';
import type { components } from '../../api';
import { fulfillmenttoolsApiRequest } from './GenericFunctions';

type Subscription = components['schemas']['Subscription'];
type Subscriptions = components['schemas']['Subscriptions'];

type Credentials = {
  username: string;
  password: string;
  apiKey: string;
  subDomain: string;
  webhookToken: string;
  idToken?: string;
  refreshToken?: string;
};

type HeaderData = {
  'x-fulfillmenttools-event'?: string;
  'x-fulfillmenttools-token'?: string;
};

type StaticData = {
  subscriptionId?: string;
};

enum FulfillmenttoolsEvents {
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_CANCELED = 'ORDER_CANCELED',
  ORDER_UNLOCKED = 'ORDER_UNLOCKED',
  INVENTORY_FACILITY_STOCK_CHANGED = 'INVENTORY_FACILITY_STOCK_CHANGED',
  INBOUND_DELIVERY_RECEIVED = 'INBOUND_DELIVERY_RECEIVED',
  INBOUND_DELIVERY_FINISHED = 'INBOUND_DELIVERY_FINISHED',
  INBOUND_DELIVERY_ON_HOLD = 'INBOUND_DELIVERY_ON_HOLD',
  ROUTING_PLAN_SPLITTED = 'ROUTING_PLAN_SPLITTED',
  ROUTING_PLAN_WAITING = 'ROUTING_PLAN_WAITING',
  ROUTING_PLAN_FALLBACK = 'ROUTING_PLAN_FALLBACK',
  ROUTING_PLAN_ROUTED = 'ROUTING_PLAN_ROUTED',
  ROUTING_PLAN_REROUTEPLAN_CREATED = 'ROUTING_PLAN_REROUTEPLAN_CREATED',
  ROUTING_PLAN_NOT_ROUTABLE = 'ROUTING_PLAN_NOT_ROUTABLE',
  FACILITY_CREATED = 'FACILITY_CREATED',
  FACILITY_UPDATED = 'FACILITY_UPDATED',
  FACILITY_DELETED = 'FACILITY_DELETED',
  PICK_JOB_CREATED = 'PICK_JOB_CREATED',
  PICK_JOB_PICKING_COMMENCED = 'PICK_JOB_PICKING_COMMENCED',
  PICK_JOB_PICKING_PAUSED = 'PICK_JOB_PICKING_PAUSED',
  PICK_JOB_PICKING_FINISHED = 'PICK_JOB_PICKING_FINISHED',
  PICK_JOB_PICK_LINE_PICKED = 'PICK_JOB_PICK_LINE_PICKED',
  PICK_JOB_REROUTED = 'PICK_JOB_REROUTED',
  PICK_JOB_RESET = 'PICK_JOB_RESET',
  PICK_JOB_ABORTED = 'PICK_JOB_ABORTED',
  PACK_JOB_CREATED = 'PACK_JOB_CREATED',
  PACK_JOB_UPDATED = 'PACK_JOB_UPDATED',
  HANDOVERJOB_CREATED = 'HANDOVERJOB_CREATED',
  HANDOVERJOB_HANDED_OVER = 'HANDOVERJOB_HANDED_OVER',
  HANDOVERJOB_REVERTED = 'HANDOVERJOB_REVERTED',
  HANDOVERJOB_CANCELED = 'HANDOVERJOB_CANCELED',
  PARCEL_CARRIER_REQUESTED = 'PARCEL_CARRIER_REQUESTED',
  PARCEL_CARRIER_FAILED = 'PARCEL_CARRIER_FAILED',
  PARCEL_CARRIER_ACKNOWLEDGED = 'PARCEL_CARRIER_ACKNOWLEDGED',
  RETURN_CREATED = 'RETURN_CREATED',
  RETURN_CLAIMED = 'RETURN_CLAIMED',
  RETURN_CLOSED = 'RETURN_CLOSED',
  RETURN_CANCELED = 'RETURN_CANCELED',
  RETURN_UPDATED = 'RETURN_UPDATED',
}

export class FulfillmenttoolsTrigger implements INodeType {
  description: INodeTypeDescription = {
    name: 'fulfillmenttoolsTrigger',

    displayName: 'fulfillmenttools Trigger',

    icon: 'file:icons/fulfillmenttools.svg',

    group: ['trigger'],

    version: 1,

    subtitle: '={{$parameter["event"].toLowerCase().split("_").join(" ")}}',

    description: 'Listen to fulfillmenttools events',

    defaults: {
      name: 'fulfillmenttools Trigger',
    },

    inputs: [],

    outputs: ['main'],

    credentials: [
      {
        name: 'fulfillmenttoolsApi',
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
        displayName: 'Event',
        name: 'event',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Order Created',
            value: FulfillmenttoolsEvents.ORDER_CREATED,
          },
          {
            name: 'Order Canceled',
            value: FulfillmenttoolsEvents.ORDER_CANCELED,
          },
          {
            name: 'Order Unlocked',
            value: FulfillmenttoolsEvents.ORDER_UNLOCKED,
          },
          {
            name: 'Inventory Facility Stock Changed',
            value: FulfillmenttoolsEvents.INVENTORY_FACILITY_STOCK_CHANGED,
          },
          {
            name: 'Inbound Delivery Received',
            value: FulfillmenttoolsEvents.INBOUND_DELIVERY_RECEIVED,
          },
          {
            name: 'Inbound Delivery Finished',
            value: FulfillmenttoolsEvents.INBOUND_DELIVERY_FINISHED,
          },
          {
            name: 'Inbound Delivery On Hold',
            value: FulfillmenttoolsEvents.INBOUND_DELIVERY_ON_HOLD,
          },
          {
            name: 'Routing Plan Splitted',
            value: FulfillmenttoolsEvents.ROUTING_PLAN_SPLITTED,
          },
          {
            name: 'Routing Plan Waiting',
            value: FulfillmenttoolsEvents.ROUTING_PLAN_WAITING,
          },
          {
            name: 'Routing Plan Fallback',
            value: FulfillmenttoolsEvents.ROUTING_PLAN_FALLBACK,
          },
          {
            name: 'Routing Plan Routed',
            value: FulfillmenttoolsEvents.ROUTING_PLAN_ROUTED,
          },
          {
            name: 'Routing Plan Rerouteplan Created',
            value: FulfillmenttoolsEvents.ROUTING_PLAN_REROUTEPLAN_CREATED,
          },
          {
            name: 'Routing Plan Not Routable',
            value: FulfillmenttoolsEvents.ROUTING_PLAN_NOT_ROUTABLE,
          },
          {
            name: 'Facility Created',
            value: FulfillmenttoolsEvents.FACILITY_CREATED,
          },
          {
            name: 'Facility Updated',
            value: FulfillmenttoolsEvents.FACILITY_UPDATED,
          },
          {
            name: 'Facility Deleted',
            value: FulfillmenttoolsEvents.FACILITY_DELETED,
          },
          {
            name: 'Pick Job Created',
            value: FulfillmenttoolsEvents.PICK_JOB_CREATED,
          },
          {
            name: 'Pick Job Picking Commenced',
            value: FulfillmenttoolsEvents.PICK_JOB_PICKING_COMMENCED,
          },
          {
            name: 'Pick Job Picking Paused',
            value: FulfillmenttoolsEvents.PICK_JOB_PICKING_PAUSED,
          },
          {
            name: 'Pick Job Picking Finished',
            value: FulfillmenttoolsEvents.PICK_JOB_PICKING_FINISHED,
          },
          {
            name: 'Pick Job Pick Line Picked',
            value: FulfillmenttoolsEvents.PICK_JOB_PICK_LINE_PICKED,
          },
          {
            name: 'Pick Job Rerouted',
            value: FulfillmenttoolsEvents.PICK_JOB_REROUTED,
          },
          {
            name: 'Pick Job Reset',
            value: FulfillmenttoolsEvents.PICK_JOB_RESET,
          },
          {
            name: 'Pick Job Aborted',
            value: FulfillmenttoolsEvents.PICK_JOB_ABORTED,
          },
          {
            name: 'Pack Job Created',
            value: FulfillmenttoolsEvents.PACK_JOB_CREATED,
          },
          {
            name: 'Pack Job Updated',
            value: FulfillmenttoolsEvents.PACK_JOB_UPDATED,
          },
          {
            name: 'Handoverjob Created',
            value: FulfillmenttoolsEvents.HANDOVERJOB_CREATED,
          },
          {
            name: 'Handoverjob Handed Over',
            value: FulfillmenttoolsEvents.HANDOVERJOB_HANDED_OVER,
          },
          {
            name: 'Handoverjob Reverted',
            value: FulfillmenttoolsEvents.HANDOVERJOB_REVERTED,
          },
          {
            name: 'Handoverjob Canceled',
            value: FulfillmenttoolsEvents.HANDOVERJOB_CANCELED,
          },
          {
            name: 'Parcel Carrier Requested',
            value: FulfillmenttoolsEvents.PARCEL_CARRIER_REQUESTED,
          },
          {
            name: 'Parcel Carrier Failed',
            value: FulfillmenttoolsEvents.PARCEL_CARRIER_FAILED,
          },
          {
            name: 'Parcel Carrier Acknowledged',
            value: FulfillmenttoolsEvents.PARCEL_CARRIER_ACKNOWLEDGED,
          },
          {
            name: 'Return Created',
            value: FulfillmenttoolsEvents.RETURN_CREATED,
          },
          {
            name: 'Return Claimed',
            value: FulfillmenttoolsEvents.RETURN_CLAIMED,
          },
          {
            name: 'Return Closed',
            value: FulfillmenttoolsEvents.RETURN_CLOSED,
          },
          {
            name: 'Return Canceled',
            value: FulfillmenttoolsEvents.RETURN_CANCELED,
          },
          {
            name: 'Return Updated',
            value: FulfillmenttoolsEvents.RETURN_UPDATED,
          },
        ],
        default: FulfillmenttoolsEvents.ORDER_CREATED.toString(),
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const callbackUrl = this.getNodeWebhookUrl('default') as string;
        const staticData = this.getWorkflowStaticData('node') as StaticData;

        const responseData = (await fulfillmenttoolsApiRequest.call(
          this,
          'GET',
          '/subscriptions',
        )) as Subscriptions;

        for (const subscription of responseData.subscriptions as Subscription[]) {
          if (subscription.callbackUrl === callbackUrl) {
            staticData.subscriptionId = subscription.id;
            return true;
          }
        }

        return false;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        const callbackUrl = this.getNodeWebhookUrl('default') as string;
        const event = this.getNodeParameter('event') as string;
        const credentials = (await this.getCredentials(
          'fulfillmenttoolsApi',
        )) as Credentials;
        const staticData = this.getWorkflowStaticData('node') as StaticData;

        const responseData = (await fulfillmenttoolsApiRequest.call(
          this,
          'POST',
          '/subscriptions',
          {
            callbackUrl,
            event,
            name: `${event}`.split('_').join(' ').toLowerCase(),
            headers: [
              {
                key: 'user-agent',
                value: `${credentials.subDomain}/1.0`,
              },
              {
                key: 'x-fulfillmenttools-event',
                value: event,
              },
              {
                key: 'x-fulfillmenttools-token',
                value: credentials.webhookToken,
              },
            ],
          },
        )) as Subscription;

        if (responseData.id === undefined) {
          return false;
        }

        staticData.subscriptionId = responseData.id;

        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        const staticData = this.getWorkflowStaticData('node') as StaticData;

        if (staticData.subscriptionId === undefined) {
          return true;
        }

        try {
          await fulfillmenttoolsApiRequest.call(
            this,
            'DELETE',
            `/subscriptions/${staticData.subscriptionId}`,
          );
        } catch (error) {
          return false;
        }

        delete staticData.subscriptionId;

        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const headerData = this.getHeaderData() as HeaderData;

    if (
      headerData['x-fulfillmenttools-event'] === undefined ||
      headerData['x-fulfillmenttools-token'] === undefined
    ) {
      return {};
    }

    const event = this.getNodeParameter('event') as string;

    if (headerData['x-fulfillmenttools-event'] !== event) {
      return {};
    }

    const credentials = (await this.getCredentials(
      'fulfillmenttoolsApi',
    )) as Credentials;

    if (headerData['x-fulfillmenttools-token'] !== credentials.webhookToken) {
      return {};
    }

    const req = this.getRequestObject();

    return {
      workflowData: [this.helpers.returnJsonArray(req.body as IDataObject)],
    };
  }
}
