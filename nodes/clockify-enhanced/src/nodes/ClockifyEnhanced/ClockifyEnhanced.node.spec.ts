import { mockClear, mockDeep } from 'jest-mock-extended';

import { ILoadOptionsFunctions, type IExecuteFunctions } from 'n8n-workflow';

import {
  clockifyApiRequest,
  clockifyApiRequestAllItems,
} from 'n8n-nodes-base/dist/nodes/Clockify/GenericFunctions';

import { ClockifyEnhanced } from './ClockifyEnhanced.node';

import { components } from '../../api';

type Project = components['schemas']['ProjectDtoImplV1'];
type User = components['schemas']['UserDtoV1'];
type Workspace = components['schemas']['WorkspaceDtoV1'];

jest.mock('n8n-nodes-base/dist/nodes/Clockify/GenericFunctions');

describe('ClockifyEnhanced', () => {
  const project: Project = {
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

  const loadOptionsFunctions = mockDeep<ILoadOptionsFunctions>();
  const executeFunctions = mockDeep<IExecuteFunctions>();

  let clockifyEnhanced: ClockifyEnhanced;

  beforeEach(() => {
    clockifyEnhanced = new ClockifyEnhanced();
  });

  afterEach(() => {
    mockClear(clockifyApiRequest);
    mockClear(clockifyApiRequestAllItems);
    mockClear(loadOptionsFunctions);
    mockClear(executeFunctions);
  });

  it('should be defined', () => {
    expect(clockifyEnhanced).toBeDefined();
  });

  describe('load options methods', () => {
    describe('load workspaces', () => {
      it('should return on empty result', () => {
        jest.mocked(clockifyApiRequest).mockResolvedValue(undefined);

        expect(
          clockifyEnhanced.methods.loadOptions.loadWorkspaces.call(
            loadOptionsFunctions,
          ),
        ).resolves.toStrictEqual([]);

        expect(clockifyApiRequest).toHaveBeenCalledTimes(1);
        expect(clockifyApiRequest).toHaveBeenCalledWith('GET', 'workspaces');
      });

      it('should return mapped workspaces', () => {
        const workspaces: Workspace[] = [
          {
            id: '64a687e29ae1f428e7ebe303',
            name: 'Workspace X',
          },
          {
            id: '64a687e29ae1f428e7ebe304',
            name: 'Workspace Y',
          },
        ];

        jest.mocked(clockifyApiRequest).mockResolvedValue(workspaces);

        expect(
          clockifyEnhanced.methods.loadOptions.loadWorkspaces.call(
            loadOptionsFunctions,
          ),
        ).resolves.toStrictEqual([
          { name: 'Workspace X', value: '64a687e29ae1f428e7ebe303' },
          { name: 'Workspace Y', value: '64a687e29ae1f428e7ebe304' },
        ]);

        expect(clockifyApiRequest).toHaveBeenCalledTimes(1);
        expect(clockifyApiRequest).toHaveBeenCalledWith('GET', 'workspaces');
      });
    });
    describe('load projects', () => {
      it('should return on missing workspace id', () => {
        loadOptionsFunctions.getCurrentNodeParameter
          .calledWith('workspaceId')
          .mockReturnValue('');

        jest.mocked(clockifyApiRequestAllItems).mockResolvedValue([]);

        expect(
          clockifyEnhanced.methods.loadOptions.loadProjects.call(
            loadOptionsFunctions,
          ),
        ).resolves.toStrictEqual([]);

        expect(clockifyApiRequestAllItems).not.toHaveBeenCalled();
      });

      it('should return on empty result', () => {
        loadOptionsFunctions.getCurrentNodeParameter
          .calledWith('workspaceId')
          .mockReturnValue('_workspace_id_');

        jest.mocked(clockifyApiRequestAllItems).mockResolvedValue(undefined);

        expect(
          clockifyEnhanced.methods.loadOptions.loadProjects.call(
            loadOptionsFunctions,
          ),
        ).resolves.toStrictEqual([]);

        expect(clockifyApiRequestAllItems).toHaveBeenCalledTimes(1);
        expect(clockifyApiRequestAllItems).toHaveBeenCalledWith(
          'GET',
          `workspaces/_workspace_id_/projects`,
        );
      });

      it('should return mapped projects', () => {
        const projects: Project[] = [
          {
            id: '64a687e29ae1f428e7ebe303',
            name: 'Project X',
          },
          {
            id: '64a687e29ae1f428e7ebe304',
            name: 'Project Y',
          },
        ];

        loadOptionsFunctions.getCurrentNodeParameter
          .calledWith('workspaceId')
          .mockReturnValue('_workspace_id_');

        jest.mocked(clockifyApiRequestAllItems).mockResolvedValue(projects);

        expect(
          clockifyEnhanced.methods.loadOptions.loadProjects.call(
            loadOptionsFunctions,
          ),
        ).resolves.toStrictEqual([
          { name: 'Project X', value: '64a687e29ae1f428e7ebe303' },
          { name: 'Project Y', value: '64a687e29ae1f428e7ebe304' },
        ]);

        expect(clockifyApiRequestAllItems).toHaveBeenCalledTimes(1);
        expect(clockifyApiRequestAllItems).toHaveBeenCalledWith(
          'GET',
          `workspaces/_workspace_id_/projects`,
        );
      });
    });

    describe('load users', () => {
      it('should return on missing workspace id', () => {
        loadOptionsFunctions.getCurrentNodeParameter
          .calledWith('workspaceId')
          .mockReturnValue('');

        jest.mocked(clockifyApiRequestAllItems).mockResolvedValue([]);

        expect(
          clockifyEnhanced.methods.loadOptions.loadUsers.call(
            loadOptionsFunctions,
          ),
        ).resolves.toStrictEqual([]);

        expect(clockifyApiRequestAllItems).not.toHaveBeenCalled();
      });

      it('should return on empty result', () => {
        loadOptionsFunctions.getCurrentNodeParameter
          .calledWith('workspaceId')
          .mockReturnValue('_workspace_id_');

        jest.mocked(clockifyApiRequestAllItems).mockResolvedValue(undefined);

        expect(
          clockifyEnhanced.methods.loadOptions.loadUsers.call(
            loadOptionsFunctions,
          ),
        ).resolves.toStrictEqual([]);

        expect(clockifyApiRequestAllItems).toHaveBeenCalledTimes(1);
        expect(clockifyApiRequestAllItems).toHaveBeenCalledWith(
          'GET',
          `workspaces/_workspace_id_/users`,
        );
      });

      it('should return mapped users', () => {
        const projects: User[] = [
          {
            id: '64a687e29ae1f428e7ebe303',
            name: 'User X',
          },
          {
            id: '64a687e29ae1f428e7ebe304',
            name: 'User Y',
          },
        ];

        loadOptionsFunctions.getCurrentNodeParameter
          .calledWith('workspaceId')
          .mockReturnValue('_workspace_id_');

        jest.mocked(clockifyApiRequestAllItems).mockResolvedValue(projects);

        expect(
          clockifyEnhanced.methods.loadOptions.loadUsers.call(
            loadOptionsFunctions,
          ),
        ).resolves.toStrictEqual([
          { name: 'User X', value: '64a687e29ae1f428e7ebe303' },
          { name: 'User Y', value: '64a687e29ae1f428e7ebe304' },
        ]);

        expect(clockifyApiRequestAllItems).toHaveBeenCalledTimes(1);
        expect(clockifyApiRequestAllItems).toHaveBeenCalledWith(
          'GET',
          `workspaces/_workspace_id_/users`,
        );
      });
    });

    describe('load non project users', () => {
      it.each([
        { missingParameter: 'workspaceId', workspaceId: '', projectId: '' },
        {
          missingParameter: 'projectId',
          workspaceId: '_workspace_id_',
          projectId: '',
        },
        {
          missingParameter: 'workspaceId & projectId',
          workspaceId: '',
          projectId: '_project_id_',
        },
      ])(
        'should return empty result on missing node parameter: $missingParameter',
        ({ workspaceId, projectId }) => {
          loadOptionsFunctions.getCurrentNodeParameter
            .calledWith('workspaceId')
            .mockReturnValue(workspaceId);

          loadOptionsFunctions.getCurrentNodeParameter
            .calledWith('projectId')
            .mockReturnValue(projectId);

          jest.mocked(clockifyApiRequestAllItems).mockResolvedValue([]);

          expect(
            clockifyEnhanced.methods.loadOptions.loadNonProjectUsers.call(
              loadOptionsFunctions,
            ),
          ).resolves.toStrictEqual([]);

          expect(clockifyApiRequestAllItems).not.toHaveBeenCalled();
        },
      );

      it('should return on empty result', () => {
        loadOptionsFunctions.getCurrentNodeParameter
          .calledWith('workspaceId')
          .mockReturnValue('_workspace_id_');

        loadOptionsFunctions.getCurrentNodeParameter
          .calledWith('projectId')
          .mockReturnValue('_project_id_');

        jest.mocked(clockifyApiRequestAllItems).mockResolvedValue(undefined);

        expect(
          clockifyEnhanced.methods.loadOptions.loadNonProjectUsers.call(
            loadOptionsFunctions,
          ),
        ).resolves.toStrictEqual([]);

        expect(clockifyApiRequestAllItems).toHaveBeenCalledTimes(1);
        expect(clockifyApiRequestAllItems).toHaveBeenCalledWith(
          'GET',
          `workspaces/_workspace_id_/users`,
          undefined,
          {
            memberships: 'PROJECT',
          },
        );
      });

      it('should return mapped non project users', () => {
        const users: User[] = [
          {
            id: '64a687e29ae1f428e7ebe303',
            name: 'User X',
            memberships: [
              {
                targetId: '64c777ddd3fcab07cfbb210c',
                membershipType: 'PROJECT',
              },
            ],
          },
          {
            id: '64a687e29ae1f428e7ebe304',
            name: 'User Y',
            memberships: [
              {
                targetId: '_project_id_',
                membershipType: 'PROJECT',
              },
            ],
          },
        ];

        loadOptionsFunctions.getCurrentNodeParameter
          .calledWith('workspaceId')
          .mockReturnValue('_workspace_id_');

        loadOptionsFunctions.getCurrentNodeParameter
          .calledWith('projectId')
          .mockReturnValue('_project_id_');

        jest.mocked(clockifyApiRequestAllItems).mockResolvedValue(users);

        expect(
          clockifyEnhanced.methods.loadOptions.loadNonProjectUsers.call(
            loadOptionsFunctions,
          ),
        ).resolves.toStrictEqual([
          { name: 'User X', value: '64a687e29ae1f428e7ebe303' },
        ]);

        expect(clockifyApiRequestAllItems).toHaveBeenCalledTimes(1);
        expect(clockifyApiRequestAllItems).toHaveBeenCalledWith(
          'GET',
          `workspaces/_workspace_id_/users`,
          undefined,
          {
            memberships: 'PROJECT',
          },
        );
      });
    });

    describe('load project users', () => {
      it.each([
        { missingParameter: 'workspaceId', workspaceId: '', projectId: '' },
        {
          missingParameter: 'projectId',
          workspaceId: '_workspace_id_',
          projectId: '',
        },
        {
          missingParameter: 'workspaceId & projectId',
          workspaceId: '',
          projectId: '_project_id_',
        },
      ])(
        'should return empty result on missing node parameter: $missingParameter',
        ({ workspaceId, projectId }) => {
          loadOptionsFunctions.getCurrentNodeParameter
            .calledWith('workspaceId')
            .mockReturnValue(workspaceId);

          loadOptionsFunctions.getCurrentNodeParameter
            .calledWith('projectId')
            .mockReturnValue(projectId);

          jest.mocked(clockifyApiRequestAllItems).mockResolvedValue([]);

          expect(
            clockifyEnhanced.methods.loadOptions.loadProjectUsers.call(
              loadOptionsFunctions,
            ),
          ).resolves.toStrictEqual([]);

          expect(clockifyApiRequestAllItems).not.toHaveBeenCalled();
        },
      );

      it('should return on empty result', () => {
        loadOptionsFunctions.getCurrentNodeParameter
          .calledWith('workspaceId')
          .mockReturnValue('_workspace_id_');

        loadOptionsFunctions.getCurrentNodeParameter
          .calledWith('projectId')
          .mockReturnValue('_project_id_');

        jest.mocked(clockifyApiRequestAllItems).mockResolvedValue(undefined);

        expect(
          clockifyEnhanced.methods.loadOptions.loadProjectUsers.call(
            loadOptionsFunctions,
          ),
        ).resolves.toStrictEqual([]);

        expect(clockifyApiRequestAllItems).toHaveBeenCalledTimes(1);
        expect(clockifyApiRequestAllItems).toHaveBeenCalledWith(
          'GET',
          `workspaces/_workspace_id_/users`,
          undefined,
          {
            projectId: '_project_id_',
          },
        );
      });

      it('should return mapped project users', () => {
        const projects: User[] = [
          {
            id: '64a687e29ae1f428e7ebe303',
            name: 'User X',
          },
        ];

        loadOptionsFunctions.getCurrentNodeParameter
          .calledWith('workspaceId')
          .mockReturnValue('_workspace_id_');

        loadOptionsFunctions.getCurrentNodeParameter
          .calledWith('projectId')
          .mockReturnValue('_project_id_');

        jest.mocked(clockifyApiRequestAllItems).mockResolvedValue(projects);

        expect(
          clockifyEnhanced.methods.loadOptions.loadProjectUsers.call(
            loadOptionsFunctions,
          ),
        ).resolves.toStrictEqual([
          { name: 'User X', value: '64a687e29ae1f428e7ebe303' },
        ]);

        expect(clockifyApiRequestAllItems).toHaveBeenCalledTimes(1);
        expect(clockifyApiRequestAllItems).toHaveBeenCalledWith(
          'GET',
          `workspaces/_workspace_id_/users`,
          undefined,
          { projectId: '_project_id_' },
        );
      });
    });
  });

  describe('node execution', () => {
    it('should update project', () => {
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

    it('should patch project membership', () => {
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
        .mockReturnValue('project membership');

      executeFunctions.getNodeParameter
        .calledWith('operation', 0)
        .mockReturnValue('patch');

      executeFunctions.getNodeParameter
        .calledWith('workspaceId', 0)
        .mockReturnValue('64a687e29ae1f428e7ebe303');

      executeFunctions.getNodeParameter
        .calledWith('projectId', 0)
        .mockReturnValue('5b641568b07987035750505e');

      executeFunctions.getNodeParameter
        .calledWith('memberships', 0)
        .mockReturnValue(['5a0ab5acb07987125438b60f']);

      jest.mocked(clockifyApiRequest).mockResolvedValue(project);

      executeFunctions.helpers.returnJsonArray
        .calledWith(expect.objectContaining(project))
        .mockReturnValue(jsonArray);

      executeFunctions.helpers.constructExecutionMetaData
        .calledWith(
          expect.arrayContaining(jsonArray),
          expect.objectContaining({ itemData: { item: 0 } }),
        )
        .mockReturnValue(executionData);

      expect(clockifyEnhanced.execute.call(executeFunctions)).resolves.toEqual([
        executionData,
      ]);

      expect(clockifyApiRequest).toHaveBeenCalledWith(
        'PATCH',
        '/workspaces/64a687e29ae1f428e7ebe303/projects/5b641568b07987035750505e/memberships',
        {
          memberships: [{ userId: '5a0ab5acb07987125438b60f' }],
        },
      );
    });

    it('should assign users to project', () => {
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
        .mockReturnValue('project membership');

      executeFunctions.getNodeParameter
        .calledWith('operation', 0)
        .mockReturnValue('assign');

      executeFunctions.getNodeParameter
        .calledWith('workspaceId', 0)
        .mockReturnValue('64a687e29ae1f428e7ebe303');

      executeFunctions.getNodeParameter
        .calledWith('projectId', 0)
        .mockReturnValue('5b641568b07987035750505e');

      executeFunctions.getNodeParameter
        .calledWith('userIdsToAssign', 0)
        .mockReturnValue(['5a0ab5acb07987125438b60f']);

      jest.mocked(clockifyApiRequest).mockResolvedValue(project);

      executeFunctions.helpers.returnJsonArray
        .calledWith(expect.objectContaining(project))
        .mockReturnValue(jsonArray);

      executeFunctions.helpers.constructExecutionMetaData
        .calledWith(
          expect.arrayContaining(jsonArray),
          expect.objectContaining({ itemData: { item: 0 } }),
        )
        .mockReturnValue(executionData);

      expect(clockifyEnhanced.execute.call(executeFunctions)).resolves.toEqual([
        executionData,
      ]);

      expect(clockifyApiRequest).toHaveBeenCalledWith(
        'POST',
        '/workspaces/64a687e29ae1f428e7ebe303/projects/5b641568b07987035750505e/memberships',
        {
          remove: false,
          userIds: ['5a0ab5acb07987125438b60f'],
        },
      );
    });

    it('should remove users to project', () => {
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
        .mockReturnValue('project membership');

      executeFunctions.getNodeParameter
        .calledWith('operation', 0)
        .mockReturnValue('remove');

      executeFunctions.getNodeParameter
        .calledWith('workspaceId', 0)
        .mockReturnValue('64a687e29ae1f428e7ebe303');

      executeFunctions.getNodeParameter
        .calledWith('projectId', 0)
        .mockReturnValue('5b641568b07987035750505e');

      executeFunctions.getNodeParameter
        .calledWith('userIdsToRemove', 0)
        .mockReturnValue(['5a0ab5acb07987125438b60f']);

      jest.mocked(clockifyApiRequest).mockResolvedValue(project);

      executeFunctions.helpers.returnJsonArray
        .calledWith(expect.objectContaining(project))
        .mockReturnValue(jsonArray);

      executeFunctions.helpers.constructExecutionMetaData
        .calledWith(
          expect.arrayContaining(jsonArray),
          expect.objectContaining({ itemData: { item: 0 } }),
        )
        .mockReturnValue(executionData);

      expect(clockifyEnhanced.execute.call(executeFunctions)).resolves.toEqual([
        executionData,
      ]);

      expect(clockifyApiRequest).toHaveBeenCalledWith(
        'POST',
        '/workspaces/64a687e29ae1f428e7ebe303/projects/5b641568b07987035750505e/memberships',
        {
          remove: true,
          userIds: ['5a0ab5acb07987125438b60f'],
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
});
