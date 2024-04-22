import { INodeProperties } from 'n8n-workflow';

export const ordersOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['orders'],
      },
    },
    options: [
      {
        name: 'Get Order',
        value: 'getOne',
        description: 'Get order by identifier',
        action: 'Get one order',
      },
    ],
    default: 'getOne',
  },
];

export const ordersFields: INodeProperties[] = [
  {
    displayName: 'Order Identifier',
    name: 'id',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['getOne'],
        resource: ['orders'],
      },
    },
    placeholder: '',
    default: undefined,
    required: true,
    description: 'Unique order number or sales order ID',
  },
];
