import type { INodeProperties } from 'n8n-workflow';

export const deviceOperations: INodeProperties[] = [
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
        name: 'Search',
        value: 'search',
        description: 'Search devices meeting the specified filter value',
        action: 'Search devices',
      },
    ],
    default: 'search',
  },
];

export const deviceFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------------- */
  /*                                  device:search                                   */
  /* -------------------------------------------------------------------------------- */
  {
    displayName: 'Filter',
    name: 'value',
    type: 'string',
    default: '',
    description: 'A filter to search devices',
    placeholder: 'Leave empty to list all devices',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['search'],
      },
    },
  },
  {
    displayName: 'Options',
    name: 'options',
    placeholder: 'Add Option',
    type: 'collection',
    default: {},
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['search'],
      },
    },
    options: [
      {
        displayName: 'Configuration Name or ID',
        name: 'configurationId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'listConfigurations',
        },
        default: '',
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
      {
        displayName: 'Device Group Name or ID',
        name: 'groupId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'listDeviceGroups',
        },
        default: '',
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
      {
        displayName: 'Embed Configuration',
        name: 'embedConfiguration',
        type: 'boolean',
        default: false,
        description: 'Whether to embed configuration in the response',
      },
      {
        displayName: 'Use Fast Search',
        name: 'fastSearch',
        type: 'boolean',
        default: false,
        description: 'Whether to use fast searching by device number',
      },
    ],
  },
];
