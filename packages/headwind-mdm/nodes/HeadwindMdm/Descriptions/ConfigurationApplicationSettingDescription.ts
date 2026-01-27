import type { INodeProperties } from 'n8n-workflow';

export const configurationApplicationSettingOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['configurationApplicationSetting'],
      },
    },
    options: [
      {
        name: 'Search',
        value: 'search',
        description:
          'Search configuration application settings meeting the specified filter value',
        action: 'Search configuration application settings',
      },
      {
        name: 'Update',
        value: 'update',
        description:
          'Update application setting for the specified configuration and application',
        action: 'Update configuration application setting',
      },
    ],
    default: 'search',
  },
];

export const configurationApplicationSettingFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------------- */
  /*                      configurationApplicationSetting:search                      */
  /* -------------------------------------------------------------------------------- */
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
    required: true,
    displayOptions: {
      show: {
        resource: ['configurationApplicationSetting'],
        operation: ['search'],
      },
    },
  },
  {
    displayName: 'Filter',
    name: 'applicationPkg',
    type: 'string',
    default: '',
    description: 'A filter to search configuration application settings',
    placeholder: 'Leave empty to list all configuration application settings',
    displayOptions: {
      show: {
        resource: ['configurationApplicationSetting'],
        operation: ['search'],
      },
    },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    placeholder: 'Add Field',
    type: 'collection',
    default: {},
    displayOptions: {
      show: {
        resource: ['configurationApplicationSetting'],
        operation: ['search'],
      },
    },
    options: [
      {
        displayName: 'Application Name',
        name: 'applicationName',
        type: 'string',
        default: '',
        description:
          'The name of the application to filter configuration application settings by',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description:
          'The name of the configuration application setting to update',
      },
    ],
  },
  /* -------------------------------------------------------------------------------- */
  /*                      configurationApplicationSetting:update                      */
  /* -------------------------------------------------------------------------------- */
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
    required: true,
    displayOptions: {
      show: {
        resource: ['configurationApplicationSetting'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Application Name or ID',
    name: 'applicationId',
    type: 'options',
    typeOptions: {
      loadOptionsDependsOn: ['configurationId'],
      loadOptionsMethod: 'listApplications',
    },
    default: '',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    required: true,
    displayOptions: {
      show: {
        resource: ['configurationApplicationSetting'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    required: true,
    description: 'The name of the configuration application setting to update',
    displayOptions: {
      show: {
        resource: ['configurationApplicationSetting'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Value',
    name: 'value',
    type: 'string',
    default: '',
    required: true,
    description: 'The new value for the configuration application setting',
    displayOptions: {
      show: {
        resource: ['configurationApplicationSetting'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    placeholder: 'Add Field',
    type: 'collection',
    default: {},
    displayOptions: {
      show: {
        resource: ['configurationApplicationSetting'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description:
          'A comment to set for the configuration application setting',
      },
    ],
  },
];
