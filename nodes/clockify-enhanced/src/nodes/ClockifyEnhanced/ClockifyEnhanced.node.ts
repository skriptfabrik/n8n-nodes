import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeApiError,
} from 'n8n-workflow';

import { clockifyApiRequest } from 'n8n-nodes-base/dist/nodes/Clockify/GenericFunctions';

import {
  projectFields,
  projectOperations,
} from './descriptions/ProjectDescription';

import {
  projectMembershipFields,
  projectMembershipOperations,
} from './descriptions/ProjectMembershipsDescription';

import { Clockify } from 'n8n-nodes-base/dist/nodes/Clockify/Clockify.node';

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
            name: 'Projectmembership',
            value: 'projectmembership',
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
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
        typeOptions: {
          loadOptionsMethod: 'listWorkspaces',
        },
        required: true,
        default: '',
        displayOptions: {
          hide: {
            resource: ['workspace'],
          },
        },
      },
      ...projectFields,
      ...projectMembershipFields,
    ],
  };

  methods = new Clockify().methods;

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

        if (resource === 'projectmembership') {
          if (operation === 'patch') {
            const workspaceId = this.getNodeParameter(
              'workspaceId',
              item,
            ) as string;

            const projectId = this.getNodeParameter(
              'projectId',
              item,
            ) as string;

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
