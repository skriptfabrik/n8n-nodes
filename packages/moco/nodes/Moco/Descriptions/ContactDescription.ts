import type { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['contact'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a contact',
        action: 'Create a contact',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a contact',
        action: 'Delete a contact',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Retrieve a single contact',
        action: 'Retrieve a single contact',
      },
      {
        name: 'List',
        value: 'list',
        description: 'Retrieve all contacts',
        action: 'Retrieve all contacts',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a contact',
        action: 'Update a contact',
      },
    ],
    default: 'create',
  },
];

export const contactFields: INodeProperties[] = [
  /* ------------------------------------------------------------------------- */
  /*                               contact:create                              */
  /* ------------------------------------------------------------------------- */
  {
    displayName: 'First Name',
    name: 'firstname',
    type: 'string',
    required: true,
    default: '',
    description: 'Firstname of contact being created',
    displayOptions: {
      show: {
        resource: ['contact'],
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
    description: 'Lastname of contact being created',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Company Name or ID',
    name: 'companyId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'listCompanies',
    },
    required: true,
    default: '',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: {
      show: {
        resource: ['contact'],
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
        resource: ['contact'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Birthday',
        name: 'birthday',
        type: 'dateTime',
        default: '',
        description: 'Birthday of the contact',
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
        displayName: 'Gender',
        name: 'gender',
        type: 'options',
        options: [
          {
            name: 'Male',
            value: 'M',
          },
          {
            name: 'Female',
            value: 'W',
          },
          {
            name: 'Diverse',
            value: 'U',
          },
        ],
        default: 'U',
        description: 'Gender of the contact',
      },
      {
        displayName: 'Home Address',
        name: 'homeAddress',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'Home address of the contact',
      },
      {
        displayName: 'Home Email',
        name: 'homeEmail',
        type: 'string',
        typeOptions: {
          email: true,
        },
        placeholder: 'home@email.com',
        default: '',
        description: 'Home email of the contact',
      },
      {
        displayName: 'Info',
        name: 'info',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'Additional information about the contact',
      },
      {
        displayName: 'Job Position',
        name: 'jobPosition',
        type: 'string',
        default: '',
        description: 'Job position of the contact',
      },
      {
        displayName: 'Mobile Phone',
        name: 'mobilePhone',
        type: 'string',
        default: '',
        description: 'Mobile phone number of the contact',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Tags for the contact (comma-separated)',
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'Title of the contact (e.g., Mr., Mrs., Dr.)',
      },
      {
        displayName: 'Work Email',
        name: 'workEmail',
        type: 'string',
        typeOptions: {
          email: true,
        },
        placeholder: 'work@email.com',
        default: '',
        description: 'Work email of the contact',
      },
      {
        displayName: 'Work Fax',
        name: 'workFax',
        type: 'string',
        default: '',
        description: 'Work fax number of the contact',
      },
      {
        displayName: 'Work Phone',
        name: 'workPhone',
        type: 'string',
        default: '',
        description: 'Work phone number of the contact',
      },
    ],
  },
  /* ------------------------------------------------------------------------- */
  /*                               contact:delete                              */
  /* ------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['delete'],
      },
    },
    description: 'ID of the contact to delete',
  },
  /* ------------------------------------------------------------------------- */
  /*                                contact:get                                */
  /* ------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['get'],
      },
    },
    description: 'ID of the contact to retrieve',
  },
  /* ------------------------------------------------------------------------- */
  /*                               contact:list                                */
  /* ------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['contact'],
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
        resource: ['contact'],
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
        resource: ['contact'],
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
        resource: ['contact'],
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
        resource: ['contact'],
        operation: ['list'],
      },
    },
    default: {},
    options: [
      // Filter functions for Companies not implemented in Moco API
      /*
      {
        displayName: 'Company Name or ID',
        name: 'companyId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'listCompanies',
        },
        default: '',
        description:
          'Filter contacts by company - Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
      */
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'Filter contacts by phone number',
      },
      {
        displayName: 'Term',
        name: 'term',
        type: 'string',
        default: '',
        description: 'Search term to filter contacts',
      },
    ],
  },
  /* ------------------------------------------------------------------------- */
  /*                              contact:update                               */
  /* ------------------------------------------------------------------------- */
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['update'],
      },
    },
    description: 'ID of the contact to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['update'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Birthday',
        name: 'birthday',
        type: 'dateTime',
        default: '',
        description: 'Birthday of the contact',
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
        displayName: 'First Name',
        name: 'firstname',
        type: 'string',
        default: '',
        description: 'Firstname of contact being updated',
      },
      {
        displayName: 'Gender',
        name: 'gender',
        type: 'options',
        options: [
          {
            name: '',
            value: '',
          },
          {
            name: 'Male',
            value: 'M',
          },
          {
            name: 'Female',
            value: 'W',
          },
          {
            name: 'Diverse',
            value: 'U',
          },
        ],
        default: '',
        description: 'Gender of the contact',
      },
      {
        displayName: 'Home Address',
        name: 'homeAddress',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'Home address of the contact',
      },
      {
        displayName: 'Home Email',
        name: 'homeEmail',
        type: 'string',
        typeOptions: {
          email: true,
        },
        placeholder: 'home@email.com',
        default: '',
        description: 'Home email of the contact',
      },
      {
        displayName: 'Info',
        name: 'info',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'Additional information about the contact',
      },
      {
        displayName: 'Job Position',
        name: 'jobPosition',
        type: 'string',
        default: '',
        description: 'Job position of the contact',
      },
      {
        displayName: 'Last Name',
        name: 'lastname',
        type: 'string',
        default: '',
        description: 'Lastname of contact being updated',
      },
      {
        displayName: 'Mobile Phone',
        name: 'mobilePhone',
        type: 'string',
        default: '',
        description: 'Mobile phone number of the contact',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Tags for the contact (comma-separated)',
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'Title of the contact (e.g., Mr., Mrs., Dr.)',
      },
      {
        displayName: 'Work Email',
        name: 'workEmail',
        type: 'string',
        typeOptions: {
          email: true,
        },
        placeholder: 'work@email.com',
        default: '',
        description: 'Work email of the contact',
      },
      {
        displayName: 'Work Fax',
        name: 'workFax',
        type: 'string',
        default: '',
        description: 'Work fax number of the contact',
      },
      {
        displayName: 'Work Phone',
        name: 'workPhone',
        type: 'string',
        default: '',
        description: 'Work phone number of the contact',
      },
    ],
  },
];
