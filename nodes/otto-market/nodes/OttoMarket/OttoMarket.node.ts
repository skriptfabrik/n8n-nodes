import {
  ordersOperations,
  ordersFields,
} from './Descriptions/OrdersDescription';
import {
  returnsOperations,
  returnsFields,
} from './Descriptions/ReturnsDescription';
import {
  ottoMarketApiRequest,
  OttoMarketRequestData,
} from './GenericFunctions';
import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

export class OttoMarket implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'OTTO Market',
    name: 'ottoMarket',
    icon: 'file:../../icons/Otto.svg',
    group: ['transform'],
    version: 1,
    documentationUrl: 'https://api.otto.market/docs#section/Home',
    subtitle: '={{ $parameter["resource"] + ": " + $parameter["operation"] }}',
    description: 'Consume OTTO Market API',
    defaults: {
      name: 'OTTO Market',
    },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: 'ottoMarketApi',
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
    let endpoint = '';

    const items = this.getInputData();
    let responseData: IDataObject | IDataObject[];
    const returnData: IDataObject | IDataObject[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      if (resource === 'orders') {
        if (operation === 'getOne') {
          const orderId = this.getNodeParameter('id', 0) as string;

          const requestData: OttoMarketRequestData = {
            method: 'GET',
            uri: `/v4/orders/${orderId}`,
            body: '',
          };

          const orderData = await ottoMarketApiRequest.call(
            this,
            requestData,
            i,
          );

          returnData.push({ orderData });
        }
      } else if (resource === 'returns') {
        if (operation == 'list') {
          const status = this.getNodeParameter('status', 0) as string;

          const query = `?limit=50&page=1&status=${status}`;

          const requestData: OttoMarketRequestData = {
            method: 'GET',
            uri: `/v2/returns` + query,
            body: '',
          };

          const positionItems = await ottoMarketApiRequest.call(
            this,
            requestData,
            i,
          );

          returnData.push({ positionItems });
        } else if (operation == 'accept' || operation == 'reject') {
          switch (operation) {
            case 'accept':
              endpoint = `/v2/returns/acceptance`;
              break;
            case 'reject':
              endpoint = `/v2/returns/rejection`;
              break;
          }

          const positionItems = this.getNodeParameter(
            'positionItems',
            0,
          ) as string;

          const requestData: OttoMarketRequestData = {
            method: 'POST',
            uri: endpoint,
            body: {
              positionItems,
            },
          };

          responseData = await ottoMarketApiRequest.call(this, requestData, i);

          returnData.push({ data: responseData });
        }
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
