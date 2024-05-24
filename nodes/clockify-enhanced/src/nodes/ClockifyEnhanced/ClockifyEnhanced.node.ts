import {
  type IDataObject,
  type IExecuteFunctions,
  type ILoadOptionsFunctions,
  type INodeExecutionData,
  type INodePropertyOptions,
  type INodeType,
  type INodeTypeDescription,
  type NodeApiError,
} from 'n8n-workflow';

import {
  clockifyApiRequest,
  clockifyApiRequestAllItems,
} from 'n8n-nodes-base/dist/nodes/Clockify/GenericFunctions';

import { components } from '../../api';

type Client = components['schemas']['ClientDtoV1'] &
  Required<Pick<components['schemas']['ClientDtoV1'], 'id' | 'name'>>;

type Project = components['schemas']['ProjectDtoV1'] &
  Required<Pick<components['schemas']['ProjectDtoV1'], 'id' | 'name'>>;

type User = components['schemas']['UserDtoV1'] &
  Required<
    Pick<components['schemas']['UserDtoV1'], 'id' | 'name' | 'memberships'>
  >;

type Workspace = components['schemas']['WorkspaceDtoV1'] &
  Required<Pick<components['schemas']['WorkspaceDtoV1'], 'id' | 'name'>>;

import {
  projectFields,
  projectOperations,
} from './descriptions/ProjectDescription';

import {
  projectMembershipFields,
  projectMembershipOperations,
} from './descriptions/ProjectMembershipsDescription';

export class ClockifyEnhanced implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Clockify Enhanced',

    name: 'clockifyEnhanced',

    icon: 'file:icons/clockify-enhanced.svg',

    group: ['transform'],

    version: 1,

    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',

    description: 'Consume Clockify REST API',

    defaults: {
      name: 'Clockify Enhanced',
    },

    inputs: ['main'],

    outputs: ['main'],

    credentials: [
      {
        name: 'clockifyApi',
        required: true,
      },
    ],

    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Project',
            value: 'project',
          },
          {
            name: 'Project Membership',
            value: 'project membership',
          },
        ],
        default: 'project',
      },
      ...projectOperations,
      ...projectMembershipOperations,
      {
        displayName: 'Workspace Name or ID',
        name: 'workspaceId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'loadWorkspaces',
        },
        default: '',
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
        required: true,
        requiresDataPath: 'single',
        validateType: 'string',
      },
      ...projectFields,
      ...projectMembershipFields,
    ],
  };

  methods = {
    loadOptions: {
      async loadWorkspaces(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const workspaces: Workspace[] = await clockifyApiRequest.call(
          this,
          'GET',
          'workspaces',
        );

        if (!workspaces) {
          return [];
        }

        return workspaces.map((value) => ({
          name: value.name,
          value: value.id,
        }));
      },

      async loadClients(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const workspaceId = this.getCurrentNodeParameter('workspaceId');
        if (!workspaceId) {
          return [];
        }

        const clients: Client[] = await clockifyApiRequestAllItems.call(
          this,
          'GET',
          `workspaces/${workspaceId}/clients`,
        );

        if (!clients) {
          return [];
        }

        return clients.map((client) => ({
          name: client.name,
          value: client.id,
        }));
      },

      async loadProjects(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const workspaceId = this.getCurrentNodeParameter('workspaceId');
        if (!workspaceId) {
          return [];
        }

        const projects: Project[] = await clockifyApiRequestAllItems.call(
          this,
          'GET',
          `workspaces/${workspaceId}/projects`,
        );

        if (!projects) {
          return [];
        }

        return projects.map((project) => ({
          name: project.name,
          value: project.id,
        }));
      },

      async loadUsers(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const workspaceId = this.getCurrentNodeParameter('workspaceId');
        if (!workspaceId) {
          return [];
        }

        const users: User[] = await clockifyApiRequestAllItems.call(
          this,
          'GET',
          `workspaces/${workspaceId}/users`,
        );

        if (!users) {
          return [];
        }

        return users.map((value) => ({
          name: value.name,
          value: value.id,
        }));
      },

      async loadNonProjectUsers(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const workspaceId = this.getCurrentNodeParameter(
          'workspaceId',
        ) as string;

        const projectId = this.getCurrentNodeParameter('projectId') as string;

        if (!workspaceId || !projectId) {
          return [];
        }

        const users: User[] = await clockifyApiRequestAllItems.call(
          this,
          'GET',
          `workspaces/${workspaceId}/users`,
          undefined,
          {
            memberships: 'PROJECT',
          },
        );

        if (!users) {
          return [];
        }

        return users
          .filter((user) => {
            const memberships = user.memberships.filter(
              (membership) => membership.targetId === projectId,
            );

            return memberships.length <= 0;
          })
          .map((user) => ({
            name: user.name,
            value: user.id,
          }));
      },

      async loadProjectUsers(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const workspaceId = this.getCurrentNodeParameter(
          'workspaceId',
        ) as string;

        const projectId = this.getCurrentNodeParameter('projectId') as string;

        if (!workspaceId || !projectId) {
          return [];
        }

        const users: User[] = await clockifyApiRequestAllItems.call(
          this,
          'GET',
          `workspaces/${workspaceId}/users`,
          undefined,
          {
            projectId,
          },
        );

        if (!users) {
          return [];
        }

        return users.map((user) => ({
          name: user.name,
          value: user.id,
        }));
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();

    const returnData: INodeExecutionData[] = [];

    let responseData: IDataObject | IDataObject[] = {};

    const resource = this.getNodeParameter('resource', 0);

    const operation = this.getNodeParameter('operation', 0);

    for (let item = 0; item < items.length; item++) {
      try {
        if (resource === 'project') {
          if (operation === 'update') {
            const workspaceId = this.getNodeParameter(
              'workspaceId',
              item,
            ) as string;

            const projectId = this.getNodeParameter(
              'projectId',
              item,
            ) as string;

            const updateFields = this.getNodeParameter('updateFields', item);

            responseData = await clockifyApiRequest.call(
              this,
              'PUT',
              `/workspaces/${workspaceId}/projects/${projectId}`,
              updateFields,
            );
          }
        }

        if (resource === 'project membership') {
          const workspaceId = this.getNodeParameter(
            'workspaceId',
            item,
          ) as string;

          const projectId = this.getNodeParameter('projectId', item) as string;

          if (operation === 'patch') {
            const memberships = (
              this.getNodeParameter('memberships', item) as string[]
            ).map((membership) => ({ userId: membership }));

            responseData = await clockifyApiRequest.call(
              this,
              'PATCH',
              `/workspaces/${workspaceId}/projects/${projectId}/memberships`,
              {
                memberships,
              },
            );
          }

          if (operation === 'assign') {
            responseData = await clockifyApiRequest.call(
              this,
              'POST',
              `/workspaces/${workspaceId}/projects/${projectId}/memberships`,
              {
                remove: false,
                userIds: this.getNodeParameter('userIdsToAssign', item),
              },
            );
          }

          if (operation === 'remove') {
            responseData = await clockifyApiRequest.call(
              this,
              'POST',
              `/workspaces/${workspaceId}/projects/${projectId}/memberships`,
              {
                remove: true,
                userIds: this.getNodeParameter('userIdsToRemove', item),
              },
            );
          }
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData as IDataObject[]),
          { itemData: { item } },
        );

        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as NodeApiError).message },
            pairedItem: { item },
          });
          continue;
        }

        throw error;
      }
    }

    return [returnData];
  }
}
