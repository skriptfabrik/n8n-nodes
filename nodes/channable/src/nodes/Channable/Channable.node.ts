import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import { ChannableRequest, ChannableRequestData } from './GenericFunctions';
import {
  ordersOperations,
  ordersFields,
} from './Descriptions/OrdersDescription';
import {
  returnsOperations,
  returnsFields,
} from './Descriptions/ReturnsDescription';
import {
  stockUpdatesOperations,
  stockUpdatesFields,
} from './Descriptions/StockUpdatesDescription';
export class Channable implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Channable',
    name: 'channable',
    icon: 'file:icons/Channable.svg',
    group: ['transform'],
    version: 1,
    documentationUrl: 'https://api.channable.com/v1/docs#section/Introduction',
    subtitle: '={{ $parameter["resource"] + ": " + $parameter["operation"] }}',
    description: 'Consume Channable API',
    defaults: {
      name: 'Channable',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'channableApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Project ID',
        name: 'projectId',
        type: 'string',
        placeholder: '',
        default: '',
      },
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
          {
            name: 'Stock Update',
            value: 'stockUpdates',
          },
        ],
        default: 'returns',
        required: true,
      },
      ...ordersOperations,
      ...ordersFields,
      ...returnsOperations,
      ...returnsFields,
      ...stockUpdatesOperations,
      ...stockUpdatesFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: IDataObject | IDataObject[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      if (resource === 'orders') {
        if (operation === 'getOne') {
          const orderId = this.getNodeParameter('id', 0) as string;

          const requestData: ChannableRequestData = {
            method: 'GET',
            uri: `/orders/${orderId}`,
            body: '',
          };

          const orderData: IDataObject[] = await ChannableRequest(
            this,
            requestData,
            i,
          );

          returnData.push({ ...orderData[0] });
        } else if (operation === 'returnManual') {
          const orderId = this.getNodeParameter('id', 0) as string;
          const products = this.getNodeParameter('products', 0) as string;

          const requestData: ChannableRequestData = {
            method: 'POST',
            uri: `/orders/${orderId}/return`,
            body: {
              products,
            },
          };

          const result: IDataObject[] = await ChannableRequest(
            this,
            requestData,
            i,
          );

          returnData.push({ result });
        }
      } else if (resource === 'stockUpdates') {
        if (operation === 'updateStock') {
          const stocks = this.getNodeParameter('stocks', 0) as string;

          const requestData: ChannableRequestData = {
            method: 'POST',
            uri: `/stock_updates`,
            body: stocks,
          };

          const result: IDataObject[] = await ChannableRequest(
            this,
            requestData,
            i,
          );

          returnData.push({ result });
        }
      } else if (resource === 'returns') {
        if (operation == 'list' || operation == 'listAnonymized') {
          const options = this.getNodeParameter(
            'additionalFields',
            0,
          ) as Record<string, boolean | string>;

          const qs: IDataObject = {
            ...options,
          };

          const requestData: ChannableRequestData = {
            method: 'GET',
            uri: `/${operation === 'list' ? 'returns' : 'anonymous_returns'}`,
            body: '',
            qs,
          };

          const returns: IDataObject[] = await ChannableRequest(
            this,
            requestData,
            i,
          );

          returnData.push({ returns });
        } else if (operation === 'getOne') {
          const returnId = this.getNodeParameter('id', 0) as string;

          const requestData: ChannableRequestData = {
            method: 'GET',
            uri: `/returns/${returnId}`,
            body: '',
          };

          const returnData: IDataObject[] = await ChannableRequest(
            this,
            requestData,
            i,
          );

          returnData.push({ returnData });
        } else if (operation === 'createTest') {
          const order_id = this.getNodeParameter('id', 0) as number;

          const requestData: ChannableRequestData = {
            method: 'POST',
            uri: `/returns/test`,
            body: {
              order_id,
            },
          };

          const returnData: IDataObject[] = await ChannableRequest(
            this,
            requestData,
            i,
          );

          returnData.push({ returnData });
        } else if (operation === 'update') {
          const returnId = this.getNodeParameter('id', 0) as string;
          const status = this.getNodeParameter('status', 0) as string;

          const requestData: ChannableRequestData = {
            method: 'POST',
            uri: `/returns/${returnId}/status`,
            body: {
              status,
            },
          };

          const returnData: IDataObject[] = await ChannableRequest(
            this,
            requestData,
            i,
          );

          returnData.push({ returnData });
        }
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
