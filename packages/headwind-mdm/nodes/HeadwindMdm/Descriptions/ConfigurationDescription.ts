import type { INodeProperties } from 'n8n-workflow';

export const configurationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['configuration'],
      },
    },
    options: [
      {
        name: 'Search',
        value: 'search',
        description: 'Search configurations meeting the specified filter value',
        action: 'Search configurations',
      },
      {
        name: 'Get',
        value: 'get',
        description:
          'Gets the details for configuration referenced by the specified ID',
        action: 'Get configuration',
      },
    ],
    default: 'search',
  },
];

export const configurationFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------------- */
  /*                               configuration:search                               */
  /* -------------------------------------------------------------------------------- */
  {
    displayName: 'Filter',
    name: 'value',
    type: 'string',
    default: '',
    description: 'Searches configurations meeting the specified filter value',
    placeholder: 'Leave empty to list all configurations',
    displayOptions: {
      show: {
        resource: ['configuration'],
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
        resource: ['configuration'],
        operation: ['search'],
      },
    },
    options: [
      {
        displayName: 'Applications Filter',
        name: 'applicationsFilter',
        type: 'string',
        default: '',
        description: 'A filter to apply to the embedded applications',
      },
      {
        displayName: 'Embed Applications',
        name: 'embedApplications',
        type: 'boolean',
        default: false,
        description: 'Whether to embed applications in the response',
      },
    ],
  },
  /* -------------------------------------------------------------------------------- */
  /*                               configuration:get                                  */
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
        resource: ['configuration'],
        operation: ['get'],
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
        resource: ['configuration'],
        operation: ['get'],
      },
    },
    options: [
      {
        displayName: 'Applications Filter',
        name: 'applicationsFilter',
        type: 'string',
        default: '',
        description: 'A filter to apply to the embedded applications',
      },
      {
        displayName: 'Embed Applications',
        name: 'embedApplications',
        type: 'boolean',
        default: false,
        description: 'Whether to embed applications in the response',
      },
    ],
  },
];
