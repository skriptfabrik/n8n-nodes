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
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Retrieve a paginated list of orders',
        action: 'Get many orders',
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
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 250 },
    default: 100,
    displayOptions: {
      show: {
        resource: ['orders'],
        operation: ['getAll'],
      },
    },
    description: 'Maximum items per page (max. 250)',
  },
  {
    displayName: 'Offset',
    name: 'offset',
    type: 'number',
    default: 0,
    displayOptions: {
      show: {
        resource: ['orders'],
        operation: ['getAll'],
      },
    },
    description: 'Skip the first n items (for pagination)',
  },
  {
    displayName: 'Include FBK Orders',
    name: 'includeFbk',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['orders'],
        operation: ['getAll'],
      },
    },
    description:
      'Include orders fulfilled by Kaufland (FBK). Sets filter=fulfilment_type eq FBK',
  },
];
