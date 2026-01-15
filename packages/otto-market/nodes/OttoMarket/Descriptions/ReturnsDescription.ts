import type { INodeProperties } from 'n8n-workflow';

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
        name: 'List',
        value: 'list',
        description: 'List the items',
        action: 'List returns',
      },
      {
        name: 'Accept Return',
        value: 'accept',
        action: 'Accept return',
      },
      {
        name: 'Reject Return',
        value: 'reject',
        action: 'Reject return',
      },
    ],
    default: 'list',
  },
];

export const returnsFields: INodeProperties[] = [
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    displayOptions: {
      show: {
        operation: ['list'],
        resource: ['returns'],
      },
    },
    placeholder: 'Select a status',
    default: 'ACCEPTED',
    description: 'Return status for which items are being queried for',
    required: true,
    options: [
      {
        name: 'ACCEPTED',
        value: 'ACCEPTED',
      },
      {
        name: 'REJECTED',
        value: 'REJECTED',
      },
      {
        name: 'ANNOUNCED',
        value: 'ANNOUNCED',
      },
      {
        name: 'MISDIRECTED',
        value: 'MISDIRECTED',
      },
    ],
  },
  {
    displayName: 'Position Items (Json)',
    name: 'positionItems',
    type: 'json',
    displayOptions: {
      show: {
        operation: ['accept', 'reject'],
        resource: ['returns'],
      },
    },
    placeholder: '',
    default: '[]',
    description: 'List of all the items received from partner',
    typeOptions: {
      alwaysOpenEditWindow: true,
    },
  },
];
