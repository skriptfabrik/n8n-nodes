import type { INodeProperties } from 'n8n-workflow';

export const applicationVersionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['applicationVersion'],
      },
    },
    options: [
      {
        name: 'Search',
        value: 'search',
        description:
          'Search application versions meeting the specified filter value',
        action: 'Search application versions',
      },
    ],
    default: 'search',
  },
];

export const applicationVersionFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------------- */
  /*                             applicationVersion:search                            */
  /* -------------------------------------------------------------------------------- */
  {
    displayName: 'Application Version Name or ID',
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
        resource: ['applicationVersion'],
        operation: ['search'],
      },
    },
  },
  {
    displayName: 'Filter',
    name: 'version',
    type: 'string',
    default: '',
    description:
      'Search application versions meeting the specified filter value',
    placeholder: 'Leave empty to list all application versions',
    displayOptions: {
      show: {
        resource: ['applicationVersion'],
        operation: ['search'],
      },
    },
  },
];
