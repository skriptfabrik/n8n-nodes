import type { INodeProperties } from 'n8n-workflow';

export const facilityCarrierOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['facilityCarrier'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description:
          'Create a connection of a configured carrier to the facility with the given ID',
        action: 'Create facility carrier',
      },
      {
        name: 'Get',
        value: 'get',
        description:
          'Get the details for a carrier related to the facility with the given ID',
        action: 'Get facility carrier',
      },
      {
        name: 'List',
        value: 'list',
        description: 'Get the available CEPs for a facility',
        action: 'List facility carriers',
      },
      {
        name: 'Connect',
        value: 'connect',
        description:
          'Connect a configured carrier to the facility with the given ID',
        action: 'Connect facility carrier',
      },
    ],
    default: 'create',
  },
];

export const facilityCarrierFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                           facilityCarrier:create                           */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Facility ID',
    name: 'facilityId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['facilityCarrier'],
        operation: ['create'],
      },
    },
    description: 'ID of facility you want to create a connection for',
  },
  {
    displayName: 'Carrier Ref',
    name: 'carrierRef',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['facilityCarrier'],
        operation: ['create'],
      },
    },
    description: 'ID of the referenced carrier',
  },
  {
    displayName: 'Locale',
    name: 'locale',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['facilityCarrier'],
        operation: ['create'],
      },
    },
    description:
      'Localized names and descriptions for the parcel label classifications',
  },
  {
    displayName: 'Facility Carrier',
    name: 'facilityCarrier',
    type: 'json',
    required: true,
    default: JSON.stringify(
      {
        credentials: {
          key: 'string',
          billingNumber: '22222222220101',
          retoureBillingNumber: '22222222220701',
          internationalBillingNumber: '22222222220701',
          dhlBusinessPassword: 'string',
          dhlBusinessUsername: 'string',
          dhlBusinessUsergroup: 'string',
        },
        configuration: {
          key: 'string',
          contactId: 'It-aGZXHEm870vI',
          returnContactId: '7g0UXSgZMQd08K7',
        },
        cutoffTime: {
          hour: 16,
          minute: 30,
        },
        deliveryAreas: [
          {
            country: 'DE',
            postalCode: '40764',
          },
        ],
        name: 'DHL Köln',
        status: 'ACTIVE',
        parcelLabelClassifications: [
          {
            nameLocalized: {
              de_DE: 'Wert',
              en_US: 'Value',
              ru_RU: 'значение',
            },
            dimensions: {
              height: 50,
              length: 100,
              weight: 1700,
              width: 25,
            },
          },
        ],
        tags: [
          {
            value: 'string',
            id: 'string',
          },
        ],
        validDeliveryTargets: ['SHIP_TO_STORE'],
      },
      undefined,
      2,
    ),
    displayOptions: {
      show: {
        resource: ['facilityCarrier'],
        operation: ['create'],
      },
    },
    description: 'Representation that describes the connection',
  },
  /* -------------------------------------------------------------------------- */
  /*                            facilityCarrier:get                             */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Facility ID',
    name: 'facilityId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['facilityCarrier'],
        operation: ['get'],
      },
    },
    description: 'ID of facility you want to get',
  },
  {
    displayName: 'Carrier Ref',
    name: 'carrierRef',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['facilityCarrier'],
        operation: ['get'],
      },
    },
    description: 'ID of the referenced carrier',
  },
  {
    displayName: 'Locale',
    name: 'locale',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['facilityCarrier'],
        operation: ['get'],
      },
    },
    description:
      'Localized names and descriptions for the parcel label classifications',
  },
  /* -------------------------------------------------------------------------- */
  /*                            facilityCarrier:list                            */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Facility ID',
    name: 'facilityId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['facilityCarrier'],
        operation: ['list'],
      },
    },
    description: 'ID of facility you want to get',
  },
  /* -------------------------------------------------------------------------- */
  /*                              facilityCarrier:connect                       */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Facility ID',
    name: 'facilityId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['facilityCarrier'],
        operation: ['connect'],
      },
    },
    description: 'ID of facility you want to patch',
  },
  {
    displayName: 'Carrier Ref',
    name: 'carrierRef',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['facilityCarrier'],
        operation: ['connect'],
      },
    },
    description: 'ID of the referenced carrier',
  },
  {
    displayName: 'Locale',
    name: 'locale',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['facilityCarrier'],
        operation: ['connect'],
      },
    },
    description:
      'Localized names and descriptions for the parcel label classifications',
  },
  {
    displayName: 'Facility',
    name: 'facilityCarrier',
    type: 'json',
    required: true,
    default: JSON.stringify(
      {
        credentials: {
          key: 'string',
          billingNumber: '22222222220101',
          retoureBillingNumber: '22222222220701',
          internationalBillingNumber: '22222222220701',
          dhlBusinessPassword: 'string',
          dhlBusinessUsername: 'string',
          dhlBusinessUsergroup: 'string',
        },
        configuration: {
          key: 'string',
          contactId: 'D6C3fImQqpVV1E9',
          returnContactId: 't1h-EQTdpiXl8J4',
        },
        cutoffTime: {
          hour: 16,
          minute: 30,
        },
        deliveryAreas: [
          {
            country: 'DE',
            postalCode: '40764',
          },
        ],
        name: 'DHL Köln',
        status: 'ACTIVE',
        parcelLabelClassifications: [
          {
            nameLocalized: {
              de_DE: 'Wert',
              en_US: 'Value',
              ru_RU: 'значение',
            },
            dimensions: {
              height: 50,
              length: 100,
              weight: 1700,
              width: 25,
            },
          },
        ],
        tags: [
          {
            value: 'string',
            id: 'string',
          },
        ],
        version: 0,
        validDeliveryTargets: ['SHIP_TO_STORE'],
      },
      undefined,
      2,
    ),
    displayOptions: {
      show: {
        resource: ['facilityCarrier'],
        operation: ['connect'],
      },
    },
    description: 'Representation that describes the connection',
  },
];
