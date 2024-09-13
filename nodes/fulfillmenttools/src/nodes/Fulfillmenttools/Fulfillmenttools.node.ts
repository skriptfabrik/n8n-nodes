import {
  NodeConnectionType,
  type IDataObject,
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeType,
  type INodeTypeDescription,
  type NodeApiError,
} from 'n8n-workflow';
import type { components, operations } from '../../api';
import {
  fulfillmenttoolsApiRequest,
  fulfillmenttoolsApiRequestAllItems,
} from './GenericFunctions';
import {
  facilityFields,
  facilityOperations,
} from './descriptions/FacilityDescription';
import {
  facilityCarrierFields,
  facilityCarrierOperations,
} from './descriptions/FacilityCarrierDescription';
import { orderFields, orderOperations } from './descriptions/OrderDescription';

type FacilityForCreation = components['schemas']['FacilityForCreation'];
type Facility = components['schemas']['Facility'];
type GetAllFacilitiesQueryParameters =
  operations['getAllFacilities']['parameters']['query'];
type StrippedFacilities = components['schemas']['StrippedFacilities'];
type FacilityPatchActions = components['schemas']['FacilityPatchActions'];

type CreateCarrierToFacilityQueryParameters =
  operations['createCarrierToFacility']['parameters']['query'];
type FacilityCarrierConnectionForCreation =
  components['schemas']['FacilityCarrierConnectionForCreation'];
type GetFacilityCarrierQueryParameters =
  operations['getFacilityCarrier']['parameters']['query'];
type FacilityCarrierConnection =
  components['schemas']['FacilityCarrierConnection'];
type StrippedCarriers = components['schemas']['StrippedCarriers'];
type ConnectCarrierToFacilityQueryParameters =
  operations['connectCarrierToFacility']['parameters']['query'];
type FacilityCarrierConnectionForModification =
  components['schemas']['FacilityCarrierConnectionForModification'];

type OrderForCreation = components['schemas']['OrderForCreation'];
type Order = components['schemas']['Order'];
type GetAllOrdersQueryParameters =
  operations['getAllOrders']['parameters']['query'];
type StrippedOrders = components['schemas']['StrippedOrders'];

