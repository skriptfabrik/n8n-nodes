import type { INodeProperties } from 'n8n-workflow';

export const deviceApplicationSettingOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['deviceApplicationSetting'],
      },
    },
    options: [
      {
        name: 'Search',
        value: 'search',
        description:
          'Search configuration application settings meeting the specified filter value',
        action: 'Search device application settings',
      },
    ],
    default: 'search',
  },
];

export const deviceApplicationSettingFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------------- */
  /*                      deviceApplicationSetting:search                      */
  /* -------------------------------------------------------------------------------- */
  {
    displayName: 'Device Name or ID',
    name: 'deviceId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'listDevices',
    },
    default: '',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    required: true,
    displayOptions: {
      show: {
        resource: ['deviceApplicationSetting'],
        operation: ['search'],
      },
    },
  },
  {
    displayName: 'Filter',
    name: 'applicationPkg',
    type: 'string',
    default: '',
    description: 'A filter to search device application settings',
    placeholder: 'Leave empty to list all device application settings',
    displayOptions: {
      show: {
        resource: ['deviceApplicationSetting'],
        operation: ['search'],
      },
    },
  },
];
