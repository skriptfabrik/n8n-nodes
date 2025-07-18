import type { INodeProperties } from 'n8n-workflow';

export const companyOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['company'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a company',
        action: 'Create a company',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a company',
        action: 'Delete a company',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Retrieve a single company',
        action: 'Retrieve a single company',
      },
      {
        name: 'List',
        value: 'list',
        description: 'Retrieve all companies',
        action: 'Retrieve all companies',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a company',
        action: 'Update a company',
      },
    ],
    default: 'create',
  },
];

export const companyFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                 company:create                             */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    description: 'The name of the company',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['create'],
      },
    },
    placeholder: 'ACME Inc.',
    required: true,
    validateType: 'string',
  },
  {
    displayName: 'Type',
    name: 'type',
    type: 'options',
    default: 'customer',
    description: 'The type of the company',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['create'],
      },
    },
    options: [
      {
        name: 'Customer',
        value: 'customer',
      },
      {
        name: 'Supplier',
        value: 'supplier',
      },
      {
        name: 'Organization',
        value: 'organization',
      },
    ],
    required: true,
    requiresDataPath: 'single',
    validateType: 'string',
  },
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'string',
    default: '',
    description: 'Currency of the company',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['create'],
        type: ['customer'],
      },
    },
    placeholder: 'EUR',
    required: true,
    requiresDataPath: 'single',
    validateType: 'string',
  },
  {
    displayName: 'Identifier',
    name: 'identifier',
    type: 'string',
    default: '',
    description:
      'Identifier of the customer, only mandatory if not automatically assigned',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['create'],
        type: ['customer'],
      },
    },
    placeholder: 'K-123',
    requiresDataPath: 'single',
    validateType: 'string',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    default: {},
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['create'],
      },
    },
    placeholder: 'Add Field',
    options: [
      {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'The address of the company',
        placeholder: 'Lieferant AG\nBeispielstrasse 123\n12345 Berlin',
        validateType: 'string',
      },
      {
        displayName: 'Alternative Correspondence Language',
        name: 'alternativeCorrespondenceLanguage',
        type: 'boolean',
        default: false,
        description:
          'Whether sales documents in the account are created in alternative language',
        requiresDataPath: 'single',
        validateType: 'boolean',
      },
      {
        displayName: 'Billing Email CC',
        name: 'billingEmailCc',
        type: 'string',
        default: '',
        description: 'Email address for CC in billing documents',
        placeholder: 'cc@acme.com',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Country Code',
        name: 'countryCode',
        type: 'string',
        default: '',
        description:
          'ISO Alpha-2 Country Code like “DE” / “CH” / “AT” in upper case - default is account country',
        placeholder: 'DE',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Credit Number',
        name: 'creditNumber',
        type: 'number',
        default: 70000,
        description:
          'The credit number to the customer. (70000 if bookkeeping is enabled).',
        hint: 'Only relevant for type supplier.',
        placeholder: '70000',
        requiresDataPath: 'single',
        validateType: 'number',
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
        displayName: 'Customer Tax',
        name: 'customerTax',
        type: 'number',
        default: 19.0,
        description: 'Tax for the customer',
        hint: 'Only relevant for type customer.',
        placeholder: '19.0',
        requiresDataPath: 'single',
        validateType: 'number',
      },
      {
        displayName: 'Debit Number',
        name: 'debitNumber',
        type: 'number',
        default: 10000,
        description:
          'The debit number to the customer. (10000 if bookkeeping is enabled).',
        hint: 'Only relevant for type customer.',
        placeholder: '10000',
        requiresDataPath: 'single',
        validateType: 'number',
      },
      {
        displayName: 'Default Invoice Due Days',
        name: 'defaultInvoiceDueDays',
        type: 'number',
        default: 20,
        description: 'Default due days for invoices',
        hint: 'Only relevant for type customer.',
        placeholder: '20',
        requiresDataPath: 'single',
        validateType: 'number',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'The email address of the company',
        placeholder: 'order@acme.com',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Fax',
        name: 'fax',
        type: 'string',
        default: '',
        description: 'The fax number of the company',
        placeholder: '+49 123 456789',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Footer',
        name: 'footer',
        type: 'string',
        typeOptions: {
          editor: 'htmlEditor',
          rows: 4,
        },
        default: '',
        description: 'Footer which appears at the end of invoices',
        validateType: 'string',
      },
      {
        displayName: 'IBAN',
        name: 'iban',
        type: 'string',
        default: '',
        description: 'IBAN of the supplier',
        hint: 'Only relevant for type supplier.',
        placeholder: 'DE89370400440532013000',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Info',
        name: 'info',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'Additional information about the company',
        placeholder: 'Information for this company…',
        validateType: 'string',
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'The phone number of the company',
        placeholder: '+49 123 456789',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Supplier Tax',
        name: 'supplierTax',
        type: 'number',
        default: 19.0,
        description: 'Tax for the supplier',
        hint: 'Only relevant for type supplier.',
        placeholder: '19.0',
        requiresDataPath: 'single',
        validateType: 'number',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'multiOptions',
        default: [],
        description: 'Tags to add to the company',
        placeholder: 'Network',
        validateType: 'array',
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
      {
        displayName: 'VAT ID',
        name: 'vatId',
        type: 'string',
        default: '',
        description: 'European Union VAT identification numbers (USt-IdNr)',
        placeholder: 'DE123456789',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Website',
        name: 'website',
        type: 'string',
        default: '',
        description: 'The website of the company',
        placeholder: 'https://www.acme.com',
        requiresDataPath: 'single',
        validateType: 'url',
      },
    ],
  },
  /* -------------------------------------------------------------------------- */
  /*                                 company:delete                             */
  /* -------------------------------------------------------------------------- */
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
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['delete'],
      },
    },
    required: true,
    requiresDataPath: 'single',
    validateType: 'number',
  },
  /* -------------------------------------------------------------------------- */
  /*                                 company:get                                */
  /* -------------------------------------------------------------------------- */
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
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['get'],
      },
    },
    required: true,
    requiresDataPath: 'single',
    validateType: 'number',
  },
  // /* -------------------------------------------------------------------------- */
  // /*                                 company:list                               */
  // /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    description: 'Whether to return all results or only up to a given limit',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['list'],
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: {
      minValue: 1,
    },
    description: 'Max number of results to return',
    default: 50,
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['list'],
        returnAll: [false],
      },
    },
  },
  {
    displayName: 'IDs',
    name: 'ids',
    type: 'string',
    default: '',
    description:
      'Allows you to filter by IDs and fetch multiple entities comma-separated',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['list'],
        returnAll: [false],
      },
    },
  },
  {
    displayName: 'Updated After',
    name: 'updatedAfter',
    type: 'dateTime',
    default: '',
    description:
      'Enables you to give a timestamp for all entities that are created or updated after this timestamp',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['list'],
        returnAll: [false],
      },
    },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    default: {},
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Identifier',
        name: 'identifier',
        type: 'string',
        default: '',
        description: 'Identifier of the project being listed',
        placeholder: 'K-123',
        validateType: 'string',
      },
      {
        displayName: 'Sort By',
        name: 'sortBy',
        type: 'string',
        default: '',
        description: 'The field to sort the results by',
        placeholder: 'identifier',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tags to filter by',
        placeholder: 'Network,Important',
        validateType: 'string',
      },
      {
        displayName: 'Term',
        name: 'term',
        type: 'string',
        default: '',
        description: 'Search term for the activities being listed',
        placeholder: 'ACME',
        validateType: 'string',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        default: 'customer',
        description: 'The type of the company',
        options: [
          {
            name: 'Customer',
            value: 'customer',
          },
          {
            name: 'Supplier',
            value: 'supplier',
          },
          {
            name: 'Organization',
            value: 'organization',
          },
        ],
        requiresDataPath: 'single',
        validateType: 'string',
      },
    ],
    placeholder: 'Add Field',
  },
  /* -------------------------------------------------------------------------- */
  /*                                 company:update                             */
  /* -------------------------------------------------------------------------- */
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
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['update'],
      },
    },
    required: true,
    requiresDataPath: 'single',
    validateType: 'number',
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    description: 'The name of the company',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['update'],
      },
    },
    placeholder: 'ACME Inc.',
    required: true,
    validateType: 'string',
  },
  {
    displayName: 'Type',
    name: 'type',
    type: 'options',
    default: 'customer',
    description: 'The type of the company',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['update'],
      },
    },
    options: [
      {
        name: 'Customer',
        value: 'customer',
      },
      {
        name: 'Supplier',
        value: 'supplier',
      },
      {
        name: 'Organization',
        value: 'organization',
      },
    ],
    required: true,
    requiresDataPath: 'single',
    validateType: 'string',
  },
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'string',
    default: '',
    description: 'Currency of the company',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['update'],
        type: ['customer'],
      },
    },
    placeholder: 'EUR',
    required: true,
    requiresDataPath: 'single',
    validateType: 'string',
  },
  {
    displayName: 'Identifier',
    name: 'identifier',
    type: 'string',
    default: '',
    description:
      'Identifier of the customer, only mandatory if not automatically assigned',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['update'],
        type: ['customer'],
      },
    },
    placeholder: 'K-123',
    requiresDataPath: 'single',
    validateType: 'string',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    default: {},
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['update'],
      },
    },
    placeholder: 'Add Field',
    options: [
      {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'The address of the company',
        placeholder: 'Lieferant AG\nBeispielstrasse 123\n12345 Berlin',
        validateType: 'string',
      },
      {
        displayName: 'Alternative Correspondence Language',
        name: 'alternativeCorrespondenceLanguage',
        type: 'boolean',
        default: false,
        description:
          'Whether sales documents in the account are created in alternative language',
        requiresDataPath: 'single',
        validateType: 'boolean',
      },
      {
        displayName: 'Billing Email CC',
        name: 'billingEmailCc',
        type: 'string',
        default: '',
        description: 'Email address for CC in billing documents',
        placeholder: 'cc@acme.com',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Country Code',
        name: 'countryCode',
        type: 'string',
        default: '',
        description:
          'ISO Alpha-2 Country Code like “DE” / “CH” / “AT” in upper case - default is account country',
        placeholder: 'DE',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Credit Number',
        name: 'creditNumber',
        type: 'number',
        default: 70000,
        description:
          'The credit number to the customer. (70000 if bookkeeping is enabled).',
        hint: 'Only relevant for type supplier.',
        placeholder: '70000',
        requiresDataPath: 'single',
        validateType: 'number',
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
        placeholder: 'Add custom property',
      },
      {
        displayName: 'Customer Tax',
        name: 'customerTax',
        type: 'number',
        default: 19.0,
        description: 'Tax for the customer',
        hint: 'Only relevant for type customer.',
        placeholder: '19.0',
        requiresDataPath: 'single',
        validateType: 'number',
      },
      {
        displayName: 'Debit Number',
        name: 'debitNumber',
        type: 'number',
        default: 10000,
        description:
          'The debit number to the customer. (10000 if bookkeeping is enabled).',
        hint: 'Only relevant for type customer.',
        placeholder: '10000',
        requiresDataPath: 'single',
        validateType: 'number',
      },
      {
        displayName: 'Default Invoice Due Days',
        name: 'defaultInvoiceDueDays',
        type: 'number',
        default: 20,
        description: 'Default due days for invoices',
        hint: 'Only relevant for type customer.',
        placeholder: '20',
        requiresDataPath: 'single',
        validateType: 'number',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'The email address of the company',
        placeholder: 'order@acme.com',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Fax',
        name: 'fax',
        type: 'string',
        default: '',
        description: 'The fax number of the company',
        placeholder: '+49 123 456789',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Footer',
        name: 'footer',
        type: 'string',
        typeOptions: {
          editor: 'htmlEditor',
          rows: 4,
        },
        default: '',
        description: 'Footer which appears at the end of invoices',
        validateType: 'string',
      },
      {
        displayName: 'IBAN',
        name: 'iban',
        type: 'string',
        default: '',
        description: 'IBAN of the supplier',
        hint: 'Only relevant for type supplier.',
        placeholder: 'DE89370400440532013000',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Info',
        name: 'info',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'Additional information about the company',
        placeholder: 'Information for this company…',
        validateType: 'string',
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'The phone number of the company',
        placeholder: '+49 123 456789',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Supplier Tax',
        name: 'supplierTax',
        type: 'number',
        default: 19.0,
        description: 'Tax for the supplier',
        hint: 'Only relevant for type supplier.',
        placeholder: '19.0',
        requiresDataPath: 'single',
        validateType: 'number',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'multiOptions',
        default: [],
        description: 'Tags to add to the company',
        placeholder: 'Network',
        validateType: 'array',
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
      {
        displayName: 'VAT ID',
        name: 'vatId',
        type: 'string',
        default: '',
        description: 'European Union VAT identification numbers (USt-IdNr)',
        placeholder: 'DE123456789',
        requiresDataPath: 'single',
        validateType: 'string',
      },
      {
        displayName: 'Website',
        name: 'website',
        type: 'string',
        default: '',
        description: 'The website of the company',
        placeholder: 'https://www.acme.com',
        requiresDataPath: 'single',
        validateType: 'url',
      },
    ],
  },
];
