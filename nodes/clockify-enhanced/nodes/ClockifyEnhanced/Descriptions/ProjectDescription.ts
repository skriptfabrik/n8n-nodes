import type { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['project'],
      },
    },
    options: [
      {
        name: 'Update',
        value: 'update',
        description: 'Update a project',
        action: 'Update a project',
      },
    ],
    default: 'update',
  },
];

export const projectFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                 project:update                             */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Project Name or ID',
    name: 'projectId',
    type: 'options',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    typeOptions: {
      loadOptionsDependsOn: ['workspaceId'],
      loadOptionsMethod: 'loadProjects',
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        operation: ['update'],
        resource: ['project'],
      },
    },
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        operation: ['update'],
        resource: ['project'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Archived',
        name: 'archived',
        type: 'boolean',
        default: false,
        description: 'Whether project is archived or not',
      },
      {
        displayName: 'Billable',
        name: 'billable',
        type: 'boolean',
        default: true,
        description: 'Whether project is billable or not',
      },
      {
        displayName: 'Client Name or ID',
        name: 'clientId',
        type: 'options',
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        typeOptions: {
          loadOptionsDependsOn: ['workspaceId'],
          loadOptionsMethod: 'loadClients',
        },
        default: '',
      },
      {
        displayName: 'Color',
        name: 'color',
        type: 'color',
        default: '#0000FF',
        description:
          "Color format ^#(?:[0-9a-fA-F]{6}){1}$. Explanation: A valid color code should start with '#' and consist of six hexadecimal characters, representing a color in hexadecimal format. Color value is in standard RGB hexadecimal format",
      },
      {
        displayName: 'Is Public',
        name: 'isPublic',
        type: 'boolean',
        default: false,
        description: 'Whether project is public or not',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description:
          'Name of the project which must be at least 2 characters long and less than 250 characters',
      },
      {
        displayName: 'Note',
        name: 'note',
        type: 'string',
        default: '',
        description: 'Note about the project',
      },
    ],
  },
];
