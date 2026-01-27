import type { INodeProperties } from 'n8n-workflow';

export const applicationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['application'],
      },
    },
    options: [
      {
        name: 'Search',
        value: 'search',
        description: 'Search applications meeting the specified filter value',
        action: 'Search applications',
      },
      {
        name: 'Get',
        value: 'get',
        description:
          'Gets the details for the application referenced by the specified ID',
        action: 'Get application',
      },
    ],
    default: 'search',
  },
];

export const applicationFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------------- */
  /*                               application:search                               */
  /* -------------------------------------------------------------------------------- */
  {
    displayName: 'Filter',
    name: 'value',
    type: 'string',
    default: '',
    description: 'Search applications meeting the specified filter value',
    placeholder: 'Leave empty to list all applications',
    displayOptions: {
      show: {
        resource: ['application'],
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
        resource: ['application'],
        operation: ['search'],
      },
    },
    options: [
      {
        displayName: 'Embed Configurations',
        name: 'embedConfigurations',
        type: 'boolean',
        default: false,
        description: 'Whether to embed configurations in the response',
      },
    ],
  },
  /* -------------------------------------------------------------------------------- */
  /*                               application:get                                  */
  /* -------------------------------------------------------------------------------- */
  {
    displayName: 'Application Name or ID',
    name: 'applicationId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'listApplications',
    },
    default: '',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    required: true,
    displayOptions: {
      show: {
        resource: ['application'],
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
        resource: ['application'],
        operation: ['get'],
      },
    },
    options: [
      {
        displayName: 'Embed Configurations',
        name: 'embedConfigurations',
        type: 'boolean',
        default: false,
        description: 'Whether to embed configurations in the response',
      },
    ],
  },
];
