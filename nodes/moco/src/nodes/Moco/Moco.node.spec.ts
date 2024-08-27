import { mockClear, mockDeep } from 'jest-mock-extended';
import {
  type IExecuteFunctions,
  type ILoadOptionsFunctions,
} from 'n8n-workflow';
import { Moco } from './Moco.node';
import {
  mocoApiRequest,
  mocoApiRequestAllItems,
  createParametersFromNodeParameter,
} from './GenericFunctions';
import {
  Activity,
  ActivityParameters,
  CommonCompanyParameters,
  Company,
  CompanyParameters,
  CustomerCompanyParameters,
  Project,
  ProjectParameters,
  SupplierCompanyParameters,
  User,
  UserParameters,
} from '../../api';

jest.mock('./GenericFunctions');

describe('Moco', () => {
  const loadOptionsFunctions = mockDeep<ILoadOptionsFunctions>();
  const executeFunctions = mockDeep<IExecuteFunctions>();
  const mockedMocoApiRequest = jest.mocked(mocoApiRequest);
  const mockedMocoApiRequestAllItems = jest.mocked(mocoApiRequestAllItems);

  let moco: Moco;

  beforeEach(() => {
    moco = new Moco();
  });

  afterEach(() => {
    mockClear(loadOptionsFunctions);
    mockClear(executeFunctions);
    mockClear(mockedMocoApiRequest);
    mockClear(mockedMocoApiRequestAllItems);

    jest.mocked(createParametersFromNodeParameter).mockRestore();
  });

  it('should be defined', () => {
    expect(moco).toBeDefined();
  });

  it('should load companies', () => {
    mockedMocoApiRequestAllItems.mockResolvedValue([
      {
        id: 760253573,
        name: 'Beispiel AG',
      },
      {
        id: 569873254,
        name: 'Beispiel GmbH',
      },
    ]);

    expect(
      moco.methods.loadOptions.listCompanies.call(loadOptionsFunctions),
    ).resolves.toEqual([
      {
        name: 'Beispiel AG',
        value: 760253573,
      },
      {
        name: 'Beispiel GmbH',
        value: 569873254,
      },
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      undefined,
      'GET',
      '/companies',
    );
  });

  it('should load customers', () => {
    mockedMocoApiRequestAllItems.mockResolvedValue([
      {
        id: 760253573,
        name: 'Beispiel AG',
      },
      {
        id: 569873254,
        name: 'Beispiel GmbH',
      },
    ]);

    expect(
      moco.methods.loadOptions.listCustomers.call(loadOptionsFunctions),
    ).resolves.toEqual([
      {
        name: 'Beispiel AG',
        value: 760253573,
      },
      {
        name: 'Beispiel GmbH',
        value: 569873254,
      },
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      undefined,
      'GET',
      '/companies',
      { qs: { type: 'customer' } },
    );
  });

  it('should load leads', () => {
    mockedMocoApiRequestAllItems.mockResolvedValue([
      {
        id: 123,
        name: 'Website V2',
      },
      {
        id: 456,
        name: 'Website V1',
      },
    ]);

    expect(
      moco.methods.loadOptions.listLeads.call(loadOptionsFunctions),
    ).resolves.toEqual([
      {
        name: 'Website V1',
        value: 456,
      },
      {
        name: 'Website V2',
        value: 123,
      },
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      undefined,
      'GET',
      '/deals',
    );
  });

  it('should load projects', () => {
    mockedMocoApiRequestAllItems.mockResolvedValue([
      {
        id: 1234567,
        name: 'Website Support',
        customer: {
          id: 1233434,
          name: 'Beispiel AG',
        },
      },
      {
        id: 8912345,
        name: 'Entwicklung',
        customer: {
          id: 5639875,
          name: 'Beispiel GbR',
        },
      },
    ]);

    expect(
      moco.methods.loadOptions.listProjects.call(loadOptionsFunctions),
    ).resolves.toEqual([
      {
        name: 'Beispiel AG > Website Support',
        value: 1234567,
      },
      {
        name: 'Beispiel GbR > Entwicklung',
        value: 8912345,
      },
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      undefined,
      'GET',
      '/projects',
    );
  });

  it('should load project tasks of selected project', () => {
    loadOptionsFunctions.getCurrentNodeParameter
      .calledWith('projectId')
      .mockReturnValue(1234567);

    mockedMocoApiRequestAllItems.mockResolvedValue([
      {
        id: 760253573,
        name: 'Projektleitung',
      },
    ]);

    expect(
      moco.methods.loadOptions.listProjectTasks.call(loadOptionsFunctions),
    ).resolves.toEqual([
      {
        name: 'Projektleitung',
        value: 760253573,
      },
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      undefined,
      'GET',
      '/projects/1234567/tasks',
    );
  });

  it('should load all project tasks', () => {
    loadOptionsFunctions.getCurrentNodeParameter
      .calledWith('projectId')
      .mockReturnValue(undefined);

    mockedMocoApiRequestAllItems.mockResolvedValue([
      {
        id: 1234567,
        name: 'Website Support',
        customer: {
          id: 1233434,
          name: 'Beispiel AG',
        },
        tasks: [
          {
            id: 125112,
            name: 'Project Management',
          },
          {
            id: 125111,
            name: 'Development',
          },
        ],
      },
    ]);

    expect(
      moco.methods.loadOptions.listProjectTasks.call(loadOptionsFunctions),
    ).resolves.toEqual([
      {
        name: 'Beispiel AG > Website Support > Development',
        value: 125111,
      },
      {
        name: 'Beispiel AG > Website Support > Project Management',
        value: 125112,
      },
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      undefined,
      'GET',
      '/projects',
    );
  });

  it('should load teams', () => {
    mockedMocoApiRequestAllItems.mockResolvedValue([
      {
        id: 909147861,
        name: 'C Office',
      },
      {
        id: 569987632,
        name: 'B Office',
      },
      {
        id: 5689732545,
        name: 'A Office',
      },
    ]);

    expect(
      moco.methods.loadOptions.listTeams.call(loadOptionsFunctions),
    ).resolves.toEqual([
      {
        name: 'A Office',
        value: 5689732545,
      },
      {
        name: 'B Office',
        value: 569987632,
      },
      {
        name: 'C Office',
        value: 909147861,
      },
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      undefined,
      'GET',
      '/units',
    );
  });

  it('should load users', () => {
    mockedMocoApiRequestAllItems.mockResolvedValue([
      {
        id: 123,
        firstname: 'Max',
        lastname: 'Muster',
      },
      {
        id: 456,
        firstname: 'Sabine',
        lastname: 'Schäuble',
      },
    ]);

    expect(
      moco.methods.loadOptions.listUsers.call(loadOptionsFunctions),
    ).resolves.toEqual([
      {
        name: 'Max Muster',
        value: 123,
      },
      {
        name: 'Sabine Schäuble',
        value: 456,
      },
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      undefined,
      'GET',
      '/users',
    );
  });

  it('should create an activity as authorized user', () => {
    const body: ActivityParameters = {
      date: '2017-06-11',
      project_id: 123456,
      task_id: 234567,
      seconds: 0,
      description: '',
    };
    const activity: Partial<Activity> = {
      id: 982237015,
      date: body.date,
      project: {
        id: body.project_id,
        name: 'Website Relaunch',
        billable: true,
      },
      task: {
        id: body.task_id,
        name: 'Project Management',
        billable: true,
      },
      seconds: body.seconds,
      description: body.description,
    };
    const jsonArray = [{ json: activity }];
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
      .mockReturnValue('activity');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('create');
    executeFunctions.getNodeParameter
      .calledWith('date', 0)
      .mockReturnValue(body.date);
    executeFunctions.getNodeParameter
      .calledWith('projectId', 0)
      .mockReturnValue(body.project_id);
    executeFunctions.getNodeParameter
      .calledWith('taskId', 0)
      .mockReturnValue(body.task_id);
    executeFunctions.getNodeParameter
      .calledWith('seconds', 0)
      .mockReturnValue(body.seconds);
    executeFunctions.getNodeParameter
      .calledWith('description', 0)
      .mockReturnValue(body.description);
    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequest.mockResolvedValue({ body: activity, statusCode: 200 });

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'POST',
      '/activities',
      {
        impersonateUserId: undefined,
        body,
      },
    );
  });

  it('should delete an activity', () => {
    const activityId = 982237015;
    const executionData = [
      {
        json: {},
        pairedItem: { item: 0 },
      },
    ];

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('activity');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('delete');
    executeFunctions.getNodeParameter
      .calledWith('activityId', 0)
      .mockReturnValue(activityId);

    executeFunctions.helpers.returnJsonArray.mockReturnValue([]);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'DELETE',
      `/activities/${activityId}`,
    );
  });

  it('should get an activity', () => {
    const activityId = 982237015;
    const activity: Partial<Activity> = {
      id: activityId,
      date: '2017-06-11',
      project: {
        id: 123456,
        name: 'Website Relaunch',
        billable: true,
      },
      task: {
        id: 234567,
        name: 'Project Management',
        billable: true,
      },
      seconds: 0,
      description: '',
    };
    const jsonArray = [{ json: activity }];
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
      .mockReturnValue('activity');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('activityId', 0)
      .mockReturnValue(activityId);

    mockedMocoApiRequest.mockResolvedValue({ body: activity, statusCode: 200 });

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'GET',
      `/activities/${activityId}`,
    );
  });

  it('should list all activities', () => {
    const activities: Partial<Activity>[] = [
      {
        id: 982237015,
        date: '2017-06-11',
        project: {
          id: 123456,
          name: 'Website Relaunch',
          billable: true,
        },
        task: {
          id: 234567,
          name: 'Project Management',
          billable: true,
        },
        seconds: 0,
        description: '',
      },
      {
        id: 982237016,
        date: '2017-06-12',
        project: {
          id: 123456,
          name: 'Website Relaunch',
          billable: true,
        },
        task: {
          id: 568732,
          name: 'Development',
          billable: true,
        },
        seconds: 60,
        description: 'Test',
      },
    ];
    const jsonArray = activities.map((json) => ({ json }));
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
      .mockReturnValue('activity');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('list');
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(true);
    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequestAllItems.mockResolvedValue(activities);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      0,
      'GET',
      '/activities',
      {
        qs: {},
      },
    );
  });

  it('should list some activities', () => {
    const activities: Partial<Activity>[] = [
      {
        id: 982237015,
        date: '2017-06-11',
        project: {
          id: 123456,
          name: 'Website Relaunch',
          billable: true,
        },
        task: {
          id: 234567,
          name: 'Project Management',
          billable: true,
        },
        seconds: 0,
        description: '',
      },
      {
        id: 982237016,
        date: '2017-06-12',
        project: {
          id: 123456,
          name: 'Website Relaunch',
          billable: true,
        },
        task: {
          id: 568732,
          name: 'Development',
          billable: true,
        },
        seconds: 60,
        description: 'Test',
      },
    ];
    const jsonArray = activities.map((json) => ({ json }));
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
      .mockReturnValue('activity');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('list');
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(false);
    executeFunctions.getNodeParameter.calledWith('limit', 0).mockReturnValue(0);
    executeFunctions.getNodeParameter.calledWith('ids', 0).mockReturnValue('');
    executeFunctions.getNodeParameter
      .calledWith('updatedAfter', 0)
      .mockReturnValue('');
    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequestAllItems.mockResolvedValue(activities);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      0,
      'GET',
      '/activities',
      {
        qs: { limit: undefined, ids: undefined, updated_after: undefined },
      },
    );
  });

  it('should update an activity', () => {
    const activityId = 982237015;
    const body: ActivityParameters = {
      date: '2017-06-11',
      project_id: 123456,
      task_id: 234567,
      seconds: 0,
      description: '',
    };
    const activity: Partial<Activity> = {
      id: activityId,
      date: body.date,
      project: {
        id: body.project_id,
        name: 'Website Relaunch',
        billable: true,
      },
      task: {
        id: body.task_id,
        name: 'Project Management',
        billable: true,
      },
      seconds: body.seconds,
      description: body.description,
    };
    const jsonArray = [{ json: activity }];
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
      .mockReturnValue('activity');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('update');
    executeFunctions.getNodeParameter
      .calledWith('activityId', 0)
      .mockReturnValue(activityId);
    executeFunctions.getNodeParameter
      .calledWith('date', 0)
      .mockReturnValue(body.date);
    executeFunctions.getNodeParameter
      .calledWith('projectId', 0)
      .mockReturnValue(body.project_id);
    executeFunctions.getNodeParameter
      .calledWith('taskId', 0)
      .mockReturnValue(body.task_id);
    executeFunctions.getNodeParameter
      .calledWith('seconds', 0)
      .mockReturnValue(body.seconds);
    executeFunctions.getNodeParameter
      .calledWith('description', 0)
      .mockReturnValue(body.description);
    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequest.mockResolvedValue({ body: activity, statusCode: 200 });

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'PUT',
      `/activities/${activityId}`,
      {
        impersonateUserId: undefined,
        body,
      },
    );
  });

  it('should create an activity as impersonated user', () => {
    const impersonateUserId = '1234567';
    const body: ActivityParameters = {
      date: '2017-06-11',
      project_id: 123456,
      task_id: 234567,
      seconds: 0,
      description: '',
    };
    const activity: Partial<Activity> = {
      id: 982237015,
      date: body.date,
      project: {
        id: body.project_id,
        name: 'Website Relaunch',
        billable: true,
      },
      task: {
        id: body.task_id,
        name: 'Project Management',
        billable: true,
      },
      seconds: body.seconds,
      description: body.description,
    };
    const jsonArray = [{ json: activity }];
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
      .mockReturnValue('activity');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('create');
    executeFunctions.getNodeParameter
      .calledWith('impersonateUserId', 0)
      .mockReturnValue(impersonateUserId);
    executeFunctions.getNodeParameter
      .calledWith('date', 0)
      .mockReturnValue(body.date);
    executeFunctions.getNodeParameter
      .calledWith('projectId', 0)
      .mockReturnValue(body.project_id);
    executeFunctions.getNodeParameter
      .calledWith('taskId', 0)
      .mockReturnValue(body.task_id);
    executeFunctions.getNodeParameter
      .calledWith('seconds', 0)
      .mockReturnValue(body.seconds);
    executeFunctions.getNodeParameter
      .calledWith('description', 0)
      .mockReturnValue(body.description);
    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequest.mockResolvedValue({ body: activity, statusCode: 200 });

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'POST',
      '/activities',
      {
        impersonateUserId,
        body,
      },
    );
  });

  it.each<{ type: CompanyParameters['type']; withCustomProperties: boolean }>([
    { type: 'customer', withCustomProperties: true },
    { type: 'customer', withCustomProperties: false },
    { type: 'supplier', withCustomProperties: true },
    { type: 'supplier', withCustomProperties: false },
    { type: 'organization', withCustomProperties: true },
    { type: 'organization', withCustomProperties: true },
  ])(
    'should create a company with type $type and custom properties: $withCustomProperties',
    ({ type, withCustomProperties }) => {
      const body: CommonCompanyParameters = {
        name: '_name_',
        type,
        country_code: '_country_code_',
        vat_identifier: '_vat_identifier_',
        alternative_correspondence_language: true,
        website: '_website_',
        fax: '_fax_',
        phone: '_phone_',
        email: '_email_',
        billing_email_cc: '_billing_email_cc_',
        address: '_address_',
        info: '_info_',
        tags: ['_tag1_', '_tag2_'],
        footer: '_footer_',
      };

      if (type === 'customer') {
        Object.assign<CommonCompanyParameters, CustomerCompanyParameters>(
          body,
          {
            type,
            currency: '_currency_',
            identifier: '_identifier_',
            customer_tax: 19.0,
            default_invoice_due_days: 20,
            debit_number: 10000,
          },
        );
      }

      if (type === 'supplier') {
        Object.assign<CommonCompanyParameters, SupplierCompanyParameters>(
          body,
          {
            type,
            iban: '_iban_',
            supplier_tax: 19.0,
            credit_number: 70000,
          },
        );
      }

      if (withCustomProperties) {
        Object.assign(body, {
          custom_properties: {
            _prop_key_: '_prop_value_',
          },
        });
      }

      const company: Company = {
        id: 1234567,
        type: type as 'customer' | 'supplier' | 'organization',
        name: '_name_',
        website: '_website_',
        email: '_email_',
        billing_email_cc: '_billing_email_cc_',
        phone: '_phone_',
        fax: '_fax_',
        address: '_address_',
        tags: ['_tag1_', '_tag2_'],
        user: {
          id: 123456,
          firstname: '_user_firstname_',
          lastname: '_user_lastname_',
        },
        info: '_info_',
        custom_properties: {
          _prop_key_: '_prop_value_',
        },
        identifier: '_identifier_',
        intern: false,
        billing_tax: 19.0,
        customer_vat: {
          tax: 19.0,
          reverse_charge: false,
          intra_eu: false,
          active: true,
          print_gross_total: false,
          notice_tax_exemption: '_notice_tax_exemption_',
          notice_tax_exemption_alt: '_notice_tax_exemption_alt_',
        },
        supplier_vat: {
          tax: 19.0,
          reverse_charge: false,
          intra_eu: false,
          active: true,
        },
        currency: '_currency_',
        custom_rates: false,
        include_time_report: false,
        billing_notes: '_billing_notes_',
        default_discount: 0.0,
        default_cash_discount: 0.0,
        default_cash_discount_days: 0,
        country_code: '_country_code_',
        vat_identifier: '_vat_identifier_',
        alternative_correspondence_language: true,
        default_invoice_due_days: 20,
        footer: '_footer_',
        projects: [],
        created_at: '_created_at_',
        updated_at: '_updated_at_',
        debit_number: 10000,
      };

      const jsonArray = [{ json: company }];
      const executionData = jsonArray.map(({ json }) => ({
        json,
        pairedItem: { item: 0 },
      }));

      executeFunctions.getInputData.mockReturnValue([
        {
          json: {},
        },
      ]);

      const additionalFields = [
        'countryCode',
        'vatIdentifier',
        'alternativeCorrespondenceLanguage',
        'website',
        'fax',
        'phone',
        'email',
        'billingEmailCc',
        'address',
        'info',
        'customProperties',
        'tags',
        'footer',
      ];

      const additionalFieldsParameters: {
        [key in keyof CompanyParameters]?: string | number | boolean | object;
      } = {
        country_code: '_country_code_',
        vat_identifier: '_vat_identifier_',
        alternative_correspondence_language: true,
        website: '_website_',
        fax: '_fax_',
        phone: '_phone_',
        email: '_email_',
        billing_email_cc: '_billing_email_cc_',
        address: '_address_',
        info: '_info_',
        tags: ['_tag1_', '_tag2_'],
        footer: '_footer_',
      };

      if (withCustomProperties) {
        additionalFieldsParameters['custom_properties'] = {
          values: [
            {
              key: '_prop_key_',
              value: '_prop_value_',
            },
          ],
        };
      }

      if (type === 'customer') {
        additionalFields.push(
          'customerTax',
          'defaultInvoiceDueDays',
          'debitNumber',
        );

        Object.assign(additionalFieldsParameters, {
          customer_tax: 19.0,
          default_invoice_due_days: 20,
          debit_number: 10000,
        });
      }

      if (type === 'supplier') {
        additionalFields.push('iban', 'supplierTax', 'creditNumber');

        Object.assign(additionalFieldsParameters, {
          iban: '_iban_',
          supplier_tax: 19.0,
          credit_number: 70000,
        });
      }

      jest
        .mocked(createParametersFromNodeParameter)
        .mockReturnValueOnce(additionalFieldsParameters);

      executeFunctions.getNodeParameter
        .calledWith('resource', 0)
        .mockReturnValue('company');

      executeFunctions.getNodeParameter
        .calledWith('operation', 0)
        .mockReturnValue('create');

      executeFunctions.getNodeParameter
        .calledWith('name', 0)
        .mockReturnValue('_name_');

      executeFunctions.getNodeParameter
        .calledWith('type', 0)
        .mockReturnValue(type);

      if (type === 'customer') {
        executeFunctions.getNodeParameter
          .calledWith('currency', 0)
          .mockReturnValue('_currency_');

        executeFunctions.getNodeParameter
          .calledWith('identifier', 0)
          .mockReturnValue('_identifier_');
      }

      mockedMocoApiRequest.mockResolvedValue({
        body: company,
        statusCode: 200,
      });

      executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

      executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
        executionData,
      );

      expect(moco.execute.call(executeFunctions)).resolves.toEqual([
        executionData,
      ]);

      expect(mockedMocoApiRequest).toHaveBeenCalledWith(
        0,
        'POST',
        '/companies',
        {
          body,
        },
      );

      expect(createParametersFromNodeParameter).toHaveBeenCalledTimes(1);
      expect(createParametersFromNodeParameter).toHaveBeenCalledWith(
        'additionalFields',
        0,
        additionalFields,
      );
    },
  );

  it('should delete a company', () => {
    const companyId = 1234567;
    const executionData = [
      {
        json: {},
        pairedItem: { item: 0 },
      },
    ];

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('company');

    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('delete');

    executeFunctions.getNodeParameter
      .calledWith('companyId', 0)
      .mockReturnValue(companyId);

    executeFunctions.helpers.returnJsonArray.mockReturnValue([]);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'DELETE',
      `/companies/${companyId}`,
    );
  });

  it('should get a company', () => {
    const companyId = 1234567;
    const company: Company = {
      id: 1234567,
      type: 'customer',
      name: '_name_',
      website: '_website_',
      email: '_email_',
      billing_email_cc: '_billing_email_cc_',
      phone: '_phone_',
      fax: '_fax_',
      address: '_address_',
      tags: ['_tag1_', '_tag2_'],
      user: {
        id: 123456,
        firstname: '_user_firstname_',
        lastname: '_user_lastname_',
      },
      info: '_info_',
      custom_properties: {
        _prop_key_: '_prop_value_',
      },
      identifier: '_identifier_',
      intern: false,
      billing_tax: 19.0,
      customer_vat: {
        tax: 19.0,
        reverse_charge: false,
        intra_eu: false,
        active: true,
        print_gross_total: false,
        notice_tax_exemption: '_notice_tax_exemption_',
        notice_tax_exemption_alt: '_notice_tax_exemption_alt_',
      },
      supplier_vat: {
        tax: 19.0,
        reverse_charge: false,
        intra_eu: false,
        active: true,
      },
      currency: '_currency_',
      custom_rates: false,
      include_time_report: false,
      billing_notes: '_billing_notes_',
      default_discount: 0.0,
      default_cash_discount: 0.0,
      default_cash_discount_days: 0,
      country_code: '_country_code_',
      vat_identifier: '_vat_identifier_',
      alternative_correspondence_language: true,
      default_invoice_due_days: 20,
      footer: '_footer_',
      projects: [],
      created_at: '_created_at_',
      updated_at: '_updated_at_',
      debit_number: 10000,
    };

    const jsonArray = [{ json: company }];
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
      .mockReturnValue('company');

    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');

    executeFunctions.getNodeParameter
      .calledWith('companyId', 0)
      .mockReturnValue(companyId);

    mockedMocoApiRequest.mockResolvedValue({ body: company, statusCode: 200 });

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'GET',
      `/companies/${companyId}`,
    );
  });

  it('should list all companies', () => {
    const companies: Company[] = [
      {
        id: 1234567,
        type: 'customer',
        name: '_name_',
        website: '_website_',
        email: '_email_',
        billing_email_cc: '_billing_email_cc_',
        phone: '_phone_',
        fax: '_fax_',
        address: '_address_',
        tags: ['_tag1_', '_tag2_'],
        user: {
          id: 123456,
          firstname: '_user_firstname_',
          lastname: '_user_lastname_',
        },
        info: '_info_',
        custom_properties: {
          _prop_key_: '_prop_value_',
        },
        identifier: '_identifier_',
        intern: false,
        billing_tax: 19.0,
        customer_vat: {
          tax: 19.0,
          reverse_charge: false,
          intra_eu: false,
          active: true,
          print_gross_total: false,
          notice_tax_exemption: '_notice_tax_exemption_',
          notice_tax_exemption_alt: '_notice_tax_exemption_alt_',
        },
        supplier_vat: {
          tax: 19.0,
          reverse_charge: false,
          intra_eu: false,
          active: true,
        },
        currency: '_currency_',
        custom_rates: false,
        include_time_report: false,
        billing_notes: '_billing_notes_',
        default_discount: 0.0,
        default_cash_discount: 0.0,
        default_cash_discount_days: 0,
        country_code: '_country_code_',
        vat_identifier: '_vat_identifier_',
        alternative_correspondence_language: true,
        default_invoice_due_days: 20,
        footer: '_footer_',
        projects: [],
        created_at: '_created_at_',
        updated_at: '_updated_at_',
        debit_number: 10000,
      },
      {
        id: 7654321,
        type: 'supplier',
        name: '_name_',
        website: '_website_',
        email: '_email_',
        billing_email_cc: '_billing_email_cc_',
        phone: '_phone_',
        fax: '_fax_',
        address: '_address_',
        tags: ['_tag1_', '_tag2_'],
        user: {
          id: 123456,
          firstname: '_user_firstname_',
          lastname: '_user_lastname_',
        },
        info: '_info_',
        custom_properties: {
          _prop_key_: '_prop_value_',
        },
        identifier: '_identifier_',
        intern: false,
        billing_tax: 19.0,
        customer_vat: {
          tax: 19.0,
          reverse_charge: false,
          intra_eu: false,
          active: true,
          print_gross_total: false,
          notice_tax_exemption: '_notice_tax_exemption_',
          notice_tax_exemption_alt: '_notice_tax_exemption_alt_',
        },
        supplier_vat: {
          tax: 19.0,
          reverse_charge: false,
          intra_eu: false,
          active: true,
        },
        currency: '_currency_',
        custom_rates: false,
        include_time_report: false,
        billing_notes: '_billing_notes_',
        default_discount: 0.0,
        default_cash_discount: 0.0,
        default_cash_discount_days: 0,
        country_code: '_country_code_',
        vat_identifier: '_vat_identifier_',
        alternative_correspondence_language: true,
        default_invoice_due_days: 20,
        footer: '_footer_',
        projects: [],
        created_at: '_created_at_',
        updated_at: '_updated_at_',
        debit_number: 10000,
      },
    ];

    const jsonArray = companies.map((json) => ({ json }));
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
      .mockReturnValue('company');

    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('list');

    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(true);

    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequestAllItems.mockResolvedValue(companies);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      0,
      'GET',
      '/companies',
      {
        qs: {},
      },
    );
  });

  it('should list some companies', () => {
    const companies: Company[] = [
      {
        id: 1234567,
        type: 'customer',
        name: '_name_',
        website: '_website_',
        email: '_email_',
        billing_email_cc: '_billing_email_cc_',
        phone: '_phone_',
        fax: '_fax_',
        address: '_address_',
        tags: ['_tag1_', '_tag2_'],
        user: {
          id: 123456,
          firstname: '_user_firstname_',
          lastname: '_user_lastname_',
        },
        info: '_info_',
        custom_properties: {
          _prop_key_: '_prop_value_',
        },
        identifier: '_identifier_',
        intern: false,
        billing_tax: 19.0,
        customer_vat: {
          tax: 19.0,
          reverse_charge: false,
          intra_eu: false,
          active: true,
          print_gross_total: false,
          notice_tax_exemption: '_notice_tax_exemption_',
          notice_tax_exemption_alt: '_notice_tax_exemption_alt_',
        },
        supplier_vat: {
          tax: 19.0,
          reverse_charge: false,
          intra_eu: false,
          active: true,
        },
        currency: '_currency_',
        custom_rates: false,
        include_time_report: false,
        billing_notes: '_billing_notes_',
        default_discount: 0.0,
        default_cash_discount: 0.0,
        default_cash_discount_days: 0,
        country_code: '_country_code_',
        vat_identifier: '_vat_identifier_',
        alternative_correspondence_language: true,
        default_invoice_due_days: 20,
        footer: '_footer_',
        projects: [],
        created_at: '_created_at_',
        updated_at: '_updated_at_',
        debit_number: 10000,
      },
      {
        id: 7654321,
        type: 'supplier',
        name: '_name_',
        website: '_website_',
        email: '_email_',
        billing_email_cc: '_billing_email_cc_',
        phone: '_phone_',
        fax: '_fax_',
        address: '_address_',
        tags: ['_tag1_', '_tag2_'],
        user: {
          id: 123456,
          firstname: '_user_firstname_',
          lastname: '_user_lastname_',
        },
        info: '_info_',
        custom_properties: {
          _prop_key_: '_prop_value_',
        },
        identifier: '_identifier_',
        intern: false,
        billing_tax: 19.0,
        customer_vat: {
          tax: 19.0,
          reverse_charge: false,
          intra_eu: false,
          active: true,
          print_gross_total: false,
          notice_tax_exemption: '_notice_tax_exemption_',
          notice_tax_exemption_alt: '_notice_tax_exemption_alt_',
        },
        supplier_vat: {
          tax: 19.0,
          reverse_charge: false,
          intra_eu: false,
          active: true,
        },
        currency: '_currency_',
        custom_rates: false,
        include_time_report: false,
        billing_notes: '_billing_notes_',
        default_discount: 0.0,
        default_cash_discount: 0.0,
        default_cash_discount_days: 0,
        country_code: '_country_code_',
        vat_identifier: '_vat_identifier_',
        alternative_correspondence_language: true,
        default_invoice_due_days: 20,
        footer: '_footer_',
        projects: [],
        created_at: '_created_at_',
        updated_at: '_updated_at_',
        debit_number: 10000,
      },
    ];

    const jsonArray = companies.map((json) => ({ json }));
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
      .mockReturnValue('company');

    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('list');

    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(false);

    executeFunctions.getNodeParameter.calledWith('limit', 0).mockReturnValue(0);

    executeFunctions.getNodeParameter.calledWith('ids', 0).mockReturnValue('');

    executeFunctions.getNodeParameter
      .calledWith('updatedAfter', 0)
      .mockReturnValue('');

    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequestAllItems.mockResolvedValue(companies);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      0,
      'GET',
      '/companies',
      {
        qs: { limit: undefined, ids: undefined, updated_after: undefined },
      },
    );
  });

  it.each<{ type: CompanyParameters['type']; withCustomProperties: boolean }>([
    { type: 'customer', withCustomProperties: true },
    { type: 'customer', withCustomProperties: false },
    { type: 'supplier', withCustomProperties: true },
    { type: 'supplier', withCustomProperties: false },
    { type: 'organization', withCustomProperties: true },
    { type: 'organization', withCustomProperties: false },
  ])(
    'should update a company with type $type and custom properties: $withCustomProperties',
    ({ type, withCustomProperties }) => {
      const body: CommonCompanyParameters = {
        name: '_name_',
        type,
        country_code: '_country_code_',
        vat_identifier: '_vat_identifier_',
        alternative_correspondence_language: true,
        website: '_website_',
        fax: '_fax_',
        phone: '_phone_',
        email: '_email_',
        billing_email_cc: '_billing_email_cc_',
        address: '_address_',
        info: '_info_',
        tags: ['_tag1_', '_tag2_'],
        footer: '_footer_',
      };

      if (type === 'customer') {
        Object.assign<CommonCompanyParameters, CustomerCompanyParameters>(
          body,
          {
            type,
            currency: '_currency_',
            identifier: '_identifier_',
            customer_tax: 19.0,
            default_invoice_due_days: 20,
            debit_number: 10000,
          },
        );
      }

      if (type === 'supplier') {
        Object.assign<CommonCompanyParameters, SupplierCompanyParameters>(
          body,
          {
            type,
            iban: '_iban_',
            supplier_tax: 19.0,
            credit_number: 70000,
          },
        );
      }

      if (withCustomProperties) {
        Object.assign(body, {
          custom_properties: {
            _prop_key_: '_prop_value_',
          },
        });
      }

      const company: Company = {
        id: 1234567,
        type: type as 'customer' | 'supplier' | 'organization',
        name: '_name_',
        website: '_website_',
        email: '_email_',
        billing_email_cc: '_billing_email_cc_',
        phone: '_phone_',
        fax: '_fax_',
        address: '_address_',
        tags: ['_tag1_', '_tag2_'],
        user: {
          id: 123456,
          firstname: '_user_firstname_',
          lastname: '_user_lastname_',
        },
        info: '_info_',
        custom_properties: {
          _prop_key_: '_prop_value_',
        },
        identifier: '_identifier_',
        intern: false,
        billing_tax: 19.0,
        customer_vat: {
          tax: 19.0,
          reverse_charge: false,
          intra_eu: false,
          active: true,
          print_gross_total: false,
          notice_tax_exemption: '_notice_tax_exemption_',
          notice_tax_exemption_alt: '_notice_tax_exemption_alt_',
        },
        supplier_vat: {
          tax: 19.0,
          reverse_charge: false,
          intra_eu: false,
          active: true,
        },
        currency: '_currency_',
        custom_rates: false,
        include_time_report: false,
        billing_notes: '_billing_notes_',
        default_discount: 0.0,
        default_cash_discount: 0.0,
        default_cash_discount_days: 0,
        country_code: '_country_code_',
        vat_identifier: '_vat_identifier_',
        alternative_correspondence_language: true,
        default_invoice_due_days: 20,
        footer: '_footer_',
        projects: [],
        created_at: '_created_at_',
        updated_at: '_updated_at_',
        debit_number: 10000,
      };

      const jsonArray = [{ json: company }];
      const executionData = jsonArray.map(({ json }) => ({
        json,
        pairedItem: { item: 0 },
      }));

      executeFunctions.getInputData.mockReturnValue([
        {
          json: {},
        },
      ]);

      const additionalFields = [
        'countryCode',
        'vatIdentifier',
        'alternativeCorrespondenceLanguage',
        'website',
        'fax',
        'phone',
        'email',
        'billingEmailCc',
        'address',
        'info',
        'customProperties',
        'tags',
        'footer',
      ];

      const additionalFieldsParameters: {
        [key in keyof CompanyParameters]?: string | number | boolean | object;
      } = {
        country_code: '_country_code_',
        vat_identifier: '_vat_identifier_',
        alternative_correspondence_language: true,
        website: '_website_',
        fax: '_fax_',
        phone: '_phone_',
        email: '_email_',
        billing_email_cc: '_billing_email_cc_',
        address: '_address_',
        info: '_info_',
        tags: ['_tag1_', '_tag2_'],
        footer: '_footer_',
      };

      if (withCustomProperties) {
        additionalFieldsParameters['custom_properties'] = {
          values: [
            {
              key: '_prop_key_',
              value: '_prop_value_',
            },
          ],
        };
      }

      if (type === 'customer') {
        additionalFields.push(
          'customerTax',
          'defaultInvoiceDueDays',
          'debitNumber',
        );

        Object.assign(additionalFieldsParameters, {
          customer_tax: 19.0,
          default_invoice_due_days: 20,
          debit_number: 10000,
        });
      }

      if (type === 'supplier') {
        additionalFields.push('iban', 'supplierTax', 'creditNumber');

        Object.assign(additionalFieldsParameters, {
          iban: '_iban_',
          supplier_tax: 19.0,
          credit_number: 70000,
        });
      }

      jest
        .mocked(createParametersFromNodeParameter)
        .mockReturnValueOnce(additionalFieldsParameters);

      executeFunctions.getNodeParameter
        .calledWith('resource', 0)
        .mockReturnValue('company');

      executeFunctions.getNodeParameter
        .calledWith('operation', 0)
        .mockReturnValue('update');

      executeFunctions.getNodeParameter
        .calledWith('name', 0)
        .mockReturnValue('_name_');

      executeFunctions.getNodeParameter
        .calledWith('type', 0)
        .mockReturnValue(type);

      if (type === 'customer') {
        executeFunctions.getNodeParameter
          .calledWith('currency', 0)
          .mockReturnValue('_currency_');

        executeFunctions.getNodeParameter
          .calledWith('identifier', 0)
          .mockReturnValue('_identifier_');
      }

      executeFunctions.getNodeParameter
        .calledWith('companyId', 0)
        .mockReturnValue(1234567);

      mockedMocoApiRequest.mockResolvedValue({
        body: company,
        statusCode: 200,
      });

      executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

      executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
        executionData,
      );

      expect(moco.execute.call(executeFunctions)).resolves.toEqual([
        executionData,
      ]);

      expect(mockedMocoApiRequest).toHaveBeenCalledWith(
        0,
        'PUT',
        '/companies/1234567',
        {
          body,
        },
      );

      expect(createParametersFromNodeParameter).toHaveBeenCalledTimes(1);
      expect(createParametersFromNodeParameter).toHaveBeenCalledWith(
        'additionalFields',
        0,
        additionalFields,
      );
    },
  );

  it('should create a project', () => {
    const body: ProjectParameters = {
      name: 'Relaunch Website',
      currency: 'EUR',
      start_date: '2018-01-01',
      finish_date: '2018-12-31',
      fixed_price: false,
      retainer: false,
      leader_id: 123456,
      customer_id: 234567,
      identifier: 'P-123',
    };
    const project: Partial<Project> = {
      id: 1234567,
      name: body.name,
      currency: body.currency,
      start_date: body.start_date,
      finish_date: body.finish_date,
      fixed_price: body.fixed_price,
      retainer: body.retainer,
      leader: {
        id: body.leader_id,
        firstname: 'Michael',
        lastname: 'Mustermann',
      },
      customer: {
        id: body.customer_id,
        name: 'Beispiel AG',
      },
      identifier: body.identifier,
    };
    const jsonArray = [{ json: project }];
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
      .mockReturnValue('project');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('create');
    executeFunctions.getNodeParameter
      .calledWith('name', 0)
      .mockReturnValue(body.name);
    executeFunctions.getNodeParameter
      .calledWith('currency', 0)
      .mockReturnValue(body.currency);
    executeFunctions.getNodeParameter
      .calledWith('startDate', 0)
      .mockReturnValue(body.start_date);
    executeFunctions.getNodeParameter
      .calledWith('finishDate', 0)
      .mockReturnValue(body.finish_date);
    executeFunctions.getNodeParameter
      .calledWith('fixedPrice', 0)
      .mockReturnValue(body.fixed_price);
    executeFunctions.getNodeParameter
      .calledWith('retainer', 0)
      .mockReturnValue(body.retainer);
    executeFunctions.getNodeParameter
      .calledWith('leaderId', 0)
      .mockReturnValue(body.leader_id);
    executeFunctions.getNodeParameter
      .calledWith('customerId', 0)
      .mockReturnValue(body.customer_id);
    executeFunctions.getNodeParameter
      .calledWith('budgetMonthly', 0)
      .mockReturnValue(body.budget_monthly);
    executeFunctions.getNodeParameter
      .calledWith('identifier', 0)
      .mockReturnValue(body.identifier);
    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequest.mockResolvedValue({ body: project, statusCode: 200 });

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(0, 'POST', '/projects', {
      body,
    });
  });

  it('should delete a project', () => {
    const projectId = 1234567;
    const executionData = [
      {
        json: {},
        pairedItem: { item: 0 },
      },
    ];

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('project');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('delete');
    executeFunctions.getNodeParameter
      .calledWith('projectId', 0)
      .mockReturnValue(projectId);

    executeFunctions.helpers.returnJsonArray.mockReturnValue([]);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'DELETE',
      `/projects/${projectId}`,
    );
  });

  it('should get a project', () => {
    const projectId = 1234567;
    const project: Partial<Project> = {
      id: projectId,
      name: 'Relaunch Website',
      currency: 'EUR',
      start_date: '2018-01-01',
      finish_date: '2018-12-31',
      fixed_price: false,
      retainer: false,
      leader: {
        id: 123456,
        firstname: 'Michael',
        lastname: 'Mustermann',
      },
      customer: {
        id: 234567,
        name: 'Beispiel AG',
      },
      identifier: 'P-123',
    };
    const jsonArray = [{ json: project }];
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
      .mockReturnValue('project');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('projectId', 0)
      .mockReturnValue(projectId);

    mockedMocoApiRequest.mockResolvedValue({ body: project, statusCode: 200 });

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'GET',
      `/projects/${projectId}`,
    );
  });

  it('should list all projects', () => {
    const projects: Partial<Project>[] = [
      {
        id: 1234567,
        name: 'Relaunch Website',
        currency: 'EUR',
        start_date: '2018-01-01',
        finish_date: '2018-12-31',
        fixed_price: false,
        retainer: false,
        leader: {
          id: 123456,
          firstname: 'Michael',
          lastname: 'Mustermann',
        },
        customer: {
          id: 234567,
          name: 'Beispiel AG',
        },
        identifier: 'P-123',
      },
      {
        id: 7654321,
        name: 'New Website',
        currency: 'EUR',
        start_date: '2019-01-01',
        finish_date: '2019-12-31',
        fixed_price: false,
        retainer: false,
        leader: {
          id: 123456,
          firstname: 'Michael',
          lastname: 'Mustermann',
        },
        customer: {
          id: 234567,
          name: 'Beispiel AG',
        },
        identifier: 'P-456',
      },
    ];
    const jsonArray = projects.map((json) => ({ json }));
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
      .mockReturnValue('project');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('list');
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(true);
    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequestAllItems.mockResolvedValue(projects);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      0,
      'GET',
      '/projects',
      {
        qs: {},
      },
    );
  });

  it('should list some projects', () => {
    const projects: Partial<Project>[] = [
      {
        id: 1234567,
        name: 'Relaunch Website',
        currency: 'EUR',
        start_date: '2018-01-01',
        finish_date: '2018-12-31',
        fixed_price: false,
        retainer: false,
        leader: {
          id: 123456,
          firstname: 'Michael',
          lastname: 'Mustermann',
        },
        customer: {
          id: 234567,
          name: 'Beispiel AG',
        },
        identifier: 'P-123',
      },
      {
        id: 7654321,
        name: 'New Website',
        currency: 'EUR',
        start_date: '2019-01-01',
        finish_date: '2019-12-31',
        fixed_price: false,
        retainer: false,
        leader: {
          id: 123456,
          firstname: 'Michael',
          lastname: 'Mustermann',
        },
        customer: {
          id: 234567,
          name: 'Beispiel AG',
        },
        identifier: 'P-456',
      },
    ];
    const jsonArray = projects.map((json) => ({ json }));
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
      .mockReturnValue('project');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('list');
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(false);
    executeFunctions.getNodeParameter.calledWith('limit', 0).mockReturnValue(0);
    executeFunctions.getNodeParameter.calledWith('ids', 0).mockReturnValue('');
    executeFunctions.getNodeParameter
      .calledWith('updatedAfter', 0)
      .mockReturnValue('');
    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequestAllItems.mockResolvedValue(projects);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      0,
      'GET',
      '/projects',
      {
        qs: { limit: undefined, ids: undefined, updated_after: undefined },
      },
    );
  });

  it('should update a project', () => {
    const projectId = 933590158;
    const body: ProjectParameters = {
      name: 'Relaunch Website',
      currency: 'EUR',
      start_date: '2018-01-01',
      finish_date: '2018-12-31',
      fixed_price: false,
      retainer: false,
      leader_id: 123456,
      customer_id: 234567,
      identifier: 'P-123',
    };
    const project: Partial<Project> = {
      id: projectId,
      name: body.name,
      currency: body.currency,
      start_date: body.start_date,
      finish_date: body.finish_date,
      fixed_price: body.fixed_price,
      retainer: body.retainer,
      leader: {
        id: body.leader_id,
        firstname: 'Michael',
        lastname: 'Mustermann',
      },
      customer: {
        id: body.customer_id,
        name: 'Beispiel AG',
      },
      identifier: body.identifier,
    };
    const jsonArray = [{ json: project }];
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
      .mockReturnValue('project');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('update');
    executeFunctions.getNodeParameter
      .calledWith('projectId', 0)
      .mockReturnValue(projectId);
    executeFunctions.getNodeParameter
      .calledWith('name', 0)
      .mockReturnValue(body.name);
    executeFunctions.getNodeParameter
      .calledWith('currency', 0)
      .mockReturnValue(body.currency);
    executeFunctions.getNodeParameter
      .calledWith('startDate', 0)
      .mockReturnValue(body.start_date);
    executeFunctions.getNodeParameter
      .calledWith('finishDate', 0)
      .mockReturnValue(body.finish_date);
    executeFunctions.getNodeParameter
      .calledWith('fixedPrice', 0)
      .mockReturnValue(body.fixed_price);
    executeFunctions.getNodeParameter
      .calledWith('retainer', 0)
      .mockReturnValue(body.retainer);
    executeFunctions.getNodeParameter
      .calledWith('leaderId', 0)
      .mockReturnValue(body.leader_id);
    executeFunctions.getNodeParameter
      .calledWith('customerId', 0)
      .mockReturnValue(body.customer_id);
    executeFunctions.getNodeParameter
      .calledWith('budgetMonthly', 0)
      .mockReturnValue(body.budget_monthly);
    executeFunctions.getNodeParameter
      .calledWith('identifier', 0)
      .mockReturnValue(body.identifier);
    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequest.mockResolvedValue({ body: project, statusCode: 200 });

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'PUT',
      `/projects/${projectId}`,
      {
        body,
      },
    );
  });

  it('should create a user', () => {
    const body: UserParameters = {
      firstname: 'Tobias',
      lastname: 'Miesel',
      email: 'tobias@domain.com',
      password: '123456',
      unit_id: 909147861,
    };
    const user: Partial<User> = {
      id: 933590158,
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      unit: {
        id: body.unit_id,
        name: 'C Office',
      },
    };
    const jsonArray = [{ json: user }];
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
      .mockReturnValue('user');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('create');
    executeFunctions.getNodeParameter
      .calledWith('firstname', 0)
      .mockReturnValue(body.firstname);
    executeFunctions.getNodeParameter
      .calledWith('lastname', 0)
      .mockReturnValue(body.lastname);
    executeFunctions.getNodeParameter
      .calledWith('email', 0)
      .mockReturnValue(body.email);
    executeFunctions.getNodeParameter
      .calledWith('password', 0)
      .mockReturnValue(body.password);
    executeFunctions.getNodeParameter
      .calledWith('unitId', 0)
      .mockReturnValue(body.unit_id);
    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequest.mockResolvedValue({ body: user, statusCode: 200 });

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(0, 'POST', '/users', {
      body,
    });
  });

  it('should delete a user', () => {
    const userId = 933590158;
    const executionData = [
      {
        json: {},
        pairedItem: { item: 0 },
      },
    ];

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('user');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('delete');
    executeFunctions.getNodeParameter
      .calledWith('userId', 0)
      .mockReturnValue(userId);

    executeFunctions.helpers.returnJsonArray.mockReturnValue([]);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'DELETE',
      `/users/${userId}`,
    );
  });

  it('should get a user', () => {
    const userId = 933590158;
    const user: Partial<User> = {
      id: userId,
      firstname: 'Tobias',
      lastname: 'Miesel',
      email: 'tobias@domain.com',
      unit: {
        id: 909147861,
        name: 'C Office',
      },
    };
    const jsonArray = [{ json: user }];
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
      .mockReturnValue('user');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('userId', 0)
      .mockReturnValue(userId);

    mockedMocoApiRequest.mockResolvedValue({ body: user, statusCode: 200 });

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'GET',
      `/users/${userId}`,
    );
  });

  it('should list all users', () => {
    const users: Partial<User>[] = [
      {
        id: 933590158,
        firstname: 'Tobias',
        lastname: 'Miesel',
        email: 'tobias@domain.com',
        unit: {
          id: 909147861,
          name: 'C Office',
        },
      },
      {
        id: 933589599,
        firstname: 'Sabine',
        lastname: 'Schäuble',
        email: 'sabine@domain.com',
        unit: {
          id: 909147861,
          name: 'C Office',
        },
      },
    ];
    const jsonArray = users.map((json) => ({ json }));
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
      .mockReturnValue('user');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('list');
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(true);
    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequestAllItems.mockResolvedValue(users);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      0,
      'GET',
      '/users',
      {
        qs: {},
      },
    );
  });

  it('should list some users', () => {
    const users: Partial<User>[] = [
      {
        id: 933590158,
        firstname: 'Tobias',
        lastname: 'Miesel',
        email: 'tobias@domain.com',
        unit: {
          id: 909147861,
          name: 'C Office',
        },
      },
      {
        id: 933589599,
        firstname: 'Sabine',
        lastname: 'Schäuble',
        email: 'sabine@domain.com',
        unit: {
          id: 909147861,
          name: 'C Office',
        },
      },
    ];
    const jsonArray = users.map((json) => ({ json }));
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
      .mockReturnValue('user');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('list');
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(false);
    executeFunctions.getNodeParameter.calledWith('limit', 0).mockReturnValue(0);
    executeFunctions.getNodeParameter.calledWith('ids', 0).mockReturnValue('');
    executeFunctions.getNodeParameter
      .calledWith('updatedAfter', 0)
      .mockReturnValue('');
    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequestAllItems.mockResolvedValue(users);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequestAllItems).toHaveBeenCalledWith(
      0,
      'GET',
      '/users',
      {
        qs: { limit: undefined, ids: undefined, updated_after: undefined },
      },
    );
  });

  it('should update a user', () => {
    const userId = 933590158;
    const body: UserParameters = {
      firstname: 'Tobias',
      lastname: 'Miesel',
      email: 'tobias@domain.com',
      password: '123456',
      unit_id: 909147861,
    };
    const user: Partial<User> = {
      id: userId,
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      unit: {
        id: body.unit_id,
        name: 'C Office',
      },
    };
    const jsonArray = [{ json: user }];
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
      .mockReturnValue('user');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('update');
    executeFunctions.getNodeParameter
      .calledWith('userId', 0)
      .mockReturnValue(userId);
    executeFunctions.getNodeParameter
      .calledWith('firstname', 0)
      .mockReturnValue(body.firstname);
    executeFunctions.getNodeParameter
      .calledWith('lastname', 0)
      .mockReturnValue(body.lastname);
    executeFunctions.getNodeParameter
      .calledWith('email', 0)
      .mockReturnValue(body.email);
    executeFunctions.getNodeParameter
      .calledWith('password', 0)
      .mockReturnValue(body.password);
    executeFunctions.getNodeParameter
      .calledWith('unitId', 0)
      .mockReturnValue(body.unit_id);
    executeFunctions.getNodeParameter
      .calledWith('additionalFields', 0)
      .mockReturnValue({});

    mockedMocoApiRequest.mockResolvedValue({ body: user, statusCode: 200 });

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'PUT',
      `/users/${userId}`,
      {
        body,
      },
    );
  });

  it('should return an error', async () => {
    const userId = 933590158;
    const error = new Error('__error_message__');

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('user');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('userId', 0)
      .mockReturnValue(userId);

    mockedMocoApiRequest.mockRejectedValue(error);

    executeFunctions.continueOnFail.mockReturnValue(true);

    expect(moco.execute.call(executeFunctions)).resolves.toEqual([
      [{ json: { error: '__error_message__' }, pairedItem: { item: 0 } }],
    ]);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'GET',
      `/users/${userId}`,
    );
  });

  it('should throw an error', async () => {
    const userId = 933590158;
    const error = new Error('__error_message__');

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('user');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('userId', 0)
      .mockReturnValue(userId);

    mockedMocoApiRequest.mockRejectedValue(error);

    executeFunctions.continueOnFail.mockReturnValue(false);

    expect(moco.execute.call(executeFunctions)).rejects.toEqual(error);

    expect(mockedMocoApiRequest).toHaveBeenCalledWith(
      0,
      'GET',
      `/users/${userId}`,
    );
  });
});
