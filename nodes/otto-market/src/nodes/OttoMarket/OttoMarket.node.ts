import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { OttoMarketRequest, OttoMarketRequestData } from './GenericFunctions';
import {
  returnsOperations,
  returnsFields,
} from './Descriptions/ReturnsDescription';
import {
  ordersOperations,
  ordersFields,
} from './Descriptions/OrdersDescription';
export class OttoMarket implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Otto Market',
    name: 'ottoMarket',
    icon: 'file:icons/Otto.svg',
    group: ['transform'],
    version: 1,
    documentationUrl: 'https://api.otto.market/docs#section/Home',
    subtitle: '={{ $parameter["resource"] + ": " + $parameter["operation"] }}',
    description: 'Consume Otto Market API',
    defaults: {
      name: 'Otto Market',
    },
    inputs: ['main'],
    outputs: ['main'],
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

          const orderData: IDataObject[] = await OttoMarketRequest(
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

          const positionItems: IDataObject[] = await OttoMarketRequest(
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

          responseData = await OttoMarketRequest<IDataObject>(
            this,
            requestData,
            i,
          );

          returnData.push({ data: responseData });
        }
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
