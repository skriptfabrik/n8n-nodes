import type { INodeProperties } from 'n8n-workflow';

export const deviceGroupOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['deviceGroup'],
      },
    },
    options: [
      {
        name: 'Search',
        value: 'search',
        description: 'Search device groups meeting the specified filter value',
        action: 'Search device groups',
      },
    ],
    default: 'search',
  },
];

export const deviceGroupFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------------- */
  /*                                deviceGroup:search                                */
  /* -------------------------------------------------------------------------------- */
  {
    displayName: 'Filter',
    name: 'value',
    type: 'string',
    default: '',
    description: 'Searches device groups meeting the specified filter value',
    placeholder: 'Leave empty to list all device groups',
    displayOptions: {
      show: {
        resource: ['deviceGroup'],
        operation: ['search'],
      },
    },
  },
];
