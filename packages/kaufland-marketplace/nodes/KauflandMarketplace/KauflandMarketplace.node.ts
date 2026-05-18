import {
  ordersOperations,
  ordersFields,
} from './Descriptions/OrdersDescription';
import {
  returnsOperations,
  returnsFields,
} from './Descriptions/ReturnsDescription';
import {
  kauflandMarketplaceRequestAllItems,
  type KauflandRequestData,
} from './GenericFunctions';
import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes } from 'n8n-workflow';

export class KauflandMarketplace implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Kaufland Marketplace',
    name: 'kauflandMarketplace',
    documentationUrl: 'https://sellerapi.kaufland.com/',
    icon: 'file:../../icons/Kaufland.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{ $parameter["resource"] + ": " + $parameter["operation"] }}',
    description: 'Consume Kaufland Marketplace API',
    defaults: {
      name: 'Kaufland Marketplace',
    },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: 'kauflandMarketplaceApi',
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
            name: 'Order',
            value: 'orders',
          },
          {
            name: 'Return',
            value: 'returns',
          },
        ],
        default: 'returns',
        required: true,
      },
      ...returnsOperations,
      ...returnsFields,
      ...ordersOperations,
      ...ordersFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    let responseData: IDataObject | IDataObject[] = [];
    const returnData: IDataObject | IDataObject[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let item = 0; item < items.length; item++) {
      try {
        if (resource === 'orders') {
          if (operation === 'getOne') {
            const orderId = this.getNodeParameter('id', item) as string;

            const requestData: KauflandRequestData = {
              method: 'GET',
              uri: `/orders/${orderId}`,
              body: '',
            };

            responseData = await kauflandMarketplaceRequestAllItems(
              this,
              requestData,
            );

            returnData.push(responseData);
          } else if (operation === 'getAll') {
            const limit = this.getNodeParameter('limit', item) as number;
            const offset = this.getNodeParameter('offset', item) as number;
            const includeFbk = this.getNodeParameter(
              'includeFbk',
              item,
            ) as boolean;

            const qs: IDataObject = { limit, offset };
            if (includeFbk) qs['filter'] = 'fulfilment_type eq FBK';

            const requestData: KauflandRequestData = {
              method: 'GET',
              uri: '/orders',
              body: '',
              qs,
            };

            const responseData = await kauflandMarketplaceRequestAllItems(
              this,
              requestData,
            );

            returnData.push(...(responseData.data as IDataObject[]));
          }
        } else if (resource === 'returns') {
          if (operation === 'returningOrderUnits') {
            const orderUnits = this.getNodeParameter(
              'orderUnits',
              item,
            ) as Record<string, unknown>[];

            const requestData: KauflandRequestData = {
              method: 'POST',
              uri: '/returns',
              body: orderUnits,
            };

            responseData = await kauflandMarketplaceRequestAllItems(
              this,
              requestData,
            );

            returnData.push(responseData);
          } else if (operation === 'retrievingReturnInformationStatus') {
            const status = this.getNodeParameter('status', item) as string[];
            const query = '?' + status.map((s) => `status=${s}`).join('&');

            const requestData: KauflandRequestData = {
              method: 'GET',
              uri: `/returns${query}`,
              body: '',
            };

            responseData = await kauflandMarketplaceRequestAllItems(
              this,
              requestData,
            );

            returnData.push(responseData);
          } else if (operation === 'retrievingReturnInformationTracking') {
            const trackingcode = this.getNodeParameter(
              'trackingcode',
              0,
            ) as string;
            const query = '?tracking_code=' + trackingcode;

            const requestData: KauflandRequestData = {
              method: 'GET',
              uri: `/returns${query}`,
              body: '',
            };

            responseData = await kauflandMarketplaceRequestAllItems(
              this,
              requestData,
            );

            returnData.push(responseData);
          } else if (operation === 'retrievingReturnInformationId') {
            const returnId = this.getNodeParameter('returnId', item) as string;
            const embedReturnUnits = this.getNodeParameter(
              'embedReturnUnits',
              0,
            ) as boolean;
            const embedBuyer = this.getNodeParameter(
              'embedBuyer',
              item,
            ) as boolean;

            const embeds: string[] = [];
            let query = '';

            if (embedBuyer) {
              embeds.push('buyer');
            }
            if (embedReturnUnits) {
              embeds.push('return_units');
            }
            query = '?' + embeds.map((s) => `status=${s}`).join('&');

            const requestData: KauflandRequestData = {
              method: 'GET',
              uri: `/returns/${returnId}${query}`,
              body: '',
            };

            responseData = await kauflandMarketplaceRequestAllItems(
              this,
              requestData,
            );

            returnData.push(responseData);
          } else if (
            [
              'clarifyingReturns',
              'repairingReturns',
              'rejectingReturns',
              'acceptingReturns',
            ].includes(operation)
          ) {
            const returnUnitId = this.getNodeParameter(
              'returnUnitId',
              0,
            ) as string;
            let uriAction = 'accept';
            let body: { message: string } | string = '';

            switch (operation) {
              case 'clarifyingReturns':
                uriAction = 'clarify';
                body = {
                  message: this.getNodeParameter('message', item) as string,
                };
                break;
              case 'rejectingReturns':
                uriAction = 'reject';
                body = {
                  message: this.getNodeParameter('message', item) as string,
                };
                break;
              case 'repairingReturns':
                uriAction = 'repair';
                break;
              case 'acceptingReturns':
                uriAction = 'accept';
                break;
            }

            const requestData: KauflandRequestData = {
              method: 'PATCH',
              uri: `/return-units/${returnUnitId}/${uriAction}`,
              body,
            };

            responseData = await kauflandMarketplaceRequestAllItems(
              this,
              requestData,
            );

            returnData.push(responseData);
          }
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as NodeApiError).message },
            pairedItem: { item },
          });
          continue;
        }

        throw new NodeApiError(this.getNode(), error);
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
