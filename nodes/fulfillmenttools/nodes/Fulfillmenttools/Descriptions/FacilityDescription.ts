import type { INodeProperties } from 'n8n-workflow';

export const facilityOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['facility'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Add a new facility',
        action: 'Create facility',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Deletes a facility with the given ID',
        action: 'Delete facility',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a facility with the given ID',
        action: 'Get facility',
      },
      {
        name: 'List',
        value: 'list',
        description: 'Return all facilities',
        action: 'List facilities',
      },
      {
        name: 'Patch',
        value: 'patch',
        description: 'Patches a facility with the given ID',
        action: 'Patch facility',
      },
    ],
    default: 'create',
  },
];

export const facilityFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                 facility:create                               */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Facility',
    name: 'facility',
    type: 'json',
    required: true,
    default: JSON.stringify(
      {
        address: {
          additionalAddressInfo: 'to care of: Mrs. Müller',
          city: 'Langenfeld',
          country: 'DE',
          province: 'NRW',
          customAttributes: {},
          houseNumber: '42a',
          phoneNumbers: [
            {
              customAttributes: {},
              label: 'string',
              type: 'MOBILE',
              value: 'string',
            },
          ],
          postalCode: '40764',
          street: 'Hauptstr.',
          companyName: 'Speedy Boxales Ltd.',
          emailAddresses: [
            {
              recipient:
                "'Mailinglist reaching all the employees', 'Marc Fulton, Manager', etc.",
              value: 'string',
            },
          ],
        },
        closingDays: [
          {
            date: '2020-02-03T09:45:51.525Z',
            reason: 'string',
            recurrence: 'YEARLY',
          },
        ],
        contact: {
          customAttributes: {},
          firstName: 'string',
          lastName: 'string',
          roleDescription: 'Manager, Supervisor, Teamleader, etc.',
        },
        customAttributes: {},
        fulfillmentProcessBuffer: 240,
        locationType: 'STORE',
        name: 'Hamburg NW2',
        capacityPlanningTimeframe: 1,
        pickingTimes: {
          friday: [
            {
              end: {
                hour: 23,
                minute: 59,
              },
              start: {
                hour: 23,
                minute: 59,
              },
              capacity: 0,
            },
          ],
          monday: [
            {
              end: {
                hour: 23,
                minute: 59,
              },
              start: {
                hour: 23,
                minute: 59,
              },
              capacity: 0,
            },
          ],
          saturday: [
            {
              end: {
                hour: 23,
                minute: 59,
              },
              start: {
                hour: 23,
                minute: 59,
              },
              capacity: 0,
            },
          ],
          sunday: [
            {
              end: {
                hour: 23,
                minute: 59,
              },
              start: {
                hour: 23,
                minute: 59,
              },
              capacity: 0,
            },
          ],
          thursday: [
            {
              end: {
                hour: 23,
                minute: 59,
              },
              start: {
                hour: 23,
                minute: 59,
              },
              capacity: 0,
            },
          ],
          tuesday: [
            {
              end: {
                hour: 23,
                minute: 59,
              },
              start: {
                hour: 23,
                minute: 59,
              },
              capacity: 0,
            },
          ],
          wednesday: [
            {
              end: {
                hour: 23,
                minute: 59,
              },
              start: {
                hour: 23,
                minute: 59,
              },
              capacity: 0,
            },
          ],
        },
        pickingMethods: ['SINGLE_ORDER'],
        scanningRule: {
          values: [
            {
              priority: 0,
              scanningRuleType: 'ARTICLE',
            },
          ],
        },
        services: [
          {
            type: 'SHIP_FROM_STORE',
          },
        ],
        status: 'ONLINE',
        tenantFacilityId: 'K12345',
        capacityEnabled: false,
        tags: [
          {
            value: 'string',
            id: 'string',
          },
        ],
      },
      undefined,
      2,
    ),
    displayOptions: {
      show: {
        resource: ['facility'],
        operation: ['create'],
      },
    },
    description: 'Representation that describes the facility',
  },
  /* -------------------------------------------------------------------------- */
  /*                                 facility:delete                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Facility ID',
    name: 'facilityId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['facility'],
        operation: ['delete'],
      },
    },
    description: 'ID of facility you want to delete',
  },
  {
    displayName: 'Force Deletion',
    name: 'forceDeletion',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['facility'],
        operation: ['delete'],
      },
    },
    description:
      'Whether to force cascading deletion without pre condition check',
  },
  /* -------------------------------------------------------------------------- */
  /*                                 facility:get                                  */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Facility ID',
    name: 'facilityId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['facility'],
        operation: ['get'],
      },
    },
    description: 'ID of facility you want to get',
  },
  /* -------------------------------------------------------------------------- */
  /*                                 facility:list                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['facility'],
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
        resource: ['facility'],
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
    displayName: 'Start After ID',
    name: 'startAfterId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['facility'],
        operation: ['list'],
        returnAll: [false],
      },
    },
    default: '',
    description: 'All results after given ID will be returned',
  },
  {
    displayName: 'Size',
    name: 'size',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['facility'],
        operation: ['list'],
      },
    },
    typeOptions: {
      minValue: 1,
    },
    default: 25,
    description: 'Number of results to show',
  },
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    options: [
      {
        name: '--',
        value: '',
      },
      {
        name: 'Online',
        value: 'ONLINE',
      },
      {
        name: 'Offline',
        value: 'OFFLINE',
      },
      {
        name: 'Suspended',
        value: 'SUSPENDED',
      },
    ],
    displayOptions: {
      show: {
        resource: ['facility'],
        operation: ['list'],
      },
    },
    default: '',
    description:
      'Reference to the status you want to get the corresponding facilities',
  },
  {
    displayName: 'Tenant Facility ID',
    name: 'tenantFacilityId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['facility'],
        operation: ['list'],
      },
    },
    default: '',
    description: 'Allows you to filter results by tenant facility ID',
  },
  {
    displayName: 'Order By',
    name: 'orderBy',
    type: 'options',
    options: [
      {
        name: '--',
        value: '',
      },
      {
        name: 'Name',
        value: 'NAME',
      },
      {
        name: 'Created',
        value: 'CREATED',
      },
      {
        name: 'Postal Code',
        value: 'POSTAL_CODE_ASC',
      },
    ],
    displayOptions: {
      show: {
        resource: ['facility'],
        operation: ['list'],
      },
    },
    default: '',
    description: 'Query facilities order by',
  },
  /* -------------------------------------------------------------------------- */
  /*                                 facility:patch                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Facility ID',
    name: 'facilityId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['facility'],
        operation: ['patch'],
      },
    },
    description: 'ID of facility you want to patch',
  },
  {
    displayName: 'Facility',
    name: 'facility',
    type: 'json',
    required: true,
    default: JSON.stringify(
      {
        actions: [
          {
            action: '<Use the corresponding action, see documentation>',
            address: {
              additionalAddressInfo: 'to care of: Mrs. Müller',
              city: 'Langenfeld',
              country: 'DE',
              customAttributes: {},
              houseNumber: '42a',
              phoneNumbers: [
                {
                  customAttributes: {},
                  label: 'string',
                  type: 'MOBILE',
                  value: 'string',
                },
              ],
              postalCode: '40764',
              street: 'Hauptstr.',
              companyName: 'Speedy Boxales Ltd.',
              emailAddresses: [
                {
                  recipient:
                    "'Mailinglist reaching all the employees', 'Marc Fulton, Manager', etc.",
                  value: 'user@example.com',
                },
              ],
            },
            closingDays: [
              {
                date: '2020-02-03T09:45:51.525Z',
                reason: 'string',
                recurrence: 'YEARLY',
              },
            ],
            contact: {
              customAttributes: {},
              firstName: 'string',
              lastName: 'string',
              roleDescription: 'Manager, Supervisor, Teamleader, etc.',
            },
            customAttributes: {},
            fulfillmentProcessBuffer: 240,
            locationType: 'STORE',
            name: 'Hamburg NW2',
            capacityPlanningTimeframe: 1,
            pickingTimes: {
              friday: [
                {
                  end: {
                    hour: 23,
                    minute: 59,
                  },
                  start: {
                    hour: 23,
                    minute: 59,
                  },
                  capacity: 0,
                },
              ],
              monday: [
                {
                  end: {
                    hour: 23,
                    minute: 59,
                  },
                  start: {
                    hour: 23,
                    minute: 59,
                  },
                  capacity: 0,
                },
              ],
              saturday: [
                {
                  end: {
                    hour: 23,
                    minute: 59,
                  },
                  start: {
                    hour: 23,
                    minute: 59,
                  },
                  capacity: 0,
                },
              ],
              sunday: [
                {
                  end: {
                    hour: 23,
                    minute: 59,
                  },
                  start: {
                    hour: 23,
                    minute: 59,
                  },
                  capacity: 0,
                },
              ],
              thursday: [
                {
                  end: {
                    hour: 23,
                    minute: 59,
                  },
                  start: {
                    hour: 23,
                    minute: 59,
                  },
                  capacity: 0,
                },
              ],
              tuesday: [
                {
                  end: {
                    hour: 23,
                    minute: 59,
                  },
                  start: {
                    hour: 23,
                    minute: 59,
                  },
                  capacity: 0,
                },
              ],
              wednesday: [
                {
                  end: {
                    hour: 23,
                    minute: 59,
                  },
                  start: {
                    hour: 23,
                    minute: 59,
                  },
                  capacity: 0,
                },
              ],
            },
            pickingMethods: ['SINGLE_ORDER'],
            scanningRule: {
              values: [
                {
                  priority: 0,
                  scanningRuleType: 'ARTICLE',
                },
              ],
            },
            services: [
              {
                type: 'SHIP_FROM_STORE',
              },
            ],
            status: 'ONLINE',
            tenantFacilityId: 'K12345',
            capacityEnabled: true,
            tags: [
              {
                value: 'string',
                id: 'string',
              },
            ],
          },
        ],
        version: 42,
      },
      undefined,
      2,
    ),
    displayOptions: {
      show: {
        resource: ['facility'],
        operation: ['patch'],
      },
    },
    description: 'Patch set',
  },
];
