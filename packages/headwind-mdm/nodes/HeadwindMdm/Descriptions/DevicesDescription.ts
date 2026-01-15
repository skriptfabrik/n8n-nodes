import type { INodeProperties } from 'n8n-workflow';

export const devicesOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['device'],
      },
    },
    options: [
      {
        name: 'Search Devices',
        value: 'search',
        description: 'Search devices meeting the specified filter value',
        action: 'Search devices',
      },
    ],
    default: 'search',
  },
];

export const devicesFields: INodeProperties[] = [
  {
    displayName: 'Search Term',
    name: 'value',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['search'],
        resource: ['device'],
      },
    },
    placeholder: '',
    default: undefined,
    required: true,
  },
  {
    displayName: 'Additional Search Parameters (Json)',
    name: 'searchParams',
    type: 'json',
    displayOptions: {
      show: {
        operation: ['search'],
        resource: ['device'],
      },
    },
    placeholder: '',
    default: '{}',
    description: 'Object of additional search parameters',
    typeOptions: {
      alwaysOpenEditWindow: true,
    },
  },
];
