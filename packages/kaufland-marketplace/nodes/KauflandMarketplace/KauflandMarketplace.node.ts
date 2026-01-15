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
import { NodeConnectionTypes } from 'n8n-workflow';

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
    const baseUrl = 'https://sellerapi.kaufland.com';

    const items = this.getInputData();
    let responseData: IDataObject | IDataObject[];
    const returnData: IDataObject | IDataObject[] = [];

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;
      responseData = [];
      if (resource === 'orders') {
        if (operation === 'getOne') {
          const orderId = this.getNodeParameter('id', i) as string;

          const requestData: KauflandRequestData = {
            method: 'GET',
            uri: `${baseUrl}/v2/orders/${orderId}`,
            body: '',
          };

          responseData = await kauflandMarketplaceRequestAllItems(
            this,
            requestData,
          );

          returnData.push(responseData);
        } else if (operation === 'getAll') {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const includeFbk = this.getNodeParameter('includeFbk', i) as boolean;

          const qs: IDataObject = { limit, offset };
          if (includeFbk) qs['filter'] = 'fulfilment_type eq FBK';

          const endpoint = `${baseUrl}/v2/orders`;

          const requestData: KauflandRequestData = {
            method: 'GET',
            uri: endpoint,
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
          const orderUnits = this.getNodeParameter('orderUnits', i) as Record<
            string,
            unknown
          >[];

          const requestData: KauflandRequestData = {
            method: 'POST',
            uri: `${baseUrl}/v2/returns`,
            body: orderUnits,
          };

          responseData = await kauflandMarketplaceRequestAllItems(
            this,
            requestData,
          );

          returnData.push(responseData);
        } else if (operation === 'retrievingReturnInformationStatus') {
          const status = this.getNodeParameter('status', i) as string[];
          const query = '?' + status.map((s) => `status=${s}`).join('&');

          const requestData: KauflandRequestData = {
            method: 'GET',
            uri: `${baseUrl}/v2/returns${query}`,
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
            uri: `${baseUrl}/v2/returns${query}`,
            body: '',
          };

          responseData = await kauflandMarketplaceRequestAllItems(
            this,
            requestData,
          );

          returnData.push(responseData);
        } else if (operation === 'retrievingReturnInformationId') {
          const returnId = this.getNodeParameter('returnId', i) as string;
          const embedReturnUnits = this.getNodeParameter(
            'embedReturnUnits',
            0,
          ) as boolean;
          const embedBuyer = this.getNodeParameter('embedBuyer', i) as boolean;

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
            uri: `${baseUrl}/v2/returns/${returnId}${query}`,
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
              body = { message: this.getNodeParameter('message', i) as string };
              break;
            case 'rejectingReturns':
              uriAction = 'reject';
              body = { message: this.getNodeParameter('message', i) as string };
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
            uri: `${baseUrl}/v2/return-units/${returnUnitId}/${uriAction}`,
            body,
          };

          responseData = await kauflandMarketplaceRequestAllItems(
            this,
            requestData,
          );

          returnData.push(responseData);
        }
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
