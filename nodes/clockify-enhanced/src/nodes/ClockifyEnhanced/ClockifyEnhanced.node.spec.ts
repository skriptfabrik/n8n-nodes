import { mockClear, mockDeep } from 'jest-mock-extended';
import { type IExecuteFunctions } from 'n8n-workflow';
import { ClockifyEnhanced } from './ClockifyEnhanced.node';
import { clockifyApiRequest } from 'n8n-nodes-base/dist/nodes/Clockify/GenericFunctions';
import { error } from 'console';

jest.mock('n8n-nodes-base/dist/nodes/Clockify/GenericFunctions');

describe('ClockifyEnhanced', () => {
  const executeFunctions = mockDeep<IExecuteFunctions>();

  let clockifyEnhanced: ClockifyEnhanced;

  beforeEach(() => {
    clockifyEnhanced = new ClockifyEnhanced();
  });

  afterEach(() => {
    mockClear(executeFunctions);
  });

  it('should be defined', () => {
    expect(clockifyEnhanced).toBeDefined();
  });

  it('should update project', () => {
    const project = {
      archived: true,
      billable: true,
      budgetEstimate: {
        active: true,
        estimate: 600000,
        includeExpenses: true,
        resetOption: 'WEEKLY',
        type: 'AUTO',
      },
      clientId: '9t641568b07987035750704',
      clientName: 'Client X',
      color: '#000000',
      costRate: {
        amount: 10500,
        currency: 'USD',
      },
      duration: '60000',
      estimate: {
        estimate: 'PT1H30M',
        type: 'AUTO',
      },
      estimateReset: {
        dayOfMonth: 0,
        dayOfWeek: 'MONDAY',
        hour: 0,
        interval: 'WEEKLY',
        month: 'JANUARY',
      },
      hourlyRate: {
        amount: 10500,
        currency: 'USD',
      },
      id: '5b641568b07987035750505e',
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
      name: 'Software Development',
      note: 'This is a sample note for the project.',
      public: true,
      template: true,
      timeEstimate: {
        active: true,
        estimate: '60000',
        includeNonBillable: true,
        resetOption: 'WEEKLY',
        type: 'AUTO',
      },
      workspaceId: '64a687e29ae1f428e7ebe303',
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
      .calledWith('workspaceId', 0)
      .mockReturnValue('64a687e29ae1f428e7ebe303');

    executeFunctions.getNodeParameter
      .calledWith('projectId', 0)
      .mockReturnValue('5b641568b07987035750505e');

    executeFunctions.getNodeParameter
      .calledWith('updateFields', 0)
      .mockReturnValue({
        archived: false,
      });

    jest.mocked(clockifyApiRequest).mockResolvedValue(project);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(clockifyEnhanced.execute.call(executeFunctions)).resolves.toEqual([
      executionData,
    ]);

    expect(clockifyApiRequest).toHaveBeenCalledWith(
      'PUT',
      '/workspaces/64a687e29ae1f428e7ebe303/projects/5b641568b07987035750505e',
      {
        archived: false,
      },
    );
  });

  it('should return on error', () => {
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
      .calledWith('workspaceId', 0)
      .mockReturnValue('64a687e29ae1f428e7ebe303');

    executeFunctions.getNodeParameter
      .calledWith('projectId', 0)
      .mockReturnValue('5b641568b07987035750505e');

    executeFunctions.getNodeParameter
      .calledWith('updateFields', 0)
      .mockReturnValue({
        archived: false,
      });

    jest
      .mocked(clockifyApiRequest)
      .mockRejectedValue(new Error('__error_message__'));

    executeFunctions.continueOnFail.mockReturnValue(true);

    expect(clockifyEnhanced.execute.call(executeFunctions)).resolves.toEqual([
      [{ json: { error: '__error_message__' }, pairedItem: { item: 0 } }],
    ]);

    expect(clockifyApiRequest).toHaveBeenCalledWith(
      'PUT',
      '/workspaces/64a687e29ae1f428e7ebe303/projects/5b641568b07987035750505e',
      {
        archived: false,
      },
    );
  });

  it('should throw on error', () => {
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
      .calledWith('workspaceId', 0)
      .mockReturnValue('64a687e29ae1f428e7ebe303');

    executeFunctions.getNodeParameter
      .calledWith('projectId', 0)
      .mockReturnValue('5b641568b07987035750505e');

    executeFunctions.getNodeParameter
      .calledWith('updateFields', 0)
      .mockReturnValue({
        archived: false,
      });

    const error = new Error('__error_message__');

    jest.mocked(clockifyApiRequest).mockRejectedValue(error);

    executeFunctions.continueOnFail.mockReturnValue(false);

    expect(clockifyEnhanced.execute.call(executeFunctions)).rejects.toEqual(
      error,
    );

    expect(clockifyApiRequest).toHaveBeenCalledWith(
      'PUT',
      '/workspaces/64a687e29ae1f428e7ebe303/projects/5b641568b07987035750505e',
      {
        archived: false,
      },
    );
  });
});
