import { INodeProperties } from 'n8n-workflow';

export const returnsOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['returns'],
      },
    },
    options: [
      {
        name: 'Create Test Return',
        value: 'createTest',
        action: 'Create test return',
      },
      {
        name: 'Get One',
        value: 'getOne',
        action: 'Get a single return',
      },
      {
        name: 'List',
        value: 'list',
        action: 'Get all returns',
      },
      {
        name: 'List Anonymized',
        value: 'listAnonymized',
        action: 'Get all returns anonymized',
      },
      {
        name: 'Update Status',
        value: 'update',
        action: 'Update return status',
      },
    ],
    default: 'list',
  },
];

export const returnsFields: INodeProperties[] = [
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        operation: ['list', 'listAnonymized'],
        resource: ['returns'],
      },
    },
    options: [
      {
        displayName: 'Download',
        name: 'download',
        type: 'boolean',
        default: false,
      },
      {
        displayName: 'Errors',
        name: 'errors',
        type: 'boolean',
        default: false,
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        placeholder: '',
        default: undefined,
        description: 'Any text based search query',
      },
      {
        displayName: 'Start Date',
        name: 'start_date',
        type: 'dateTime',
        placeholder: '',
        default: undefined,
      },
      {
        displayName: 'End Date',
        name: 'end_date',
        type: 'dateTime',
        placeholder: '',
        default: undefined,
      },
      {
        displayName: 'Retrieved At Start',
        name: 'Retrieved At Start',
        type: 'dateTime',
        placeholder: '',
        default: undefined,
      },
      {
        displayName: 'Retrieved At End',
        name: 'retrieved_at_end',
        type: 'dateTime',
        placeholder: '',
        default: undefined,
      },
      {
        displayName: 'Last Modified After',
        name: 'last_modified_after',
        type: 'dateTime',
        placeholder: '',
        default: undefined,
      },
      {
        displayName: 'Last Modified Before',
        name: 'last_modified_before',
        type: 'dateTime',
        placeholder: '',
        default: undefined,
      },
    ],
  },
  {
    displayName: 'Return Identifier',
    name: 'id',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['getOne', 'update'],
        resource: ['returns'],
      },
    },
    placeholder: '',
    default: undefined,
    required: true,
    description: 'Unique return ID',
  },
  {
    displayName: 'Order Identifier',
    name: 'id',
    type: 'number',
    displayOptions: {
      show: {
        operation: ['createTest'],
        resource: ['orders'],
      },
    },
    placeholder: '',
    default: undefined,
    required: true,
    description: 'Unique order ID',
  },
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    displayOptions: {
      show: {
        operation: ['update'],
        resource: ['returns'],
      },
    },
    placeholder: 'Select a status',
    default: 'accepted',
    required: true,
    options: [
      {
        name: 'Accepted',
        value: 'accepted',
      },
      {
        name: 'Cancelled',
        value: 'cancelled',
      },
      {
        name: 'Exchanged',
        value: 'exchanged',
      },
      {
        name: 'Keeps',
        value: 'keeps',
      },
      {
        name: 'Rejected',
        value: 'rejected',
      },
      {
        name: 'Repaired',
        value: 'repaired',
      },
    ],
  },
];