export class Fulfillmenttools implements INodeType {
  description: INodeTypeDescription = {
    name: 'fulfillmenttools',

    displayName: 'fulfillmenttools',

    icon: 'file:icons/fulfillmenttools.svg',

    group: ['transform'],

    version: 1,

    subtitle: '={{$parameter["operation"] + " " + $parameter["resource"]}}',

    description: 'Consume fulfillmenttools API',

    defaults: {
      name: 'fulfillmenttools',
    },

    inputs: [NodeConnectionType.Main],

    outputs: [NodeConnectionType.Main],

    credentials: [
      {
        name: 'fulfillmenttoolsApi',
        required: true,
      },
    ],

    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Facility',
            value: 'facility',
          },
          {
            name: 'Facility Carrier',
            value: 'facilityCarrier',
          },
          {
            name: 'Order',
            value: 'order',
          },
        ],
        default: 'order',
      },
      ...facilityOperations,
      ...facilityFields,
      ...facilityCarrierOperations,
      ...facilityCarrierFields,
      ...orderOperations,
      ...orderFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();

    const returnData: INodeExecutionData[] = [];

    let responseData: IDataObject | IDataObject[] = {};

    const resource = this.getNodeParameter('resource', 0) as string;

    const operation = this.getNodeParameter('operation', 0) as string;

    for (let item = 0; item < items.length; item++) {
      try {
        if (resource === 'facility') {
          if (operation === 'create') {
            const body = this.getNodeParameter(
              'facility',
              item,
            ) as FacilityForCreation;

            responseData = (await fulfillmenttoolsApiRequest.call(
              this,
              'POST',
              '/facilities',
              body,
            )) as Facility;
          }

          if (operation === 'delete') {
            const facilityId = this.getNodeParameter(
              'facilityId',
              item,
            ) as string;

            responseData = (await fulfillmenttoolsApiRequest.call(
              this,
              'DELETE',
              `/facilities/${facilityId}`,
            )) as Facility;
          }

          if (operation === 'get') {
            const facilityId = this.getNodeParameter(
              'facilityId',
              item,
            ) as string;

            responseData = (await fulfillmenttoolsApiRequest.call(
              this,
              'GET',
              `/facilities/${facilityId}`,
            )) as Facility;
          }

          if (operation === 'list') {
            const returnAll = this.getNodeParameter(
              'returnAll',
              item,
            ) as boolean;

            const qs = {
              ...(returnAll
                ? {}
                : {
                    limit: this.getNodeParameter('limit', item),
                    startAfterId:
                      this.getNodeParameter('startAfterId', item) || undefined,
                  }),
              size: this.getNodeParameter('size', item),
              status: this.getNodeParameter('status', item) || undefined,
              tenantFacilityId:
                this.getNodeParameter('tenantFacilityId', item) || undefined,
              orderBy: this.getNodeParameter('orderBy', item) || undefined,
            } as GetAllFacilitiesQueryParameters;

            responseData = (await fulfillmenttoolsApiRequestAllItems.call(
              this,
              'facilities',
              'GET',
              '/facilities',
              undefined,
              qs,
            )) as StrippedFacilities;
          }

          if (operation === 'patch') {
            const facilityId = this.getNodeParameter(
              'facilityId',
              item,
            ) as string;
            const body = this.getNodeParameter(
              'facility',
              item,
            ) as FacilityPatchActions;

            responseData = (await fulfillmenttoolsApiRequest.call(
              this,
              'PATCH',
              `/facilities/${facilityId}`,
              body,
            )) as Facility;
          }
        }

        if (resource === 'facilityCarrier') {
          if (operation === 'create') {
            const facilityId = this.getNodeParameter(
              'facilityId',
              item,
            ) as string;
            const carrierRef = this.getNodeParameter(
              'carrierRef',
              item,
            ) as string;
            const body = this.getNodeParameter(
              'facilityCarrier',
              item,
            ) as FacilityCarrierConnectionForCreation;
            const qs = {
              locale:
                (this.getNodeParameter('locale', item) as string) || undefined,
            } as CreateCarrierToFacilityQueryParameters;

            responseData = (await fulfillmenttoolsApiRequest.call(
              this,
              'POST',
              `/facilities/${facilityId}/carriers/${carrierRef}`,
              body,
              qs,
            )) as FacilityCarrierConnection;
          }

          if (operation === 'get') {
            const facilityId = this.getNodeParameter(
              'facilityId',
              item,
            ) as string;
            const carrierRef = this.getNodeParameter(
              'carrierRef',
              item,
            ) as string;
            const qs = {
              locale:
                (this.getNodeParameter('locale', item) as string) || undefined,
            } as GetFacilityCarrierQueryParameters;

            responseData = (await fulfillmenttoolsApiRequest.call(
              this,
              'GET',
              `/facilities/${facilityId}/carriers/${carrierRef}`,
              undefined,
              qs,
            )) as FacilityCarrierConnection;
          }

          if (operation === 'list') {
            const facilityId = this.getNodeParameter(
              'facilityId',
              item,
            ) as string;

            responseData = (await fulfillmenttoolsApiRequestAllItems.call(
              this,
              'carriers',
              'GET',
              `/facilities/${facilityId}/carriers`,
            )) as StrippedCarriers;
          }

          if (operation === 'connect') {
            const facilityId = this.getNodeParameter(
              'facilityId',
              item,
            ) as string;
            const carrierRef = this.getNodeParameter(
              'carrierRef',
              item,
            ) as string;
            const body = this.getNodeParameter(
              'facilityCarrier',
              item,
            ) as FacilityCarrierConnectionForModification;
            const qs = {
              locale:
                (this.getNodeParameter('locale', item) as string) || undefined,
            } as ConnectCarrierToFacilityQueryParameters;

            responseData = (await fulfillmenttoolsApiRequest.call(
              this,
              'PUT',
              `/facilities/${facilityId}/carriers/${carrierRef}`,
              body,
              qs,
            )) as FacilityCarrierConnection;
          }
        }

        if (resource === 'order') {
          if (operation === 'create') {
            const body = this.getNodeParameter(
              'order',
              item,
            ) as OrderForCreation;

            responseData = (await fulfillmenttoolsApiRequest.call(
              this,
              'POST',
              '/orders',
              body,
            )) as Order;
          }

          if (operation === 'get') {
            const orderId = this.getNodeParameter('orderId', item) as string;

            responseData = (await fulfillmenttoolsApiRequest.call(
              this,
              'GET',
              `/orders/${orderId}`,
            )) as Order;
          }

          if (operation === 'list') {
            const returnAll = this.getNodeParameter(
              'returnAll',
              item,
            ) as boolean;

            const qs = {
              ...(returnAll
                ? {}
                : {
                    limit: this.getNodeParameter('limit', item),
                    startAfterId:
                      this.getNodeParameter('startAfterId', item) || undefined,
                  }),
              size: this.getNodeParameter('size', item),
              tenantOrderId:
                this.getNodeParameter('tenantOrderId', item) || undefined,
            } as GetAllOrdersQueryParameters;

            responseData = (await fulfillmenttoolsApiRequestAllItems.call(
              this,
              'orders',
              'GET',
              '/orders',
              undefined,
              qs,
            )) as StrippedOrders;
          }
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData),
          { itemData: { item } },
        );

        returnData.push(...executionData);
      } catch (error: unknown) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as NodeApiError).message,
            },
            pairedItem: {
              item,
            },
          });
          continue;
        }

        throw error;
      }
    }

    return [returnData];
  }
}
