import { INodeProperties } from 'n8n-workflow';

export const stockUpdatesOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['stockUpdates'],
      },
    },
    options: [
      {
        name: 'Stock Update Stock',
        value: 'updateStock',
        description: "Update the offers' stock of a selected project",
        action: 'Stock update stock',
      },
    ],
    default: 'updateStock',
  },
];

export const stockUpdatesFields: INodeProperties[] = [
  {
    displayName: 'Stock Updates (Json)',
    name: 'stocks',
    type: 'json',
    displayOptions: {
      show: {
        operation: ['updateStock'],
        resource: ['stockUpdates'],
      },
    },
    placeholder: '',
    default: '[]',
    description: 'Array of objects (Stock Updates)',
    typeOptions: {
      alwaysOpenEditWindow: true,
    },
  },
];
