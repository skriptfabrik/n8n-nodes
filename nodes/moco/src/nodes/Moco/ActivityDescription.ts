import type { INodeProperties } from 'n8n-workflow';

export const activityOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['activity'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create an activity',
        action: 'Create an activity',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete an activity',
        action: 'Delete an activity',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Retrieve a single activity',
        action: 'Retrieve a single activity',
      },
      {
        name: 'List',
        value: 'list',
        description: 'Retrieve all activities',
        action: 'Retrieve all activities',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an activity',
        action: 'Update an activity',
      },
    ],
    default: 'create',
  },
];

export const activityFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                 activity:create                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Impersonate User Name or ID',
    name: 'impersonateUserId',
    type: 'options',
    default: '',
    typeOptions: {
      loadOptionsMethod: 'listUsers',
    },
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: {
      show: {
        resource: ['activity'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Date',
    name: 'date',
    type: 'string',
    default: '',
    required: true,
    description: 'Date of activity being created (format: YYYY-MM-DD)',
    displayOptions: {
      show: {
        resource: ['activity'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Project Name or ID',
    name: 'projectId',
    type: 'options',
    default: '',
    typeOptions: {
      loadOptionsMethod: 'listProjects',
    },
    required: true,
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: {
      show: {
        resource: ['activity'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Task Name or ID',
    name: 'taskId',
    type: 'options',
    default: '',
    typeOptions: {
      loadOptionsMethod: 'listProjectTasks',
      loadOptionsDependsOn: ['projectId'],
    },
    required: true,
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: {
      show: {
        resource: ['activity'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Seconds',
    name: 'seconds',
    type: 'number',
    default: 0,
    typeOptions: {
      minValue: 0,
    },
    description: 'Seconds spent on the activity',
    displayOptions: {
      show: {
        resource: ['activity'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    default: '',
    description: 'Description of the activity being created',
    displayOptions: {
      show: {
        resource: ['activity'],
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
        resource: ['activity'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Billable',
        name: 'billable',
        type: 'boolean',
        default: true,
        description: 'Whether the activity is billable or not',
      },
      {
        displayName: 'Remote ID',
        name: 'remoteId',
        type: 'string',
        default: '',
        description: 'Remote ID for the activity being created',
      },
      {
        displayName: 'Remote Service Name or ID',
        name: 'remoteService',
        type: 'options',
        default: 'asana',
        options: [
          {
            name: 'ASANA',
            value: 'asana',
          },
          {
            name: 'Basecamp',
            value: 'basecamp',
          },
          {
            name: 'Basecamp 2',
            value: 'basecamp2',
          },
          {
            name: 'Basecamp 3',
            value: 'basecamp3',
          },
          {
            name: 'GitHub',
            value: 'github',
          },
          {
            name: 'JIRA',
            value: 'jira',
          },
          {
            name: 'Mite',
            value: 'mite',
          },
          {
            name: 'Toggl',
            value: 'toggl',
          },
          {
            name: 'Trello',
            value: 'trello',
          },
          {
            name: 'Wunderlist',
            value: 'wunderlist',
          },
          {
            name: 'YouTrack',
            value: 'youtrack',
          },
        ],
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
      {
        displayName: 'Remote URL',
        name: 'remoteUrl',
        type: 'string',
        default: '',
        description: 'Remote URL for the activity being created',
      },
      {
        displayName: 'Tag',
        name: 'tag',
        type: 'string',
        default: '',
        description: 'Tag for the activity being created',
      },
    ],
  },
  /* -------------------------------------------------------------------------- */
  /*                                 activity:delete                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Activity ID',
    name: 'activityId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['activity'],
        operation: ['delete'],
      },
    },
  },
  /* -------------------------------------------------------------------------- */
  /*                                 activity:get                               */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Activity ID',
    name: 'activityId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['activity'],
        operation: ['get'],
      },
    },
  },
  /* -------------------------------------------------------------------------- */
  /*                                 activity:list                              */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['activity'],
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
        resource: ['activity'],
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
        resource: ['activity'],
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
        resource: ['activity'],
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
        resource: ['activity'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Company Name or ID',
        name: 'companyId',
        type: 'options',
        default: '',
        description:
          "Choose from the list, or specify an ID using an <a href='https://docs.n8n.io/code/expressions/'>expression</a>",
      },
      {
        displayName: 'From',
        name: 'from',
        type: 'string',
        default: '',
        description:
          'From date for the activities being listed (format: YYYY-MM-DD)',
      },
      {
        displayName: 'Project Name or ID',
        name: 'projectId',
        type: 'options',
        default: '',
        description:
          "Choose from the list, or specify an ID using an <a href='https://docs.n8n.io/code/expressions/'>expression</a>",
      },
      {
        displayName: 'Sort By',
        name: 'sortBy',
        type: 'string',
        default: '',
        description: 'The field to sort the results by',
      },
      {
        displayName: 'Sort By',
        name: 'sortBy',
        type: 'string',
        default: '',
        description: 'The field to sort the results by',
      },
      {
        displayName: 'Task Name or ID',
        name: 'taskId',
        type: 'options',
        default: '',
        description:
          "Choose from the list, or specify an ID using an <a href='https://docs.n8n.io/code/expressions/'>expression</a>",
      },
      {
        displayName: 'Term',
        name: 'term',
        type: 'string',
        default: '',
        description: 'Search term for the activities being listed',
      },
    ],
  },
  /* -------------------------------------------------------------------------- */
  /*                                 activity:update                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Activity ID',
    name: 'activityId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['activity'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Date',
    name: 'date',
    type: 'string',
    default: '',
    description: 'Date of activity being created (format: YYYY-MM-DD)',
    displayOptions: {
      show: {
        resource: ['activity'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Project Name or ID',
    name: 'projectId',
    type: 'options',
    default: '',
    typeOptions: {
      loadOptionsMethod: 'listProjects',
    },
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: {
      show: {
        resource: ['activity'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Task Name or ID',
    name: 'taskId',
    type: 'options',
    default: '',
    typeOptions: {
      loadOptionsMethod: 'listProjectTasks',
      loadOptionsDependsOn: ['projectId'],
    },
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: {
      show: {
        resource: ['activity'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Seconds',
    name: 'seconds',
    type: 'number',
    default: 0,
    typeOptions: {
      minValue: 0,
    },
    description: 'Seconds spent on the activity',
    displayOptions: {
      show: {
        resource: ['activity'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    default: '',
    description: 'Description of the activity being created',
    displayOptions: {
      show: {
        resource: ['activity'],
        operation: ['update'],
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
        resource: ['activity'],
        operation: ['update'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Billable',
        name: 'billable',
        type: 'boolean',
        default: true,
        description: 'Whether the activity is billable or not',
      },
      {
        displayName: 'Remote ID',
        name: 'remoteId',
        type: 'string',
        default: '',
        description: 'Remote ID for the activity being created',
      },
      {
        displayName: 'Remote Service Name or ID',
        name: 'remoteService',
        type: 'options',
        default: '',
        typeOptions: {
          loadOptionsMethod: 'listRemoteServices',
        },
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
      {
        displayName: 'Remote URL',
        name: 'remoteUrl',
        type: 'string',
        default: '',
        description: 'Remote URL for the activity being created',
      },
      {
        displayName: 'Tag',
        name: 'tag',
        type: 'string',
        default: '',
        description: 'Tag for the activity being created',
      },
    ],
  },
];
