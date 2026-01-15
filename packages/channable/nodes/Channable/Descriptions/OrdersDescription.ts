import type { INodeProperties } from 'n8n-workflow';

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
      {
        name: 'Manual Return',
        value: 'returnManual',
        description: 'Return a order manually',
        action: 'Manual order return',
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
        operation: ['getOne', 'returnManual'],
        resource: ['orders'],
      },
    },
    placeholder: '',
    default: undefined,
    required: true,
    description: 'Unique order ID',
  },
  {
    displayName: 'Products (Json)',
    name: 'products',
    type: 'json',
    displayOptions: {
      show: {
        operation: ['returnManual'],
        resource: ['orders'],
      },
    },
    placeholder: '',
    default: '[]',
    description: 'Array of objects (Products)',
    typeOptions: {
      alwaysOpenEditWindow: true,
    },
  },
];
