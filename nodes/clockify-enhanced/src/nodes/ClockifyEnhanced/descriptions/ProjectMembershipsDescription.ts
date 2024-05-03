import { type INodeProperties } from 'n8n-workflow';

export const projectMembershipOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['projectmembership'],
      },
    },
    options: [
      {
        name: 'Patch',
        value: 'patch',
        description: 'Patches the membership of a project',
        action: 'Patches the project membership',
      },
    ],
    default: 'patch',
  },
];

export const projectMembershipFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                          projectmembership:update                          */
  /* -------------------------------------------------------------------------- */
  {
    displayName: 'Project Name or ID',
    name: 'projectId',
    type: 'options',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
    typeOptions: {
      loadOptionsDependsOn: ['workspaceId'],
      loadOptionsMethod: 'loadProjectsForWorkspace',
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        operation: ['patch'],
        resource: ['projectmembership'],
      },
    },
  },
  {
    displayName: 'User Names or IDs',
    name: 'memberships',
    type: 'multiOptions',
    description:
      'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
    typeOptions: {
      loadOptionsDependsOn: ['workspaceId'],
      loadOptionsMethod: 'loadUsersForWorkspace',
    },
    default: [],
    displayOptions: {
      show: {
        operation: ['patch'],
        resource: ['projectmembership'],
      },
    },
  },
];
