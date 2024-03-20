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
        name: 'Create',
        value: 'create',
        description: 'Create a project',
        action: 'Create a project',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a project',
        action: 'Delete a project',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Retrieve a single project',
        action: 'Retrieve a single project',
      },
      {
        name: 'List',
        value: 'list',
        description: 'Retrieve all projects',
        action: 'Retrieve all projects',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a project',
        action: 'Update a project',
      },
    ],
    default: 'create',
  },
];

export const projectFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                 project:create                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    required: true,
    description: 'Name of project being created',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'string',
    default: '',
    required: true,
    description:
      'Currency of the project being created (use the 3-letter currency code)',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'string',
    default: '',
    required: true,
    description: 'Start date of the project being created (format: YYYY-MM-DD)',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
        retainer: [true],
      },
    },
  },
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'string',
    default: '',
    description: 'Start date of the project being created (format: YYYY-MM-DD)',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
        retainer: [false],
      },
    },
  },
  {
    displayName: 'Finish Date',
    name: 'finishDate',
    type: 'string',
    default: '',
    required: true,
    description:
      'Finish date of the project being created (format: YYYY-MM-DD)',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
        retainer: [true],
      },
    },
  },
  {
    displayName: 'Finish Date',
    name: 'finishDate',
    type: 'string',
    default: '',
    description:
      'Finish date of the project being created (format: YYYY-MM-DD)',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
        retainer: [false],
      },
    },
  },
  {
    displayName: 'Fixed Price',
    name: 'fixedPrice',
    type: 'boolean',
    default: false,
    required: true,
    description: 'Whether the project is fixed price or not',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Retainer',
    name: 'retainer',
    type: 'boolean',
    default: false,
    required: true,
    description: 'Whether the project is retainer or not',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Leader Name or ID',
    name: 'leaderId',
    type: 'options',
    default: '',
    typeOptions: {
      loadOptionsMethod: 'listUsers',
    },
    required: true,
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Customer Name or ID',
    name: 'customerId',
    type: 'options',
    default: '',
    typeOptions: {
      loadOptionsMethod: 'listCustomers',
    },
    required: true,
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Budget Monthly',
    name: 'budgetMonthly',
    type: 'number',
    default: 0,
    required: true,
    description: 'Monthly budget for the project being created',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
        retainer: [true],
      },
    },
  },
  {
    displayName: 'Budget Monthly',
    name: 'budgetMonthly',
    type: 'number',
    default: 0,
    description: 'Monthly budget for the project being created',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
        retainer: [false],
      },
    },
  },
  {
    displayName: 'Identifier',
    name: 'identifier',
    type: 'string',
    default: '',
    description:
      'Identifier of the project being created (only mandatory if number ranges are manual)',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
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
        resource: ['project'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Co Leader Name or ID',
        name: 'coLeaderId',
        type: 'options',
        default: '',
        typeOptions: {
          loadOptionsMethod: 'listUsers',
        },
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
      },
      {
        displayName: 'Deal Name or ID',
        name: 'dealId',
        type: 'options',
        default: '',
        typeOptions: {
          loadOptionsMethod: 'listLeads',
        },
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
      },
      {
        displayName: 'Billing Address',
        name: 'billingAddress',
        type: 'string',
        default: '',
        typeOptions: {
          rows: 4,
        },
        description: 'Billing address for the project being created',
      },
      {
        displayName: 'Billing Email To',
        name: 'billingEmailTo',
        type: 'string',
        default: '',
        typeOptions: {
          email: true,
        },
        description: 'Billing email address for the project being created',
      },
      {
        displayName: 'Billing Email CC',
        name: 'billingEmailCc',
        type: 'string',
        default: '',
        typeOptions: {
          email: true,
        },
        description: 'Billing email address copy for the project being created',
      },
      {
        displayName: 'Billing Notes',
        name: 'billingNotes',
        type: 'string',
        default: '',
        description: 'Billing notes for the project being created',
      },
      {
        displayName: 'Setting Include Time Report',
        name: 'settingIncludeTimeReport',
        type: 'boolean',
        default: false,
        description: 'Whether to include time report or not',
      },
      {
        displayName: 'Billing Variant',
        name: 'billingVariant',
        type: 'options',
        default: 'project',
        options: [
          {
            name: 'Project',
            value: 'project',
          },
          {
            name: 'Task',
            value: 'task',
          },
          {
            name: 'User',
            value: 'user',
          },
        ],
        description: 'Billing variant for the project being created',
      },
      {
        displayName: 'Hourly Rate',
        name: 'hourlyRate',
        type: 'number',
        default: 0,
        description: 'Hourly rate for the project being created',
      },
      {
        displayName: 'Budget',
        name: 'budget',
        type: 'number',
        default: 0,
        description: 'Budget for the project being created',
      },
      {
        displayName: 'Budget Expenses',
        name: 'budgetExpenses',
        type: 'number',
        default: 0,
        description: 'Expenses budget for the project being created',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        placeholder: 'Add Tag',
        type: 'fixedCollection',
        default: {},
        typeOptions: {
          multipleValues: true,
        },
        options: [
          {
            displayName: 'Tag',
            name: 'tag',
            type: 'string',
            default: '',
            description: 'Tag for the project being created',
          },
        ],
        description: 'Tags for the project being created',
      },
      {
        displayName: 'Custom Properties',
        name: 'customProperties',
        placeholder: 'Add Custom Property',
        type: 'fixedCollection',
        default: {},
        typeOptions: {
          multipleValues: true,
        },
        options: [
          {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
            description:
              'Name of the custom property for the project being created',
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
            description:
              'Value of the custom property for the project being created',
          },
        ],
        description: 'Custom properties for the project being created',
      },
      {
        displayName: 'Info',
        name: 'info',
        type: 'string',
        default: '',
        description: 'Info for the project being created',
      },
    ],
  },
  /* -------------------------------------------------------------------------- */
  /*                                 project:delete                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['delete'],
      },
    },
  },
  /* -------------------------------------------------------------------------- */
  /*                                 project:get                               */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['get'],
      },
    },
  },
  /* -------------------------------------------------------------------------- */
  /*                                 project:list                              */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['list'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: {
      minValue: 1,
    },
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['list'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  {
    displayName: 'IDs',
    name: 'ids',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['list'],
        returnAll: [false],
      },
    },
    description:
      'Allows you to filter by IDs and fetch multiple entities comma-separated',
  },
  {
    displayName: 'Updated After',
    name: 'updatedAfter',
    type: 'dateTime',
    default: '',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['list'],
        returnAll: [false],
      },
    },
    description:
      'Enables you to give a timestamp for all entities that are created or updated after this timestamp',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    placeholder: 'Add Field',
    type: 'collection',
    default: {},
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Include Archived',
        name: 'includeArchived',
        type: 'boolean',
        default: false,
        description: 'Whether to include archived projects or not',
      },
      {
        displayName: 'Include Company',
        name: 'includeCompany',
        type: 'boolean',
        default: false,
        description:
          'Whether to include a complete company instead of just ID and name',
      },
      {
        displayName: 'Leader Name or ID',
        name: 'leaderId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'listUsers',
        },
        default: '',
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
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
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
      },
      {
        displayName: 'Created From',
        name: 'createdFrom',
        type: 'string',
        default: '',
        description: 'Created from date for the projects being listed',
      },
      {
        displayName: 'Created To',
        name: 'createdTo',
        type: 'string',
        default: '',
        description: 'Created to date for the projects being listed',
      },
      {
        displayName: 'Updated From',
        name: 'updatedFrom',
        type: 'string',
        default: '',
        description: 'Updated from date for the projects being listed',
      },
      {
        displayName: 'Updated To',
        name: 'updatedTo',
        type: 'string',
        default: '',
        description: 'Updated to date for the projects being listed',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tags to filter by',
      },
      {
        displayName: 'Identifier',
        name: 'identifier',
        type: 'string',
        default: '',
        description: 'Identifier of the project being listed',
      },
      {
        displayName: 'Retainer',
        name: 'retainer',
        type: 'boolean',
        default: false,
        description: 'Whether the projects being listed are retainer or not',
      },
      {
        displayName: 'Project Group ID',
        name: 'projectGroupId',
        type: 'number',
        default: '',
        description: 'ID of the project group for the projects being listed',
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
  /*                                 project:update                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    description: 'Name of project being created',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'string',
    default: '',
    description: 'Start date of the project being created (format: YYYY-MM-DD)',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Finish Date',
    name: 'finishDate',
    type: 'string',
    default: '',
    description:
      'Finish date of the project being created (format: YYYY-MM-DD)',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Fixed Price',
    name: 'fixedPrice',
    type: 'boolean',
    default: false,
    required: true,
    description: 'Whether the project is fixed price or not',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Retainer',
    name: 'retainer',
    type: 'boolean',
    default: false,
    description: 'Whether the project is retainer or not',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Leader Name or ID',
    name: 'leaderId',
    type: 'options',
    default: '',
    typeOptions: {
      loadOptionsMethod: 'listUsers',
    },
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Customer Name or ID',
    name: 'customerId',
    type: 'options',
    default: '',
    typeOptions: {
      loadOptionsMethod: 'listCustomers',
    },
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Budget Monthly',
    name: 'budgetMonthly',
    type: 'number',
    default: 0,
    description: 'Monthly budget for the project being created',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Identifier',
    name: 'identifier',
    type: 'string',
    default: '',
    description:
      'Identifier of the project being created (only mandatory if number ranges are manual)',
    displayOptions: {
      show: {
        resource: ['project'],
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
        resource: ['project'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Co Leader Name or ID',
        name: 'coLeaderId',
        type: 'options',
        default: '',
        typeOptions: {
          loadOptionsMethod: 'listUsers',
        },
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
      },
      {
        displayName: 'Deal Name or ID',
        name: 'dealId',
        type: 'options',
        default: '',
        typeOptions: {
          loadOptionsMethod: 'listLeads',
        },
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
      },
      {
        displayName: 'Billing Address',
        name: 'billingAddress',
        type: 'string',
        default: '',
        typeOptions: {
          rows: 4,
        },
        description: 'Billing address for the project being created',
      },
      {
        displayName: 'Billing Email To',
        name: 'billingEmailTo',
        type: 'string',
        default: '',
        typeOptions: {
          email: true,
        },
        description: 'Billing email address for the project being created',
      },
      {
        displayName: 'Billing Email CC',
        name: 'billingEmailCc',
        type: 'string',
        default: '',
        typeOptions: {
          email: true,
        },
        description: 'Billing email address copy for the project being created',
      },
      {
        displayName: 'Billing Notes',
        name: 'billingNotes',
        type: 'string',
        default: '',
        description: 'Billing notes for the project being created',
      },
      {
        displayName: 'Setting Include Time Report',
        name: 'settingIncludeTimeReport',
        type: 'boolean',
        default: false,
        description: 'Whether to include time report or not',
      },
      {
        displayName: 'Billing Variant',
        name: 'billingVariant',
        type: 'options',
        default: 'project',
        options: [
          {
            name: 'Project',
            value: 'project',
          },
          {
            name: 'Task',
            value: 'task',
          },
          {
            name: 'User',
            value: 'user',
          },
        ],
        description: 'Billing variant for the project being created',
      },
      {
        displayName: 'Hourly Rate',
        name: 'hourlyRate',
        type: 'number',
        default: 0,
        description: 'Hourly rate for the project being created',
      },
      {
        displayName: 'Budget',
        name: 'budget',
        type: 'number',
        default: 0,
        description: 'Budget for the project being created',
      },
      {
        displayName: 'Budget Expenses',
        name: 'budgetExpenses',
        type: 'number',
        default: 0,
        description: 'Expenses budget for the project being created',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        placeholder: 'Add Tag',
        type: 'fixedCollection',
        default: {},
        typeOptions: {
          multipleValues: true,
        },
        options: [
          {
            displayName: 'Tag',
            name: 'tag',
            type: 'string',
            default: '',
            description: 'Tag for the project being created',
          },
        ],
        description: 'Tags for the project being created',
      },
      {
        displayName: 'Custom Properties',
        name: 'customProperties',
        placeholder: 'Add Custom Property',
        type: 'fixedCollection',
        default: {},
        typeOptions: {
          multipleValues: true,
        },
        options: [
          {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
            description:
              'Name of the custom property for the project being created',
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
            description:
              'Value of the custom property for the project being created',
          },
        ],
        description: 'Custom properties for the project being created',
      },
      {
        displayName: 'Info',
        name: 'info',
        type: 'string',
        default: '',
        description: 'Info for the project being created',
      },
    ],
  },
];
