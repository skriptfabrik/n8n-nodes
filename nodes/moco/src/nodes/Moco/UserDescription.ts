import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['user'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a staff member',
        action: 'Create a staff member',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a staff member',
        action: 'Delete a staff member',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Retrieve a single staff member',
        action: 'Retrieve a single staff member',
      },
      {
        name: 'List',
        value: 'list',
        description: 'Retrieve all staff members',
        action: 'Retrieve all staff members',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a staff member',
        action: 'Update a staff member',
      },
    ],
    default: 'create',
  },
];

export const userFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                 user:create                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'First Name',
    name: 'firstname',
    type: 'string',
    required: true,
    default: '',
    description: 'Firstname of user being created',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Last Name',
    name: 'lastname',
    type: 'string',
    required: true,
    default: '',
    description: 'Lastname of user being created',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    typeOptions: {
      email: true,
    },
    placeholder: 'name@email.com',
    required: true,
    default: '',
    description: 'Email of user being created',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Password',
    name: 'password',
    type: 'string',
    typeOptions: {
      password: true,
    },
    required: true,
    default: '',
    description: 'Password of user being created',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Team Name or ID',
    name: 'unitId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'listTeams',
    },
    required: true,
    default: '',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Activve',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether the user is activated or deactivated',
      },
      {
        displayName: 'External',
        name: 'external',
        type: 'boolean',
        default: false,
        description: 'Whether the user is an external employee or contractor',
      },
    ],
  },
  /* -------------------------------------------------------------------------- */
  /*                                 user:delete                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['delete'],
      },
    },
  },
  /* -------------------------------------------------------------------------- */
  /*                                 user:get                                   */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['get'],
      },
    },
  },
  /* -------------------------------------------------------------------------- */
  /*                                 user:list                                  */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['list'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['list'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
    },
    default: 50,
    description: 'Max number of results to return',
  },
  {
    displayName: 'IDs',
    name: 'ids',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['list'],
        returnAll: [false],
      },
    },
    default: '',
    description:
      'Allows you to filter by IDs and fetch multiple entities comma-separated',
  },
  {
    displayName: 'Updated After',
    name: 'updatedAfter',
    type: 'dateTime',
    typeOptions: {},
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['list'],
        returnAll: [false],
      },
    },
    default: '',
    description:
      'Enables you to give a timestamp for all entities that are created or updated after this timestamp',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['list'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Include Archived',
        name: 'includeArchived',
        type: 'boolean',
        default: false,
        description: 'Whether to include deactivated users in the results',
      },
      {
        displayName: 'Sort By',
        name: 'sortBy',
        type: 'string',
        default: '',
        description: 'The field to sort the results by',
      },
    ],
  },
  /* -------------------------------------------------------------------------- */
  /*                                 user:update                               */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'First Name',
    name: 'firstname',
    type: 'string',
    default: '',
    description: 'Firstname of user being updated',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Last Name',
    name: 'lastname',
    type: 'string',
    default: '',
    description: 'Lastname of user being updated',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    typeOptions: {
      email: true,
    },
    placeholder: 'name@email.com',
    default: '',
    description: 'Email of user being updated',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Password',
    name: 'password',
    type: 'string',
    typeOptions: {
      password: true,
    },
    default: '',
    description: 'Password of user being updated',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Team Name or ID',
    name: 'unitId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'listTeams',
    },
    default: '',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: {
      show: {
        resource: ['user'],
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
        resource: ['user'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Activve',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether the user is activated or deactivated',
      },
      {
        displayName: 'External',
        name: 'external',
        type: 'boolean',
        default: false,
        description: 'Whether the user is an external employee or contractor',
      },
    ],
  },
];
