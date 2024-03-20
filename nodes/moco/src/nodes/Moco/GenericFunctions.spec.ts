import { mockClear, mockDeep } from 'jest-mock-extended';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError, sleep } from 'n8n-workflow';
import {
  createParametersFromNodeParameter,
  createUTCStringFromNodeParameter,
  mocoApiRequest,
  mocoApiRequestAllItems,
} from './GenericFunctions';

jest.mock('n8n-workflow');

describe('GenericFunctions', () => {
  const executeFunctions = mockDeep<IExecuteFunctions>();
  const mockedSleep = jest.mocked(sleep);

  afterEach(() => {
    mockClear(executeFunctions);
    mockClear(mockedSleep);
  });

  it('should create UTC string from node parameter', () => {
    const updatedAfter = '2022-01-01T00:00:00';

    executeFunctions.getNodeParameter
      .calledWith('updatedAfter', 0)
      .mockReturnValue(updatedAfter);
    executeFunctions.getTimezone.mockReturnValue('Europe/Berlin');

    expect(
      createUTCStringFromNodeParameter.call(
        executeFunctions,
        'updatedAfter',
        0,
      ),
    ).toEqual('2021-12-31T23:00:00Z');
  });

  it('should not create UTC string from node parameter', () => {
    executeFunctions.getNodeParameter
      .calledWith('updatedAfter', 0)
      .mockReturnValue('');

    expect(
      createUTCStringFromNodeParameter.call(
        executeFunctions,
        'updatedAfter',
        0,
      ),
    ).toBeUndefined();
  });

  it('should create parameters from node parameter', () => {
    const additionalFields = {
      unknownValue: '__unknown_value__',
      stringValue: '__string_value__',
      trueValue: true,
      falseValue: false,
      emptyValue: '',
    };

    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue(additionalFields);

    expect(
      createParametersFromNodeParameter.call(
        executeFunctions,
        'additionalFields',
        0,
        ['stringValue', 'trueValue', 'falseValue', 'emptyValue'],
      ),
    ).toEqual({
      string_value: '__string_value__',
      true_value: 'true',
      false_value: 'false',
    });
  });

  it('should make an impersonated API request to create one item', () => {
    const impersonateUserId = '123';
    const body = {
      firstname: 'Max',
      lastname: 'Muster',
      email: 'max.muster@beispiel.de',
      password: '123456',
      mobile_phone: '+49 177 123 45 67',
      work_phone: '+49 40 123 45 67',
      home_address: '',
      info: '',
      birthday: '1970-01-01',
      iban: 'CH3181239000001245689',
      avatar_url: 'https//meinefirma.mocoapp.com/.../profil.jpg',
      tags: ['Deutschland'],
      custom_properties: {
        'Starting Month': 'January 2015',
      },
      unit_id: 456,
    };
    const responseData = {
      id: 123,
      firstname: 'Max',
      lastname: 'Muster',
      active: true,
      extern: false,
      email: 'max.muster@beispiel.de',
      mobile_phone: '+49 177 123 45 67',
      work_phone: '+49 40 123 45 67',
      home_address: '',
      info: '',
      birthday: '1970-01-01',
      iban: 'CH3181239000001245689',
      avatar_url: 'https//meinefirma.mocoapp.com/.../profil.jpg',
      tags: ['Deutschland'],
      custom_properties: {
        'Starting Month': 'January 2015',
      },
      unit: {
        id: 456,
        name: 'Geschäftsleitung',
      },
      created_at: '2018-10-17T09:33:46Z',
      updated_at: '2018-10-17T09:33:46Z',
    };

    executeFunctions.getCredentials.calledWith('mocoApi').mockResolvedValue({
      subDomain: '__sub_domain__',
      apiKey: '__api_key__',
      webhookSecret: '__secret__',
    });
    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('mocoApi', expect.any(Object))
      .mockResolvedValueOnce({ body: responseData, statusCode: 200 });

    expect(
      mocoApiRequest.call(executeFunctions, 0, 'POST', '/users', {
        impersonateUserId,
        body,
      }),
    ).resolves.toEqual(responseData);
  });

  it('should make an API request to get one item', () => {
    const responseData = {
      id: 123,
      firstname: 'Max',
      lastname: 'Muster',
      active: true,
      extern: false,
      email: 'max.muster@beispiel.de',
      mobile_phone: '+49 177 123 45 67',
      work_phone: '+49 40 123 45 67',
      home_address: '',
      info: '',
      birthday: '1970-01-01',
      iban: 'CH3181239000001245689',
      avatar_url: 'https//meinefirma.mocoapp.com/.../profil.jpg',
      tags: ['Deutschland'],
      custom_properties: {
        'Starting Month': 'January 2015',
      },
      unit: {
        id: 456,
        name: 'Geschäftsleitung',
      },
      created_at: '2018-10-17T09:33:46Z',
      updated_at: '2018-10-17T09:33:46Z',
    };

    executeFunctions.getCredentials.calledWith('mocoApi').mockResolvedValue({
      subDomain: '__sub_domain__',
      apiKey: '__api_key__',
      webhookSecret: '__secret__',
    });
    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('mocoApi', expect.any(Object))
      .mockResolvedValueOnce({ body: responseData, statusCode: 200 });

    expect(
      mocoApiRequest.call(executeFunctions, 0, 'GET', '/users/123'),
    ).resolves.toEqual(responseData);
  });

  it('should make an API request to get one item which gets rejected', () => {
    executeFunctions.getCredentials.calledWith('mocoApi').mockResolvedValue({
      subDomain: '__sub_domain__',
      apiKey: '__api_key__',
      webhookSecret: '__secret__',
    });
    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('mocoApi', expect.any(Object))
      .mockResolvedValue({ body: 'Too many requests.', statusCode: 429 });

    expect(
      mocoApiRequest.call(executeFunctions, 0, 'GET', '/users/123'),
    ).rejects.toBeInstanceOf(NodeApiError);
  });

  it('should make an API request to get all items', () => {
    const responseData = [
      {
        id: 123,
        firstname: 'Max',
        lastname: 'Muster',
        active: true,
        extern: false,
        email: 'max.muster@beispiel.de',
        mobile_phone: '+49 177 123 45 67',
        work_phone: '+49 40 123 45 67',
        home_address: '',
        info: '',
        birthday: '1970-01-01',
        iban: 'CH3181239000001245689',
        avatar_url: 'https//meinefirma.mocoapp.com/.../profil.jpg',
        tags: ['Deutschland'],
        custom_properties: {
          'Starting Month': 'January 2015',
        },
        unit: {
          id: 456,
          name: 'Geschäftsleitung',
        },
        created_at: '2018-10-17T09:33:46Z',
        updated_at: '2018-10-17T09:33:46Z',
      },
    ];

    executeFunctions.getCredentials.calledWith('mocoApi').mockResolvedValue({
      subDomain: '__sub_domain__',
      apiKey: '__api_key__',
      webhookSecret: '__secret__',
    });
    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('mocoApi', expect.any(Object))
      .mockResolvedValueOnce({ body: responseData, statusCode: 200 })
      .mockResolvedValueOnce({ body: [], statusCode: 200 });

    expect(
      mocoApiRequestAllItems.call(executeFunctions, 0, 'GET', '/users'),
    ).resolves.toEqual(responseData);
  });

  it('should make an API request to get some items', () => {
    const responseData = [
      {
        id: 123,
        firstname: 'Max',
        lastname: 'Muster',
        active: true,
        extern: false,
        email: 'max.muster@beispiel.de',
        mobile_phone: '+49 177 123 45 67',
        work_phone: '+49 40 123 45 67',
        home_address: '',
        info: '',
        birthday: '1970-01-01',
        iban: 'CH3181239000001245689',
        avatar_url: 'https//meinefirma.mocoapp.com/.../profil.jpg',
        tags: ['Deutschland'],
        custom_properties: {
          'Starting Month': 'January 2015',
        },
        unit: {
          id: 456,
          name: 'Geschäftsleitung',
        },
        created_at: '2018-10-17T09:33:46Z',
        updated_at: '2018-10-17T09:33:46Z',
      },
      {
        id: 456,
        firstname: 'Maxi',
        lastname: 'Muster',
        active: true,
        extern: false,
        email: 'maxi.muster@beispiel.de',
        mobile_phone: '+49 177 123 45 68',
        work_phone: '+49 40 123 45 68',
        home_address: '',
        info: '',
        birthday: '2000-01-01',
        iban: 'DE3181239000001245689',
        avatar_url: 'https//meinefirma.mocoapp.com/.../profil.jpg',
        tags: ['Deutschland'],
        custom_properties: {
          'Starting Month': 'January 2015',
        },
        unit: {
          id: 789,
          name: 'Entwicklung',
        },
        created_at: '2018-10-10T07:35:13Z',
        updated_at: '2018-10-10T07:35:13Z',
      },
    ];

    executeFunctions.getCredentials.calledWith('mocoApi').mockResolvedValue({
      subDomain: '__sub_domain__',
      apiKey: '__api_key__',
      webhookSecret: '__secret__',
    });
    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('mocoApi', expect.any(Object))
      .mockResolvedValueOnce({ body: responseData, statusCode: 200 })
      .mockResolvedValueOnce({ body: [], statusCode: 200 });

    expect(
      mocoApiRequestAllItems.call(executeFunctions, 0, 'GET', '/users', {
        qs: { limit: 1 },
      }),
    ).resolves.toEqual([responseData[0]]);
  });
});
