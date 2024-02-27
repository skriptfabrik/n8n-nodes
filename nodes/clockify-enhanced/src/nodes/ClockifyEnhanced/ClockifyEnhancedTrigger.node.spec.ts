import { type Request } from 'express';
import { mock, mockClear, mockDeep } from 'jest-mock-extended';
import { clockifyApiRequest } from 'n8n-nodes-base/dist/nodes/Clockify/GenericFunctions';
import {
  type IHookFunctions,
  type ILoadOptionsFunctions,
  type IWebhookFunctions,
} from 'n8n-workflow';
import { ClockifyEnhancedTrigger } from './ClockifyEnhancedTrigger.node';

jest.mock('n8n-nodes-base/dist/nodes/Clockify/GenericFunctions');

describe('ClockifyEnhancedTrigger', () => {
  const hookFunctions = mockDeep<IHookFunctions>();
  const loadOptionsFunctions = mockDeep<ILoadOptionsFunctions>();
  const webhookFunctions = mockDeep<IWebhookFunctions>();

  let trigger: ClockifyEnhancedTrigger;

  beforeEach(() => {
    trigger = new ClockifyEnhancedTrigger();
  });

  afterEach(() => {
    mockClear(hookFunctions);
    mockClear(loadOptionsFunctions);
    mockClear(webhookFunctions);
  });

  it('should be defined', () => {
    expect(trigger).toBeDefined();
  });

  it('should load workspaces', () => {
    jest.mocked(clockifyApiRequest).mockResolvedValue([
      {
        costRate: {
          amount: 10500,
          currency: 'USD',
        },
        currencies: [
          {
            code: 'USD',
            id: '5b641568b07987035750505e',
            isDefault: true,
          },
        ],
        featureSubscriptionType: 'PREMIUM',
        features: ['ADD_TIME_FOR_OTHERS', 'ADMIN_PANEL', 'ALERTS', 'APPROVAL'],
        hourlyRate: {
          amount: 10500,
          currency: 'USD',
        },
        id: '64a687e29ae1f428e7ebe303',
        imageUrl: 'https://www.url.com/imageurl-1234567890.jpg',
        memberships: [
          {
            costRate: {
              amount: 10500,
              currency: 'USD',
            },
            hourlyRate: {
              amount: 10500,
              currency: 'USD',
            },
            membershipStatus: 'PENDING',
            membershipType: 'PROJECT',
            targetId: '64c777ddd3fcab07cfbb210c',
            userId: '5a0ab5acb07987125438b60f',
          },
        ],
        name: 'Cool Company',
        workspaceSettings: {
          adminOnlyPages: '["PROJECT","TEAM","REPORTS"]',
          automaticLock: {
            changeDay: 'FRIDAY',
            dayOfMonth: 15,
            firstDay: 'MONDAY',
            olderThanPeriod: 'DAYS',
            olderThanValue: 5,
            type: 'WEEKLY',
          },
          canSeeTimeSheet: true,
          canSeeTracker: true,
          currencyFormat: 'CURRENCY_SPACE_VALUE',
          defaultBillableProjects: true,
          forceDescription: true,
          forceProjects: true,
          forceTags: true,
          forceTasks: true,
          isProjectPublicByDefault: true,
          lockTimeEntries: 'string',
          lockTimeZone: 'string',
          multiFactorEnabled: true,
          numberFormat: 'COMMA_PERIOD',
          onlyAdminsCreateProject: true,
          onlyAdminsCreateTag: true,
          onlyAdminsCreateTask: true,
          onlyAdminsSeeAllTimeEntries: true,
          onlyAdminsSeeBillableRates: true,
          onlyAdminsSeeDashboard: true,
          onlyAdminsSeePublicProjectsEntries: true,
          projectFavorites: true,
          projectGroupingLabel: 'Project Label',
          projectPickerSpecialFilter: true,
          round: {
            minutes: 'string',
            round: 'string',
          },
          timeRoundingInReports: true,
          timeTrackingMode: 'DEFAULT',
          trackTimeDownToSecond: true,
        },
      },
    ]);

    expect(
      trigger.methods.loadOptions.listWorkspaces.call(loadOptionsFunctions),
    ).resolves.toEqual([
      {
        name: 'Cool Company',
        value: '64a687e29ae1f428e7ebe303',
      },
    ]);

    expect(jest.mocked(clockifyApiRequest)).toHaveBeenCalledWith(
      'GET',
      'workspaces',
    );
  });

  it('should not load workspaces because of undefined name', () => {
    jest.mocked(clockifyApiRequest).mockResolvedValue([
      {
        costRate: {
          amount: 10500,
          currency: 'USD',
        },
        currencies: [
          {
            code: 'USD',
            id: '5b641568b07987035750505e',
            isDefault: true,
          },
        ],
        featureSubscriptionType: 'PREMIUM',
        features: ['ADD_TIME_FOR_OTHERS', 'ADMIN_PANEL', 'ALERTS', 'APPROVAL'],
        hourlyRate: {
          amount: 10500,
          currency: 'USD',
        },
        id: '64a687e29ae1f428e7ebe303',
        imageUrl: 'https://www.url.com/imageurl-1234567890.jpg',
        memberships: [
          {
            costRate: {
              amount: 10500,
              currency: 'USD',
            },
            hourlyRate: {
              amount: 10500,
              currency: 'USD',
            },
            membershipStatus: 'PENDING',
            membershipType: 'PROJECT',
            targetId: '64c777ddd3fcab07cfbb210c',
            userId: '5a0ab5acb07987125438b60f',
          },
        ],
        name: undefined,
        workspaceSettings: {
          adminOnlyPages: '["PROJECT","TEAM","REPORTS"]',
          automaticLock: {
            changeDay: 'FRIDAY',
            dayOfMonth: 15,
            firstDay: 'MONDAY',
            olderThanPeriod: 'DAYS',
            olderThanValue: 5,
            type: 'WEEKLY',
          },
          canSeeTimeSheet: true,
          canSeeTracker: true,
          currencyFormat: 'CURRENCY_SPACE_VALUE',
          defaultBillableProjects: true,
          forceDescription: true,
          forceProjects: true,
          forceTags: true,
          forceTasks: true,
          isProjectPublicByDefault: true,
          lockTimeEntries: 'string',
          lockTimeZone: 'string',
          multiFactorEnabled: true,
          numberFormat: 'COMMA_PERIOD',
          onlyAdminsCreateProject: true,
          onlyAdminsCreateTag: true,
          onlyAdminsCreateTask: true,
          onlyAdminsSeeAllTimeEntries: true,
          onlyAdminsSeeBillableRates: true,
          onlyAdminsSeeDashboard: true,
          onlyAdminsSeePublicProjectsEntries: true,
          projectFavorites: true,
          projectGroupingLabel: 'Project Label',
          projectPickerSpecialFilter: true,
          round: {
            minutes: 'string',
            round: 'string',
          },
          timeRoundingInReports: true,
          timeTrackingMode: 'DEFAULT',
          trackTimeDownToSecond: true,
        },
      },
    ]);

    expect(
      trigger.methods.loadOptions.listWorkspaces.call(loadOptionsFunctions),
    ).resolves.toEqual([]);

    expect(jest.mocked(clockifyApiRequest)).toHaveBeenCalledWith(
      'GET',
      'workspaces',
    );
  });

  it('should not load workspaces because of undefined id', () => {
    jest.mocked(clockifyApiRequest).mockResolvedValue([
      {
        costRate: {
          amount: 10500,
          currency: 'USD',
        },
        currencies: [
          {
            code: 'USD',
            id: '5b641568b07987035750505e',
            isDefault: true,
          },
        ],
        featureSubscriptionType: 'PREMIUM',
        features: ['ADD_TIME_FOR_OTHERS', 'ADMIN_PANEL', 'ALERTS', 'APPROVAL'],
        hourlyRate: {
          amount: 10500,
          currency: 'USD',
        },
        id: undefined,
        imageUrl: 'https://www.url.com/imageurl-1234567890.jpg',
        memberships: [
          {
            costRate: {
              amount: 10500,
              currency: 'USD',
            },
            hourlyRate: {
              amount: 10500,
              currency: 'USD',
            },
            membershipStatus: 'PENDING',
            membershipType: 'PROJECT',
            targetId: '64c777ddd3fcab07cfbb210c',
            userId: '5a0ab5acb07987125438b60f',
          },
        ],
        name: 'Cool Company',
        workspaceSettings: {
          adminOnlyPages: '["PROJECT","TEAM","REPORTS"]',
          automaticLock: {
            changeDay: 'FRIDAY',
            dayOfMonth: 15,
            firstDay: 'MONDAY',
            olderThanPeriod: 'DAYS',
            olderThanValue: 5,
            type: 'WEEKLY',
          },
          canSeeTimeSheet: true,
          canSeeTracker: true,
          currencyFormat: 'CURRENCY_SPACE_VALUE',
          defaultBillableProjects: true,
          forceDescription: true,
          forceProjects: true,
          forceTags: true,
          forceTasks: true,
          isProjectPublicByDefault: true,
          lockTimeEntries: 'string',
          lockTimeZone: 'string',
          multiFactorEnabled: true,
          numberFormat: 'COMMA_PERIOD',
          onlyAdminsCreateProject: true,
          onlyAdminsCreateTag: true,
          onlyAdminsCreateTask: true,
          onlyAdminsSeeAllTimeEntries: true,
          onlyAdminsSeeBillableRates: true,
          onlyAdminsSeeDashboard: true,
          onlyAdminsSeePublicProjectsEntries: true,
          projectFavorites: true,
          projectGroupingLabel: 'Project Label',
          projectPickerSpecialFilter: true,
          round: {
            minutes: 'string',
            round: 'string',
          },
          timeRoundingInReports: true,
          timeTrackingMode: 'DEFAULT',
          trackTimeDownToSecond: true,
        },
      },
    ]);

    expect(
      trigger.methods.loadOptions.listWorkspaces.call(loadOptionsFunctions),
    ).resolves.toEqual([]);

    expect(jest.mocked(clockifyApiRequest)).toHaveBeenCalledWith(
      'GET',
      'workspaces',
    );
  });

  it('should check that a webhook exists', async () => {
    const workspaceId = '64a687e29ae1f428e7ebe303';
    const webhookAuthToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2NGI3YmU3YmUwODM1Yjc2ZDYzOTY5YTciLCJtdWx0aUZhY3RvciI6dHJ1ZSwiaXNzIjoiY2xvY2tpZnkiLCJuYW1lIjoiTWFydGluIExsb3lkIiwiZXhwIjoxNjkzMzY5MzEwLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjkzMzI2MTEwLCJqdGkiOiJZVGcxT0Raak9XTXRPRGRsWVMwME5qZ3hMVGxpTlRndE5UQmlOVEprTmpOaE';
    const webhookId = '76a687e29ae1f428e7ebe101';
    const webhookUrl =
      'http://localhost:5678/webhook/c940f948-0c2e-4cba-9d47-1b38790d77bb';
    const staticData: { webhookAuthToken?: string; webhookId?: string } = {
      webhookAuthToken: undefined,
      webhookId: undefined,
    };

    hookFunctions.getNodeParameter
      .calledWith('workspaceId')
      .mockReturnValue(workspaceId);
    jest.mocked(clockifyApiRequest).mockResolvedValue({
      webhooks: [
        {
          authToken: webhookAuthToken,
          enabled: true,
          id: webhookId,
          name: 'stripe',
          triggerSource: [
            '54a687e29ae1f428e7ebe909',
            '87p187e29ae1f428e7ebej56',
          ],
          triggerSourceType: 'PROJECT_ID',
          url: 'http://localhost:5678/webhook/c940f948-0c2e-4cba-9d47-1b38790d77bb',
          userId: '5a0ab5acb07987125438b60f',
          webhookEvent: 'NEW_PROJECT',
          workspaceId: '64a687e29ae1f428e7ebe303',
        },
      ],
      workspaceWebhookCount: 5,
    });
    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(webhookUrl);
    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    expect(
      trigger.webhookMethods.default.checkExists.call(hookFunctions),
    ).resolves.toBe(true);

    expect(jest.mocked(clockifyApiRequest)).toHaveBeenCalledWith(
      'GET',
      `workspaces/${workspaceId}/webhooks`,
    );

    await new Promise(process.nextTick);

    expect(staticData.webhookAuthToken).toBe(webhookAuthToken);
    expect(staticData.webhookId).toBe(webhookId);
  });

  it('should check that a webhook does not exist because of invalid response', async () => {
    const workspaceId = '64a687e29ae1f428e7ebe303';
    const staticData: { webhookAuthToken?: string; webhookId?: string } = {
      webhookAuthToken: undefined,
      webhookId: undefined,
    };

    hookFunctions.getNodeParameter
      .calledWith('workspaceId')
      .mockReturnValue(workspaceId);
    jest.mocked(clockifyApiRequest).mockResolvedValue({
      webhooks: undefined,
    });

    expect(
      trigger.webhookMethods.default.checkExists.call(hookFunctions),
    ).resolves.toBe(false);

    expect(jest.mocked(clockifyApiRequest)).toHaveBeenCalledWith(
      'GET',
      `workspaces/${workspaceId}/webhooks`,
    );

    await new Promise(process.nextTick);

    expect(staticData.webhookAuthToken).toBeUndefined();
    expect(staticData.webhookId).toBeUndefined();
  });

  it('should check that a webhook does not exist', async () => {
    const workspaceId = '64a687e29ae1f428e7ebe303';
    const webhookAuthToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2NGI3YmU3YmUwODM1Yjc2ZDYzOTY5YTciLCJtdWx0aUZhY3RvciI6dHJ1ZSwiaXNzIjoiY2xvY2tpZnkiLCJuYW1lIjoiTWFydGluIExsb3lkIiwiZXhwIjoxNjkzMzY5MzEwLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjkzMzI2MTEwLCJqdGkiOiJZVGcxT0Raak9XTXRPRGRsWVMwME5qZ3hMVGxpTlRndE5UQmlOVEprTmpOaE';
    const webhookId = '76a687e29ae1f428e7ebe101';
    const webhookUrl =
      'http://localhost:5678/webhook/985dc3e9-b382-4dd0-922e-0ceee97023e9';
    const staticData: { webhookAuthToken?: string; webhookId?: string } = {
      webhookAuthToken: undefined,
      webhookId: undefined,
    };

    hookFunctions.getNodeParameter
      .calledWith('workspaceId')
      .mockReturnValue(workspaceId);
    jest.mocked(clockifyApiRequest).mockResolvedValue({
      webhooks: [
        {
          authToken: webhookAuthToken,
          enabled: true,
          id: webhookId,
          name: 'stripe',
          triggerSource: [
            '54a687e29ae1f428e7ebe909',
            '87p187e29ae1f428e7ebej56',
          ],
          triggerSourceType: 'PROJECT_ID',
          url: 'http://localhost:5678/webhook/c940f948-0c2e-4cba-9d47-1b38790d77bb',
          userId: '5a0ab5acb07987125438b60f',
          webhookEvent: 'NEW_PROJECT',
          workspaceId: '64a687e29ae1f428e7ebe303',
        },
      ],
      workspaceWebhookCount: 5,
    });
    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(webhookUrl);
    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    expect(
      trigger.webhookMethods.default.checkExists.call(hookFunctions),
    ).resolves.toBe(false);

    expect(jest.mocked(clockifyApiRequest)).toHaveBeenCalledWith(
      'GET',
      `workspaces/${workspaceId}/webhooks`,
    );

    await new Promise(process.nextTick);

    expect(staticData.webhookAuthToken).toBeUndefined();
    expect(staticData.webhookId).toBeUndefined();
  });

  it('should create webhook', async () => {
    const workspaceId = '64a687e29ae1f428e7ebe303';
    const name = 'stripe';
    const webhookUrl =
      'http://localhost:5678/webhook/985dc3e9-b382-4dd0-922e-0ceee97023e9';
    const webhookEvent = 'NEW_PROJECT';
    const webhookAuthToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2NGI3YmU3YmUwODM1Yjc2ZDYzOTY5YTciLCJtdWx0aUZhY3RvciI6dHJ1ZSwiaXNzIjoiY2xvY2tpZnkiLCJuYW1lIjoiTWFydGluIExsb3lkIiwiZXhwIjoxNjkzMzY5MzEwLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjkzMzI2MTEwLCJqdGkiOiJZVGcxT0Raak9XTXRPRGRsWVMwME5qZ3hMVGxpTlRndE5UQmlOVEprTmpOaE';
    const webhookId = '76a687e29ae1f428e7ebe101';
    const staticData: { webhookAuthToken?: string; webhookId?: string } = {
      webhookAuthToken: undefined,
      webhookId: undefined,
    };

    hookFunctions.getNodeParameter
      .calledWith('workspaceId')
      .mockReturnValue(workspaceId);
    hookFunctions.getNodeParameter.calledWith('name').mockReturnValue(name);
    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(webhookUrl);
    hookFunctions.getNodeParameter
      .calledWith('webhookEvent')
      .mockReturnValue(webhookEvent);
    jest.mocked(clockifyApiRequest).mockResolvedValue({
      authToken: webhookAuthToken,
      enabled: true,
      id: webhookId,
      name: 'stripe',
      triggerSource: ['54a687e29ae1f428e7ebe909', '87p187e29ae1f428e7ebej56'],
      triggerSourceType: 'PROJECT_ID',
      url: 'http://localhost:5678/webhook/c940f948-0c2e-4cba-9d47-1b38790d77bb',
      userId: '5a0ab5acb07987125438b60f',
      webhookEvent: 'NEW_PROJECT',
      workspaceId: '64a687e29ae1f428e7ebe303',
    });
    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    expect(
      trigger.webhookMethods.default.create.call(hookFunctions),
    ).resolves.toBe(true);

    expect(jest.mocked(clockifyApiRequest)).toHaveBeenCalledWith(
      'POST',
      `workspaces/${workspaceId}/webhooks`,
      {
        name,
        triggerSource: [],
        triggerSourceType: 'WORKSPACE_ID',
        url: webhookUrl,
        webhookEvent,
      },
    );

    await new Promise(process.nextTick);

    expect(staticData.webhookAuthToken).toBe(webhookAuthToken);
    expect(staticData.webhookId).toBe(webhookId);
  });

  it('should not create webhook because of undefined auth token', async () => {
    const workspaceId = '64a687e29ae1f428e7ebe303';
    const name = 'stripe';
    const webhookUrl =
      'http://localhost:5678/webhook/985dc3e9-b382-4dd0-922e-0ceee97023e9';
    const webhookEvent = 'NEW_PROJECT';
    const webhookAuthToken = undefined;
    const webhookId = '76a687e29ae1f428e7ebe101';
    const staticData: { webhookAuthToken?: string; webhookId?: string } = {
      webhookAuthToken: undefined,
      webhookId: undefined,
    };

    hookFunctions.getNodeParameter
      .calledWith('workspaceId')
      .mockReturnValue(workspaceId);
    hookFunctions.getNodeParameter.calledWith('name').mockReturnValue(name);
    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(webhookUrl);
    hookFunctions.getNodeParameter
      .calledWith('webhookEvent')
      .mockReturnValue(webhookEvent);
    jest.mocked(clockifyApiRequest).mockResolvedValue({
      authToken: webhookAuthToken,
      enabled: true,
      id: webhookId,
      name: 'stripe',
      triggerSource: ['54a687e29ae1f428e7ebe909', '87p187e29ae1f428e7ebej56'],
      triggerSourceType: 'PROJECT_ID',
      url: 'http://localhost:5678/webhook/c940f948-0c2e-4cba-9d47-1b38790d77bb',
      userId: '5a0ab5acb07987125438b60f',
      webhookEvent: 'NEW_PROJECT',
      workspaceId: '64a687e29ae1f428e7ebe303',
    });
    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    expect(
      trigger.webhookMethods.default.create.call(hookFunctions),
    ).resolves.toBe(false);

    expect(jest.mocked(clockifyApiRequest)).toHaveBeenCalledWith(
      'POST',
      `workspaces/${workspaceId}/webhooks`,
      {
        name,
        triggerSource: [],
        triggerSourceType: 'WORKSPACE_ID',
        url: webhookUrl,
        webhookEvent,
      },
    );

    await new Promise(process.nextTick);

    expect(staticData.webhookAuthToken).toBeUndefined();
    expect(staticData.webhookId).toBeUndefined();
  });

  it('should not create webhook because of undefined id', async () => {
    const workspaceId = '64a687e29ae1f428e7ebe303';
    const name = 'stripe';
    const webhookUrl =
      'http://localhost:5678/webhook/985dc3e9-b382-4dd0-922e-0ceee97023e9';
    const webhookEvent = 'NEW_PROJECT';
    const webhookAuthToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2NGI3YmU3YmUwODM1Yjc2ZDYzOTY5YTciLCJtdWx0aUZhY3RvciI6dHJ1ZSwiaXNzIjoiY2xvY2tpZnkiLCJuYW1lIjoiTWFydGluIExsb3lkIiwiZXhwIjoxNjkzMzY5MzEwLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjkzMzI2MTEwLCJqdGkiOiJZVGcxT0Raak9XTXRPRGRsWVMwME5qZ3hMVGxpTlRndE5UQmlOVEprTmpOaE';
    const webhookId = undefined;
    const staticData: { webhookAuthToken?: string; webhookId?: string } = {
      webhookAuthToken: undefined,
      webhookId: undefined,
    };

    hookFunctions.getNodeParameter
      .calledWith('workspaceId')
      .mockReturnValue(workspaceId);
    hookFunctions.getNodeParameter.calledWith('name').mockReturnValue(name);
    hookFunctions.getNodeWebhookUrl
      .calledWith('default')
      .mockReturnValue(webhookUrl);
    hookFunctions.getNodeParameter
      .calledWith('webhookEvent')
      .mockReturnValue(webhookEvent);
    jest.mocked(clockifyApiRequest).mockResolvedValue({
      authToken: webhookAuthToken,
      enabled: true,
      id: webhookId,
      name: 'stripe',
      triggerSource: ['54a687e29ae1f428e7ebe909', '87p187e29ae1f428e7ebej56'],
      triggerSourceType: 'PROJECT_ID',
      url: 'http://localhost:5678/webhook/c940f948-0c2e-4cba-9d47-1b38790d77bb',
      userId: '5a0ab5acb07987125438b60f',
      webhookEvent: 'NEW_PROJECT',
      workspaceId: '64a687e29ae1f428e7ebe303',
    });
    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    expect(
      trigger.webhookMethods.default.create.call(hookFunctions),
    ).resolves.toBe(false);

    expect(jest.mocked(clockifyApiRequest)).toHaveBeenCalledWith(
      'POST',
      `workspaces/${workspaceId}/webhooks`,
      {
        name,
        triggerSource: [],
        triggerSourceType: 'WORKSPACE_ID',
        url: webhookUrl,
        webhookEvent,
      },
    );

    await new Promise(process.nextTick);

    expect(staticData.webhookAuthToken).toBeUndefined();
    expect(staticData.webhookId).toBeUndefined();
  });

  it('should delete webhook', async () => {
    const workspaceId = '64a687e29ae1f428e7ebe303';
    const webhookAuthToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2NGI3YmU3YmUwODM1Yjc2ZDYzOTY5YTciLCJtdWx0aUZhY3RvciI6dHJ1ZSwiaXNzIjoiY2xvY2tpZnkiLCJuYW1lIjoiTWFydGluIExsb3lkIiwiZXhwIjoxNjkzMzY5MzEwLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjkzMzI2MTEwLCJqdGkiOiJZVGcxT0Raak9XTXRPRGRsWVMwME5qZ3hMVGxpTlRndE5UQmlOVEprTmpOaE';
    const webhookId = '76a687e29ae1f428e7ebe101';
    const staticData: { webhookAuthToken?: string; webhookId?: string } = {
      webhookAuthToken,
      webhookId,
    };

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);
    hookFunctions.getNodeParameter
      .calledWith('workspaceId')
      .mockReturnValue(workspaceId);
    jest.mocked(clockifyApiRequest).mockResolvedValue({});

    expect(
      trigger.webhookMethods.default.delete.call(hookFunctions),
    ).resolves.toBe(true);

    expect(jest.mocked(clockifyApiRequest)).toHaveBeenCalledWith(
      'DELETE',
      `workspaces/${workspaceId}/webhooks/${webhookId}`,
    );

    await new Promise(process.nextTick);

    expect(staticData.webhookAuthToken).toBeUndefined();
    expect(staticData.webhookId).toBeUndefined();
  });

  it('should not delete webhook because of undefined id', async () => {
    const webhookAuthToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2NGI3YmU3YmUwODM1Yjc2ZDYzOTY5YTciLCJtdWx0aUZhY3RvciI6dHJ1ZSwiaXNzIjoiY2xvY2tpZnkiLCJuYW1lIjoiTWFydGluIExsb3lkIiwiZXhwIjoxNjkzMzY5MzEwLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjkzMzI2MTEwLCJqdGkiOiJZVGcxT0Raak9XTXRPRGRsWVMwME5qZ3hMVGxpTlRndE5UQmlOVEprTmpOaE';
    const staticData: { webhookAuthToken?: string; webhookId?: string } = {
      webhookAuthToken,
      webhookId: undefined,
    };

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);

    expect(
      trigger.webhookMethods.default.delete.call(hookFunctions),
    ).resolves.toBe(true);

    await new Promise(process.nextTick);

    expect(staticData.webhookAuthToken).toBe(webhookAuthToken);
    expect(staticData.webhookId).toBeUndefined();
  });

  it('should not delete webhook because of api exception', async () => {
    const workspaceId = '64a687e29ae1f428e7ebe303';
    const webhookAuthToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2NGI3YmU3YmUwODM1Yjc2ZDYzOTY5YTciLCJtdWx0aUZhY3RvciI6dHJ1ZSwiaXNzIjoiY2xvY2tpZnkiLCJuYW1lIjoiTWFydGluIExsb3lkIiwiZXhwIjoxNjkzMzY5MzEwLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjkzMzI2MTEwLCJqdGkiOiJZVGcxT0Raak9XTXRPRGRsWVMwME5qZ3hMVGxpTlRndE5UQmlOVEprTmpOaE';
    const webhookId = '76a687e29ae1f428e7ebe101';
    const staticData: { webhookAuthToken?: string; webhookId?: string } = {
      webhookAuthToken,
      webhookId,
    };

    hookFunctions.getWorkflowStaticData
      .calledWith('node')
      .mockReturnValue(staticData);
    hookFunctions.getNodeParameter
      .calledWith('workspaceId')
      .mockReturnValue(workspaceId);
    jest.mocked(clockifyApiRequest).mockRejectedValue(new Error());

    expect(
      trigger.webhookMethods.default.delete.call(hookFunctions),
    ).resolves.toBe(false);

    expect(jest.mocked(clockifyApiRequest)).toHaveBeenCalledWith(
      'DELETE',
      `workspaces/${workspaceId}/webhooks/${webhookId}`,
    );

    await new Promise(process.nextTick);

    expect(staticData.webhookAuthToken).toBe(webhookAuthToken);
    expect(staticData.webhookId).toBe(webhookId);
  });

  it('should provide workflow data', () => {
    const body = {
      id: '_id_',
      description: '_description_',
      userId: '_user_id_',
      billable: false,
      projectId: '_project_id_',
      timeInterval: {
        start: '2024-02-15T00:00:00Z',
        end: '2024-02-15T00:30:00Z',
        duration: 'PT30M',
      },
      workspaceId: '_workspace_id_',
      isLocked: false,
      hourlyRate: null,
      costRate: null,
      customFieldValues: [],
      type: 'REGULAR',
      kioskId: null,
      projectCurrency: null,
      currentlyRunning: false,
      project: {
        name: '_project_name_',
        clientId: '_client_id_',
        workspaceId: '_workspace_id_',
        billable: false,
        estimate: {
          estimate: 'PT0S',
          type: 'AUTO',
        },
        color: '#000000',
        archived: false,
        clientName: '_client_name_',
        duration: 'PT10H30M',
        note: null,
        budgetEstimate: null,
        timeEstimate: {
          estimate: 0,
          type: 'AUTO',
          resetOption: null,
        },
        activeEstimate: 'NONE',
        id: '_project_id_',
        public: true,
        template: false,
      },
      task: {
        name: '_task_name_',
        projectId: '_project_id_',
        assigneeId: '',
        assigneeIds: [],
        estimate: 'PT0S',
        status: 'ACTIVE',
        workspaceId: '_workspace_id_',
        duration: 'PT10H30M30S',
        budgetEstimate: 0,
        billable: false,
        hourlyRate: null,
        costRate: null,
        id: '_task_id_',
      },
      user: {
        id: '_user_id_',
        name: '_user_name_',
        status: 'ACTIVE',
      },
      tags: [],
    };

    webhookFunctions.getHeaderData.mockReturnValue({
      'clockify-signature': '_signature_',
      'clockify-webhook-event-type': '_event_type_',
    });

    webhookFunctions.getWorkflowStaticData.calledWith('node').mockReturnValue({
      webhookAuthToken: '_signature_',
    });

    webhookFunctions.getNodeParameter
      .calledWith('webhookEvent')
      .mockReturnValueOnce('_event_type_');

    webhookFunctions.getRequestObject.mockReturnValue(mock<Request>({ body }));

    webhookFunctions.helpers.returnJsonArray.mockReturnValue([{ json: body }]);

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({
      workflowData: [[{ json: body }]],
    });
  });

  it('should not provide workflow data because of missing signature header', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'clockify-webhook-event-type': '_event_type_',
    });

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({});
  });

  it('should not provide workflow data because of missing webhook event type header', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'clockify-signature': '_signature_',
    });

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({});
  });

  it('should not provide workflow data because of signature missmatch', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'clockify-signature': '_signature_',
      'clockify-webhook-event-type': '_event_type_',
    });

    webhookFunctions.getWorkflowStaticData.calledWith('node').mockReturnValue({
      webhookAuthToken: '_other_signature_',
    });

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({});
  });

  it('should not provide workflow data because of webhook event type missmatch', () => {
    webhookFunctions.getHeaderData.mockReturnValue({
      'clockify-signature': '_signature_',
      'clockify-webhook-event-type': '_event_type_',
    });

    webhookFunctions.getWorkflowStaticData.calledWith('node').mockReturnValue({
      webhookAuthToken: '_signature_',
    });

    webhookFunctions.getNodeParameter
      .calledWith('webhookEvent')
      .mockReturnValueOnce('_other_event_type_');

    expect(trigger.webhook.call(webhookFunctions)).resolves.toEqual({});
  });
});
