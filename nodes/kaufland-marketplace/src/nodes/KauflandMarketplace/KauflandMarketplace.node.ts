import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import {
  returnsOperations,
  returnsFields,
} from './Descriptions/ReturnsDescription';
import {
  ordersOperations,
  ordersFields,
} from './Descriptions/OrdersDescription';
import {
  kauflandMarketplaceRequest,
  type KauflandRequestData,
} from './GenericFunctions';
export class KauflandMarketplace implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Kaufland Marketplace',
    name: 'kauflandMarketplace',
    documentationUrl: 'https://sellerapi.kaufland.com/',
    icon: 'file:icons/Kaufland.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{ $parameter["resource"] + ": " + $parameter["operation"] }}',
    description: 'Consume Kaufland Marketplace API',
    defaults: {
      name: 'Kaufland Marketplace',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
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
    const baseUrl = 'https://sellerapi.kaufland.com/v2';

    const items = this.getInputData();
    let responseData: IDataObject | IDataObject[];
    const returnData: IDataObject | IDataObject[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      responseData = [];
      if (resource === 'orders') {
        if (operation === 'getOne') {
          const orderId = this.getNodeParameter('id', 0) as string;

          const requestData: KauflandRequestData = {
            method: 'GET',
            uri: `${baseUrl}/orders/${orderId}`,
            body: '',
          };

          responseData = await kauflandMarketplaceRequest(this, requestData);

          returnData.push(responseData);
        }
      } else if (resource === 'returns') {
        if (operation === 'returningOrderUnits') {
          const orderUnits = this.getNodeParameter('orderUnits', 0) as Record<
            string,
            unknown
          >[];

          const requestData: KauflandRequestData = {
            method: 'POST',
            uri: `${baseUrl}/returns`,
            body: orderUnits,
          };

          responseData = await kauflandMarketplaceRequest(this, requestData);

          returnData.push(responseData);
        } else if (operation === 'retrievingReturnInformationStatus') {
          const status = this.getNodeParameter('status', 0) as string[];
          const query = '?' + status.map((s) => `status=${s}`).join('&');

          const requestData: KauflandRequestData = {
            method: 'GET',
            uri: `${baseUrl}/returns${query}`,
            body: '',
          };

          responseData = await kauflandMarketplaceRequest(this, requestData);

          returnData.push(responseData);
        } else if (operation === 'retrievingReturnInformationTracking') {
          const trackingcode = this.getNodeParameter(
            'trackingcode',
            0,
          ) as string;
          const query = '?tracking_code=' + trackingcode;

          const requestData: KauflandRequestData = {
            method: 'GET',
            uri: `${baseUrl}/returns${query}`,
            body: '',
          };

          responseData = await kauflandMarketplaceRequest(this, requestData);

          returnData.push(responseData);
        } else if (operation === 'retrievingReturnInformationId') {
          const returnId = this.getNodeParameter('returnId', 0) as string;
          const embedReturnUnits = this.getNodeParameter(
            'embedReturnUnits',
            0,
          ) as boolean;
          const embedBuyer = this.getNodeParameter('embedBuyer', 0) as boolean;

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
            uri: `${baseUrl}/returns/${returnId}${query}`,
            body: '',
          };

          responseData = await kauflandMarketplaceRequest(this, requestData);

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
              body = { message: this.getNodeParameter('message', 0) as string };
              break;
            case 'rejectingReturns':
              uriAction = 'reject';
              body = { message: this.getNodeParameter('message', 0) as string };
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
            uri: `${baseUrl}/return-units/${returnUnitId}/${uriAction}`,
            body,
          };

          responseData = await kauflandMarketplaceRequest(this, requestData);

          returnData.push(responseData);
        }
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
