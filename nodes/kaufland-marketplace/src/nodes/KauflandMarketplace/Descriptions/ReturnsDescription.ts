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
        name: 'Accepting Returns',
        value: 'acceptingReturns',
        action: 'Accepting returns',
      },
      {
        name: 'Clarifying Returns',
        value: 'clarifyingReturns',
        action: 'Clarifying returns',
      },
      {
        name: 'Rejecting Returns',
        value: 'rejectingReturns',
        action: 'Rejecting returns',
      },
      {
        name: 'Repairing Returns',
        value: 'repairingReturns',
        action: 'Repairing returns',
      },
      {
        name: 'Retrieving Return Information by ID',
        value: 'retrievingReturnInformationId',
        action: 'Retrieving return information by id',
      },
      {
        name: 'Retrieving Return Information by Status',
        value: 'retrievingReturnInformationStatus',
        action: 'Retrieving return information by status',
      },
      {
        name: 'Retrieving Return Information by Trackingcode',
        value: 'retrievingReturnInformationTracking',
        action: 'Retrieving return information by trackingcode',
      },
      {
        name: 'Returning Order Units',
        value: 'returningOrderUnits',
        description: 'Initialize a return for order units',
        action: 'Returning order units',
      },
    ],
    default: 'returningOrderUnits',
  },
];

export const returnsFields: INodeProperties[] = [
  {
    displayName: 'Status',
    name: 'status',
    type: 'multiOptions',
    displayOptions: {
      show: {
        operation: ['retrievingReturnInformationStatus'],
        resource: ['returns'],
      },
    },
    placeholder: 'Select a status',
    default: [],
    description: 'Return status for which returns are being queried for',
    required: true,
    options: [
      {
        name: 'Return Requested',
        value: 'return_requested',
      },
      {
        name: 'Label Generated',
        value: 'label_generated',
      },
      {
        name: 'Package Sent',
        value: 'package_sent',
      },
      {
        name: 'Package Received',
        value: 'package_received',
      },
    ],
  },
  {
    displayName: 'Trackingcode',
    name: 'trackingcode',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['retrievingReturnInformationTracking'],
        resource: ['returns'],
      },
    },
    required: true,
    placeholder: '1234567890...',
    default: undefined,
  },
  {
    displayName: 'Return ID',
    name: 'returnId',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['retrievingReturnInformationId'],
        resource: ['returns'],
      },
    },
    placeholder: '',
    required: true,
    default: undefined,
  },
  {
    displayName: 'Embed Return Units',
    name: 'embedReturnUnits',
    type: 'boolean',
    displayOptions: {
      show: {
        operation: ['retrievingReturnInformationId'],
        resource: ['returns'],
      },
    },
    default: false,
  },
  {
    displayName: 'Embed Buyer',
    name: 'embedBuyer',
    type: 'boolean',
    displayOptions: {
      show: {
        operation: ['retrievingReturnInformationId'],
        resource: ['returns'],
      },
    },
    default: false,
  },
  {
    displayName: 'Order Units (Json)',
    name: 'orderUnits',
    type: 'json',
    displayOptions: {
      show: {
        operation: ['returningOrderUnits'],
        resource: ['returns'],
      },
    },
    placeholder: '',
    default: '[]',
  },
  {
    displayName: 'Return Unit ID',
    name: 'returnUnitId',
    type: 'string',
    displayOptions: {
      show: {
        operation: [
          'clarifyingReturns',
          'repairingReturns',
          'rejectingReturns',
          'acceptingReturns',
        ],
        resource: ['returns'],
      },
    },
    placeholder: '',
    required: true,
    default: undefined,
  },
  {
    displayName: 'Message',
    name: 'message',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['clarifyingReturns', 'rejectingReturns'],
        resource: ['returns'],
      },
    },
    placeholder: '',
    required: true,
    default: undefined,
  },
];
