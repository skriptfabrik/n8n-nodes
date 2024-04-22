import type { INodeProperties } from 'n8n-workflow';

export const orderOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['order'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Add a new order for future fulfillment',
        action: 'Create order',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a order with the given ID',
        action: 'Get order',
      },
      {
        name: 'List',
        value: 'list',
        description: 'Return all orders',
        action: 'List orders',
      },
    ],
    default: 'create',
  },
];

export const orderFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                 order:create                               */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Order',
    name: 'order',
    type: 'json',
    required: true,
    default: JSON.stringify(
      {
        orderDate: '2023-03-11T08:16:07.000Z',
        consumer: {
          email: 'ulf.steinke@ocff.de',
          addresses: [
            {
              street: 'Schanzenstr.',
              houseNumber: '30',
              postalCode: '51063',
              city: 'Köln',
              country: 'DE',
              phoneNumbers: [
                {
                  value: '0177-555-6273',
                  label: 'private',
                  type: 'MOBILE',
                },
              ],
              additionalAddressInfo: '3. Etage',
              salutation: 'Herr',
              firstName: 'Ulf',
              lastName: 'Steinke',
            },
          ],
        },
        tenantOrderId: 'FC-4711-2361',
        status: 'OPEN',
        orderLineItems: [
          {
            article: {
              tenantArticleId: '2020249',
              title: 'T-Shirt "Am Sonnenhut"',
              imageUrl:
                'https://d358g9injarr4u.cloudfront.net/res/product_1000/240eadd8-8f50-479d-b0d8-74412bd4a9f9.jpg',
              attributes: [
                {
                  category: 'miscellaneous',
                  key: 'BRAND',
                  value: 'Adidas',
                },
                {
                  category: 'descriptive',
                  priority: 100,
                  key: '%%subtitle%%',
                  value: 'Neu!',
                },
                {
                  category: 'descriptive',
                  priority: 200,
                  key: 'Mitgliederpreis',
                  value: '17,96 EUR',
                },
                {
                  category: 'descriptive',
                  priority: 300,
                  key: 'Schnitt',
                  value: 'Frauen',
                },
                {
                  category: 'descriptive',
                  priority: 400,
                  key: 'Material',
                  value: '100% Baumwolle',
                },
                {
                  category: 'descriptive',
                  priority: 500,
                  key: 'Artikelnummer',
                  value: '2020249',
                },
                {
                  category: 'descriptive',
                  priority: 600,
                  key: 'Größe',
                  value: 'S',
                },
                {
                  category: 'descriptive',
                  priority: 700,
                  key: 'Beschreibung',
                  value:
                    'Rotes T-Shirt mit weißen Streifen an den Ärmeln, Blockdruck mit Schriftzug auf der Brust',
                },
              ],
            },
            quantity: 1,
            scannableCodes: ['2020249'],
          },
          {
            article: {
              tenantArticleId: '2010681',
              title: 'Steppjacke "Mühlenbach"',
              imageUrl:
                'https://d358g9injarr4u.cloudfront.net/res/product_1000/9fcb7e42-7c84-4ab0-999a-869efe077e0a.jpg',
              attributes: [
                {
                  category: 'descriptive',
                  priority: 100,
                  key: '%%subtitle%%',
                  value: 'Neu!',
                },
                {
                  category: 'descriptive',
                  priority: 200,
                  key: 'Größe',
                  value: 'L',
                },
                {
                  category: 'descriptive',
                  priority: 300,
                  key: 'Oberstoff',
                  value: '100% Polyester',
                },
                {
                  category: 'descriptive',
                  priority: 400,
                  key: 'Futter',
                  value: '100% Polyester',
                },
                {
                  category: 'descriptive',
                  priority: 500,
                  key: 'Füllung',
                  value: '100% Polyester',
                },
                {
                  category: 'descriptive',
                  priority: 600,
                  key: 'Beschreibung',
                  value:
                    'Dreifarbige Steppjacke mit verstaubarer Kapuze, Zwei Eingriffstaschen, Gesticktes Logo auf der Brust',
                },
                {
                  category: 'descriptive',
                  priority: 700,
                  key: 'Artikelnummer',
                  value: '2010681',
                },
              ],
            },
            quantity: 1,
            scannableCodes: ['2010681'],
          },
          {
            article: {
              tenantArticleId: '5020064',
              title: 'Wandtattoo Stadion',
              imageUrl:
                'https://d358g9injarr4u.cloudfront.net/res/product_1000/343f4569-66bb-4b0c-aa2b-20011a51b620.jpg',
              attributes: [
                {
                  category: 'descriptive',
                  priority: 100,
                  key: 'Maße',
                  value: '70 x 50 cm',
                },
                {
                  category: 'descriptive',
                  priority: 200,
                  key: 'Beschreibung',
                  value:
                    'Wandtattoo in Ziegelwand-Optik, Mit tollem Blick aufs Stadion',
                },
                {
                  category: 'descriptive',
                  priority: 300,
                  key: 'Anwendung',
                  value:
                    'Für die Beklebung sollte die Fläche staub- und fetfrei sein. Bringen Sie den Aufkleber in Position und reiben Sie diese gleichmäßig mit der flachen Hand an den Untergrund, um sie zu fixieren. Jede Stelle nochmals gest andrücken. Fertig! Für auftretende Schäden nach der Verklebung auf dem Untergrund etc. ist eine Haftung ausgeschlossen.',
                },
                {
                  category: 'descriptive',
                  priority: 400,
                  key: 'Artikelnummer',
                  value: '5020064',
                },
              ],
            },
            quantity: 2,
            scannableCodes: ['5020064'],
          },
        ],
        paymentInfo: {
          currency: 'EUR',
        },
      },
      undefined,
      2,
    ),
    displayOptions: {
      show: {
        resource: ['order'],
        operation: ['create'],
      },
    },
    description: 'Order object supplied by your shop instance',
  },
  /* -------------------------------------------------------------------------- */
  /*                                 order:get                                  */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Order ID',
    name: 'orderId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['order'],
        operation: ['get'],
      },
    },
    description: 'ID of order you want to get',
  },
  /* -------------------------------------------------------------------------- */
  /*                                 order:list                                 */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['order'],
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
        resource: ['order'],
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
        resource: ['order'],
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
        resource: ['order'],
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
    displayName: 'Tenant Order ID',
    name: 'tenantOrderId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['order'],
        operation: ['list'],
      },
    },
    default: '',
    description: 'Allows you to filter results by tenant order ID',
  },
];
