import type { INodeProperties } from 'n8n-workflow';

export const dealOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['deal'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a deal',
        action: 'Create a deal',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a deal',
        action: 'Delete a deal',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Retrieve a single deal',
        action: 'Retrieve a single deal',
      },
      {
        name: 'List',
        value: 'list',
        description: 'Retrieve all deals',
        action: 'Retrieve all deals',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a deal',
        action: 'Update a deal',
      },
    ],
    default: 'create',
  },
];

export const dealFields: INodeProperties[] = [
  /* ---------------------------------------------------------------------- */
  /*                               deal:create                              */
  /* ---------------------------------------------------------------------- */
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    description: 'Name of deal being created',
    displayOptions: {
      show: {
        resource: ['deal'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'string',
    default: '',
    description: 'Currency of the deal',
    displayOptions: {
      show: {
        resource: ['deal'],
        operation: ['create'],
      },
    },
    placeholder: 'EUR',
    required: true,
    requiresDataPath: 'single',
    validateType: 'string',
  },
  {
    displayName: 'Money',
    name: 'money',
    type: 'number',
    required: true,
    default: 0,
    placeholder: '25000',
    description: 'Amount of money of deal being created',
    displayOptions: {
      show: {
        resource: ['deal'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Reminder Date',
    name: 'reminderDate',
    type: 'dateTime',
    required: true,
    default: '',
    description: 'Reminder date of the deal',
    displayOptions: {
      show: {
        resource: ['deal'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'User Name or ID',
    name: 'userId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'listUsers',
    },
    displayOptions: {
      show: {
        resource: ['deal'],
        operation: ['create'],
      },
    },
    default: '',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    requiresDataPath: 'single',
    validateType: 'number',
  },
  {
    displayName: 'Deal Category Name or ID',
    name: 'dealCategoryId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'listDealCategories',
    },
    displayOptions: {
      show: {
        resource: ['deal'],
        operation: ['create'],
      },
    },
    default: '',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    requiresDataPath: 'single',
    validateType: 'number',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['deal'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Closed On',
        name: 'closedOn',
        type: 'dateTime',
        default: '',
        description: 'Closed date of the deal',
      },
      {
        displayName: 'Company Name or ID',
        name: 'companyId',
        type: 'options',
        default: '',
        typeOptions: {
          loadOptionsMethod: 'listCompanies',
        },
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
      {
        displayName: 'Custom Properties',
        name: 'customProperties',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
          sortable: true,
        },
        default: {},
        options: [
          {
            name: 'values',
            displayName: 'Values',
            values: [
              {
                displayName: 'Name',
                name: 'key',
                type: 'string',
                default: '',
                placeholder: 'Property name',
                description: 'Name of the custom property',
                required: true,
                requiresDataPath: 'single',
                validateType: 'string',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                placeholder: 'Property value',
                description: 'Value of the custom property',
                required: true,
                validateType: 'string',
              },
            ],
          },
        ],
        placeholder: 'Add custom property',
      },
      {
        displayName: 'Info',
        name: 'info',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'Additional information about the deal',
      },
      {
        displayName: 'Person Name or ID',
        name: 'personId',
        type: 'options',
        default: '',
        typeOptions: {
          loadOptionsMethod: 'listPersons',
        },
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
      {
        displayName: 'Service Period From',
        name: 'servicePeriodFrom',
        type: 'dateTime',
        default: '',
        description: 'Service period start date of the deal',
      },
      {
        displayName: 'Service Period To',
        name: 'servicePeriodTo',
        type: 'dateTime',
        default: '',
        description: 'Service period end date of the deal',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          {
            name: 'Dropped',
            value: 'dropped',
          },
          {
            name: 'Lost',
            value: 'lost',
          },
          {
            name: 'Pending',
            value: 'pending',
          },
          {
            name: 'Potential',
            value: 'potential',
          },
          {
            name: 'Won',
            value: 'won',
          },
        ],
        default: 'pending',
        description: 'Status of the deal',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Tags for the deal (comma-separated)',
      },
    ],
  },
  /* ---------------------------------------------------------------------- */
  /*                               deal:delete                              */
  /* ---------------------------------------------------------------------- */
  {
    displayName: 'Deal ID',
    name: 'dealId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['deal'],
        operation: ['delete'],
      },
    },
    description: 'ID of the deal to delete',
  },
  /* ---------------------------------------------------------------------- */
  /*                                deal:get                                */
  /* ---------------------------------------------------------------------- */
  {
    displayName: 'Deal ID',
    name: 'dealId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['deal'],
        operation: ['get'],
      },
    },
    description: 'ID of the deal to retrieve',
  },
  /* ---------------------------------------------------------------------- */
  /*                               deal:list                                */
  /* ---------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['deal'],
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
        resource: ['deal'],
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
        resource: ['deal'],
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
    displayOptions: {
      show: {
        resource: ['deal'],
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
        resource: ['deal'],
        operation: ['list'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Closed From',
        name: 'closedFrom',
        type: 'dateTime',
        default: '',
        description: 'Deal was closed after this date',
      },
      {
        displayName: 'Closed To',
        name: 'closedTo',
        type: 'dateTime',
        default: '',
        description: 'Deal was closed before this date',
      },
      {
        displayName: 'Company Name or ID',
        name: 'companyId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'listCompanies',
        },
        default: '',
        description:
          'Filter deals by company - Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          {
            name: 'Dropped',
            value: 'dropped',
          },
          {
            name: 'Lost',
            value: 'lost',
          },
          {
            name: 'Pending',
            value: 'pending',
          },
          {
            name: 'Potential',
            value: 'potential',
          },
          {
            name: 'Won',
            value: 'won',
          },
        ],
        default: 'pending',
        description: 'Status of the deal',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Tags for the deal (comma-separated)',
      },
    ],
  },
  /* ---------------------------------------------------------------------- */
  /*                              deal:update                               */
  /* ---------------------------------------------------------------------- */
  {
    displayName: 'Deal ID',
    name: 'dealId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['deal'],
        operation: ['update'],
      },
    },
    description: 'ID of the deal to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['deal'],
        operation: ['update'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Closed On',
        name: 'closedOn',
        type: 'dateTime',
        default: '',
        description: 'Closed date of the deal',
      },
      {
        displayName: 'Company Name or ID',
        name: 'companyId',
        type: 'options',
        default: '',
        typeOptions: {
          loadOptionsMethod: 'listCompanies',
        },
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        default: '',
        description: 'Currency of the deal',
        displayOptions: {
          show: {
            resource: ['deal'],
            operation: ['create'],
          },
        },
        placeholder: 'EUR',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Custom Properties',
        name: 'customProperties',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
          sortable: true,
        },
        default: {},
        options: [
          {
            name: 'values',
            displayName: 'Values',
            values: [
              {
                displayName: 'Name',
                name: 'key',
                type: 'string',
                default: '',
                placeholder: 'Property name',
                description: 'Name of the custom property',
                required: true,
                requiresDataPath: 'single',
                validateType: 'string',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                placeholder: 'Property value',
                description: 'Value of the custom property',
                required: true,
                validateType: 'string',
              },
            ],
          },
        ],
        placeholder: 'Add custom property',
      },
      {
        displayName: 'Deal Category Name or ID',
        name: 'dealCategoryId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'listDealCategories',
        },
        default: '',
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        requiresDataPath: 'single',
        validateType: 'number',
      },
      {
        displayName: 'Info',
        name: 'info',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'Additional information about the deal',
      },
      {
        displayName: 'Money',
        name: 'money',
        type: 'number',
        default: 0,
        placeholder: '25000',
        description: 'Amount of money of deal being created',
        displayOptions: {
          show: {
            resource: ['deal'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of deal being created',
        displayOptions: {
          show: {
            resource: ['deal'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Person Name or ID',
        name: 'personId',
        type: 'options',
        default: '',
        typeOptions: {
          loadOptionsMethod: 'listPersons',
        },
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
      {
        displayName: 'Reminder Date',
        name: 'reminderDate',
        type: 'dateTime',
        default: '',
        description: 'Reminder date of the deal',
      },
      {
        displayName: 'Service Period From',
        name: 'servicePeriodFrom',
        type: 'dateTime',
        default: '',
        description: 'Service period start date of the deal',
      },
      {
        displayName: 'Service Period To',
        name: 'servicePeriodTo',
        type: 'dateTime',
        default: '',
        description: 'Service period end date of the deal',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          {
            name: 'Dropped',
            value: 'dropped',
          },
          {
            name: 'Lost',
            value: 'lost',
          },
          {
            name: 'Pending',
            value: 'pending',
          },
          {
            name: 'Potential',
            value: 'potential',
          },
          {
            name: 'Won',
            value: 'won',
          },
        ],
        default: 'pending',
        description: 'Status of the deal',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Tags for the deal (comma-separated)',
      },
      {
        displayName: 'User Name or ID',
        name: 'userId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'listUsers',
        },
        default: '',
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        requiresDataPath: 'single',
        validateType: 'number',
      },
    ],
  },
];
