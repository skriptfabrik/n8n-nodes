import { mockClear, mockDeep } from 'jest-mock-extended';
import { type IExecuteFunctions } from 'n8n-workflow';
import { Fulfillmenttools } from './Fulfillmenttools.node';
import {
  fulfillmenttoolsApiRequest,
  fulfillmenttoolsApiRequestAllItems,
} from './GenericFunctions';

jest.mock('./GenericFunctions');

describe('Fulfillmenttools', () => {
  const executeFunctions = mockDeep<IExecuteFunctions>();

  let fulfillmenttools: Fulfillmenttools;

  beforeEach(() => {
    fulfillmenttools = new Fulfillmenttools();
  });

  afterEach(() => {
    mockClear(executeFunctions);
  });

  it('should be defined', () => {
    expect(fulfillmenttools).toBeDefined();
  });

  it('should create facility', () => {
    const facility = {
      address: {
        city: 'Langenfeld',
        country: 'DE',
        houseNumber: '42a',
        postalCode: '40764',
        street: 'Hauptstr.',
        companyName: 'Speedy Boxales Ltd.',
      },
      name: 'Hamburg NW2',
    };
    const jsonArray = [{ json: facility }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('facility');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('create');
    executeFunctions.getNodeParameter
      .calledWith('facility', 0)
      .mockReturnValue(facility);

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue(facility);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequest).toHaveBeenCalledWith(
      'POST',
      '/facilities',
      facility,
    );
  });

  it('should get a single facility', async () => {
    const facility = {
      name: 'Store',
      locationType: 'EXTERNAL',
      address: {
        city: 'Langenfeld',
        country: 'DE',
        province: 'NRW',
        houseNumber: '42a',
        postalCode: '40764',
        street: 'Hauptstr.',
        companyName: 'Speedy Boxales Ltd.',
      },
      status: 'ONLINE',
      services: [
        {
          type: 'SHIP_FROM_STORE',
        },
      ],
      closingDays: null,
      pickingTimes: null,
      pickingMethods: null,
      scanningRule: null,
      capacityEnabled: false,
      capacityPlanningTimeframe: null,
      tags: null,
      created: '2023-11-17T13:09:09.651Z',
      lastModified: '2023-11-17T13:09:22.714Z',
      version: 3,
      id: '005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
    };
    const jsonArray = [{ json: facility }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('facility');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('facilityId', 0)
      .mockReturnValue('005319a3-29d0-4de0-ab4a-e7c1f0dc8877');

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue(facility);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequest).toHaveBeenCalledWith(
      'GET',
      '/facilities/005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
    );
  });

  it('should delete a single facility', async () => {
    const facility = {
      name: 'Store',
      locationType: 'EXTERNAL',
      address: {
        city: 'Langenfeld',
        country: 'DE',
        province: 'NRW',
        houseNumber: '42a',
        postalCode: '40764',
        street: 'Hauptstr.',
        companyName: 'Speedy Boxales Ltd.',
      },
      status: 'ONLINE',
      services: [
        {
          type: 'SHIP_FROM_STORE',
        },
      ],
      closingDays: null,
      pickingTimes: null,
      pickingMethods: null,
      scanningRule: null,
      capacityEnabled: false,
      capacityPlanningTimeframe: null,
      tags: null,
      created: '2023-11-17T13:09:09.651Z',
      lastModified: '2023-11-17T13:09:22.714Z',
      version: 3,
      id: '005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
    };
    const jsonArray = [{ json: facility }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('facility');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('delete');
    executeFunctions.getNodeParameter
      .calledWith('facilityId', 0)
      .mockReturnValue('005319a3-29d0-4de0-ab4a-e7c1f0dc8877');

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue(facility);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequest).toHaveBeenCalledWith(
      'DELETE',
      '/facilities/005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
    );
  });

  it('should list all facilities', async () => {
    const facilities = [
      {
        id: '005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
        name: 'Store Magdeburg',
        version: 18,
        tenantFacilityId: '8',
        status: 'ONLINE',
        created: '2023-11-07T09:53:15.531Z',
        lastModified: '2023-11-08T23:00:03.916Z',
        city: 'Magdeburg',
        country: 'DE',
        houseNumber: '10',
        street: 'Hauptsraße',
        postalCode: '39104',
      },
    ];
    const jsonArray = facilities.map((json) => ({ json }));
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('facility');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('list');
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(true);
    executeFunctions.getNodeParameter.calledWith('size', 0).mockReturnValue(25);
    executeFunctions.getNodeParameter
      .calledWith('status', 0)
      .mockReturnValue('');
    executeFunctions.getNodeParameter
      .calledWith('tenantFacilityId', 0)
      .mockReturnValue('');
    executeFunctions.getNodeParameter
      .calledWith('orderBy', 0)
      .mockReturnValue('');

    jest
      .mocked(fulfillmenttoolsApiRequestAllItems)
      .mockResolvedValue(facilities);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequestAllItems).toHaveBeenCalledWith(
      'facilities',
      'GET',
      '/facilities',
      undefined,
      {
        size: 25,
        status: undefined,
        tenantFacilityId: undefined,
        orderBy: undefined,
      },
    );
  });

  it('should list some facilities with provided tenant facility ID', async () => {
    const facilities = [
      {
        id: '005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
        name: 'Store Magdeburg',
        version: 18,
        tenantFacilityId: '8',
        status: 'ONLINE',
        created: '2023-11-07T09:53:15.531Z',
        lastModified: '2023-11-08T23:00:03.916Z',
        city: 'Magdeburg',
        country: 'DE',
        houseNumber: '10',
        street: 'Hauptsraße',
        postalCode: '39104',
      },
    ];
    const jsonArray = facilities.map((json) => ({ json }));
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('facility');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('list');
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(false);
    executeFunctions.getNodeParameter
      .calledWith('limit', 0)
      .mockReturnValue(50);
    executeFunctions.getNodeParameter
      .calledWith('startAfterId', 0)
      .mockReturnValue(undefined);
    executeFunctions.getNodeParameter.calledWith('size', 0).mockReturnValue(25);
    executeFunctions.getNodeParameter
      .calledWith('status', 0)
      .mockReturnValue('ONLINE');
    executeFunctions.getNodeParameter
      .calledWith('tenantFacilityId', 0)
      .mockReturnValue('1234');
    executeFunctions.getNodeParameter
      .calledWith('orderBy', 0)
      .mockReturnValue('NAME');

    jest
      .mocked(fulfillmenttoolsApiRequestAllItems)
      .mockResolvedValue(facilities);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequestAllItems).toHaveBeenCalledWith(
      'facilities',
      'GET',
      '/facilities',
      undefined,
      {
        limit: 50,
        startAfterId: undefined,
        size: 25,
        status: 'ONLINE',
        tenantFacilityId: '1234',
        orderBy: 'NAME',
      },
    );
  });

  it('should patch facility', () => {
    const facility = {
      actions: [
        {
          action: 'ModifyFacility',
          closingDays: [
            {
              date: '2020-02-03T09:45:51.525Z',
              reason: 'string',
              recurrence: 'YEARLY',
            },
          ],
        },
      ],
      version: 2,
    };
    const jsonArray = [{ json: facility }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('facility');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('patch');
    executeFunctions.getNodeParameter
      .calledWith('facilityId', 0)
      .mockReturnValue('005319a3-29d0-4de0-ab4a-e7c1f0dc8877');
    executeFunctions.getNodeParameter
      .calledWith('facility', 0)
      .mockReturnValue(facility);

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue(facility);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequest).toHaveBeenCalledWith(
      'PATCH',
      '/facilities/005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
      facility,
    );
  });

  it('should create facility carrier connection without locale', () => {
    const facilityCarrier = {
      name: 'DHL Köln',
      status: 'ACTIVE',
    };
    const jsonArray = [{ json: facilityCarrier }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('facilityCarrier');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('create');
    executeFunctions.getNodeParameter
      .calledWith('facilityId', 0)
      .mockReturnValue('005319a3-29d0-4de0-ab4a-e7c1f0dc8877');
    executeFunctions.getNodeParameter
      .calledWith('carrierRef', 0)
      .mockReturnValue('DHL');
    executeFunctions.getNodeParameter
      .calledWith('facilityCarrier', 0)
      .mockReturnValue(facilityCarrier);
    executeFunctions.getNodeParameter
      .calledWith('locale', 0)
      .mockReturnValue('');

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue(facilityCarrier);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequest).toHaveBeenCalledWith(
      'POST',
      '/facilities/005319a3-29d0-4de0-ab4a-e7c1f0dc8877/carriers/DHL',
      facilityCarrier,
      { locale: undefined },
    );
  });

  it('should create facility carrier connection with locale', () => {
    const facilityCarrier = {
      name: 'DHL Köln',
      status: 'ACTIVE',
    };
    const jsonArray = [{ json: facilityCarrier }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('facilityCarrier');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('create');
    executeFunctions.getNodeParameter
      .calledWith('facilityId', 0)
      .mockReturnValue('005319a3-29d0-4de0-ab4a-e7c1f0dc8877');
    executeFunctions.getNodeParameter
      .calledWith('carrierRef', 0)
      .mockReturnValue('DHL');
    executeFunctions.getNodeParameter
      .calledWith('facilityCarrier', 0)
      .mockReturnValue(facilityCarrier);
    executeFunctions.getNodeParameter
      .calledWith('locale', 0)
      .mockReturnValue('de_DE');

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue(facilityCarrier);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequest).toHaveBeenCalledWith(
      'POST',
      '/facilities/005319a3-29d0-4de0-ab4a-e7c1f0dc8877/carriers/DHL',
      facilityCarrier,
      { locale: 'de_DE' },
    );
  });

  it('should get facility carrier connection with locale', () => {
    const facilityCarrier = {
      name: 'DHL Köln',
      status: 'ACTIVE',
    };
    const jsonArray = [{ json: facilityCarrier }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('facilityCarrier');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('facilityId', 0)
      .mockReturnValue('005319a3-29d0-4de0-ab4a-e7c1f0dc8877');
    executeFunctions.getNodeParameter
      .calledWith('carrierRef', 0)
      .mockReturnValue('DHL');
    executeFunctions.getNodeParameter
      .calledWith('locale', 0)
      .mockReturnValue('de_DE');

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue(facilityCarrier);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequest).toHaveBeenCalledWith(
      'GET',
      '/facilities/005319a3-29d0-4de0-ab4a-e7c1f0dc8877/carriers/DHL',
      undefined,
      { locale: 'de_DE' },
    );
  });

  it('should get facility carrier connection without locale', () => {
    const facilityCarrier = {
      name: 'DHL Köln',
      status: 'ACTIVE',
    };
    const jsonArray = [{ json: facilityCarrier }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('facilityCarrier');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('facilityId', 0)
      .mockReturnValue('005319a3-29d0-4de0-ab4a-e7c1f0dc8877');
    executeFunctions.getNodeParameter
      .calledWith('carrierRef', 0)
      .mockReturnValue('DHL');
    executeFunctions.getNodeParameter
      .calledWith('locale', 0)
      .mockReturnValue('');

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue(facilityCarrier);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequest).toHaveBeenCalledWith(
      'GET',
      '/facilities/005319a3-29d0-4de0-ab4a-e7c1f0dc8877/carriers/DHL',
      undefined,
      { locale: undefined },
    );
  });

  it('should list all facility carrier connections', () => {
    const facilityCarriers = [
      {
        name: 'DHL Köln',
        status: 'ACTIVE',
      },
    ];
    const jsonArray = facilityCarriers.map((json) => ({ json }));
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('facilityCarrier');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('list');
    executeFunctions.getNodeParameter
      .calledWith('facilityId', 0)
      .mockReturnValue('005319a3-29d0-4de0-ab4a-e7c1f0dc8877');

    jest
      .mocked(fulfillmenttoolsApiRequestAllItems)
      .mockResolvedValue(facilityCarriers);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequestAllItems).toHaveBeenCalledWith(
      'carriers',
      'GET',
      '/facilities/005319a3-29d0-4de0-ab4a-e7c1f0dc8877/carriers',
    );
  });

  it('should connect facility carrier connection with locale', () => {
    const facilityCarrier = {
      name: 'DHL Köln',
      status: 'ACTIVE',
    };
    const jsonArray = [{ json: facilityCarrier }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('facilityCarrier');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('connect');
    executeFunctions.getNodeParameter
      .calledWith('facilityId', 0)
      .mockReturnValue('005319a3-29d0-4de0-ab4a-e7c1f0dc8877');
    executeFunctions.getNodeParameter
      .calledWith('carrierRef', 0)
      .mockReturnValue('DHL');
    executeFunctions.getNodeParameter
      .calledWith('facilityCarrier', 0)
      .mockReturnValue(facilityCarrier);
    executeFunctions.getNodeParameter
      .calledWith('locale', 0)
      .mockReturnValue('de_DE');

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue(facilityCarrier);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequest).toHaveBeenCalledWith(
      'PUT',
      '/facilities/005319a3-29d0-4de0-ab4a-e7c1f0dc8877/carriers/DHL',
      facilityCarrier,
      { locale: 'de_DE' },
    );
  });

  it('should connect facility carrier connection without locale', () => {
    const facilityCarrier = {
      name: 'DHL Köln',
      status: 'ACTIVE',
    };
    const jsonArray = [{ json: facilityCarrier }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('facilityCarrier');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('connect');
    executeFunctions.getNodeParameter
      .calledWith('facilityId', 0)
      .mockReturnValue('005319a3-29d0-4de0-ab4a-e7c1f0dc8877');
    executeFunctions.getNodeParameter
      .calledWith('carrierRef', 0)
      .mockReturnValue('DHL');
    executeFunctions.getNodeParameter
      .calledWith('facilityCarrier', 0)
      .mockReturnValue(facilityCarrier);
    executeFunctions.getNodeParameter
      .calledWith('locale', 0)
      .mockReturnValue('');

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue(facilityCarrier);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequest).toHaveBeenCalledWith(
      'PUT',
      '/facilities/005319a3-29d0-4de0-ab4a-e7c1f0dc8877/carriers/DHL',
      facilityCarrier,
      { locale: undefined },
    );
  });

  it('should create order', () => {
    const order = {
      consumer: {
        addresses: [
          {
            city: 'Langenfeld',
            country: 'DE',
            houseNumber: '42a',
            postalCode: '40764',
            street: 'Hauptstr.',
          },
        ],
      },
      orderDate: '2020-02-03T08:45:50.525Z',
      orderLineItems: [
        {
          article: {
            tenantArticleId: '4711',
            title: 'Cologne Water',
          },
          quantity: 21,
        },
      ],
    };
    const jsonArray = [{ json: order }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('order');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('create');
    executeFunctions.getNodeParameter
      .calledWith('order', 0)
      .mockReturnValue(order);

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue(order);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequest).toHaveBeenCalledWith(
      'POST',
      '/orders',
      order,
    );
  });

  it('should get a single order', async () => {
    const order = {
      id: '005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
      created: '2023-11-02T13:14:22.443Z',
      lastModified: '2023-11-02T13:14:22.443Z',
      orderDate: '2023-11-02T13:14:20.631Z',
      version: 1,
      status: 'OPEN',
      orderLineItems: [
        {
          quantity: 1,
          title: 'Longsleeve in mehrfarbigem Streifendesign',
        },
      ],
    };
    const jsonArray = [{ json: order }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('order');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('orderId', 0)
      .mockReturnValue('005319a3-29d0-4de0-ab4a-e7c1f0dc8877');

    jest.mocked(fulfillmenttoolsApiRequest).mockResolvedValue(order);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequest).toHaveBeenCalledWith(
      'GET',
      '/orders/005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
    );
  });

  it('should list all orders', async () => {
    const orders = [
      {
        id: '005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
        created: '2023-11-02T13:14:22.443Z',
        lastModified: '2023-11-02T13:14:22.443Z',
        orderDate: '2023-11-02T13:14:20.631Z',
        version: 1,
        status: 'OPEN',
        orderLineItems: [
          {
            quantity: 1,
            title: 'Longsleeve in mehrfarbigem Streifendesign',
          },
        ],
      },
    ];
    const jsonArray = orders.map((json) => ({ json }));
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('order');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('list');
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(true);
    executeFunctions.getNodeParameter.calledWith('size', 0).mockReturnValue(25);
    executeFunctions.getNodeParameter
      .calledWith('tenantOrderId', 0)
      .mockReturnValue('');

    jest.mocked(fulfillmenttoolsApiRequestAllItems).mockResolvedValue(orders);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequestAllItems).toHaveBeenCalledWith(
      'orders',
      'GET',
      '/orders',
      undefined,
      { size: 25, tenantOrderId: undefined },
    );
  });

  it('should list some orders with provided tenant order ID', async () => {
    const orders = [
      {
        id: '005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
        created: '2023-11-02T13:14:22.443Z',
        lastModified: '2023-11-02T13:14:22.443Z',
        orderDate: '2023-11-02T13:14:20.631Z',
        version: 1,
        status: 'OPEN',
        orderLineItems: [
          {
            quantity: 1,
            title: 'Longsleeve in mehrfarbigem Streifendesign',
          },
        ],
      },
    ];
    const jsonArray = orders.map((json) => ({ json }));
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('order');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('list');
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(false);
    executeFunctions.getNodeParameter
      .calledWith('limit', 0)
      .mockReturnValue(50);
    executeFunctions.getNodeParameter
      .calledWith('startAfterId', 0)
      .mockReturnValue(undefined);
    executeFunctions.getNodeParameter.calledWith('size', 0).mockReturnValue(25);
    executeFunctions.getNodeParameter
      .calledWith('tenantOrderId', 0)
      .mockReturnValue('1234');

    jest.mocked(fulfillmenttoolsApiRequestAllItems).mockResolvedValue(orders);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(fulfillmenttoolsApiRequestAllItems).toHaveBeenCalledWith(
      'orders',
      'GET',
      '/orders',
      undefined,
      {
        limit: 50,
        startAfterId: undefined,
        size: 25,
        tenantOrderId: '1234',
      },
    );
  });

  it('should return an error', async () => {
    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('order');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('orderId', 0)
      .mockReturnValue('005319a3-29d0-4de0-ab4a-e7c1f0dc8877');

    jest
      .mocked(fulfillmenttoolsApiRequest)
      .mockRejectedValue(new Error('__error_message__'));

    executeFunctions.continueOnFail.mockReturnValue(true);

    expect(fulfillmenttools.execute.call(executeFunctions)).resolves.toEqual([
      [{ json: { error: '__error_message__' }, pairedItem: { item: 0 } }],
    ]);

    expect(fulfillmenttoolsApiRequest).toHaveBeenCalledWith(
      'GET',
      '/orders/005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
    );
  });

  it('should throw an error', async () => {
    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('order');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('orderId', 0)
      .mockReturnValue('005319a3-29d0-4de0-ab4a-e7c1f0dc8877');

    const error = new Error('__error_message__');

    jest.mocked(fulfillmenttoolsApiRequest).mockRejectedValue(error);

    executeFunctions.continueOnFail.mockReturnValue(false);

    expect(fulfillmenttools.execute.call(executeFunctions)).rejects.toEqual(
      error,
    );

    expect(fulfillmenttoolsApiRequest).toHaveBeenCalledWith(
      'GET',
      '/orders/005319a3-29d0-4de0-ab4a-e7c1f0dc8877',
    );
  });
});
