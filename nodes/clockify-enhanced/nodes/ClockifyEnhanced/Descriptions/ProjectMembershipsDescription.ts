import type { INodeProperties } from 'n8n-workflow';

export const projectMembershipOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['project membership'],
      },
    },
    options: [
      {
        name: 'Patch',
        value: 'patch',
        description: 'Patch the project membership',
        action: 'Patch the project membership',
      },
      {
        name: 'Assign',
        value: 'assign',
        description: 'Assign users to a project',
        action: 'Assign users to a project',
      },
      {
        name: 'Remove',
        value: 'remove',
        description: 'Remove users from a project',
        action: 'Remove users from a project',
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
    typeOptions: {
      loadOptionsDependsOn: ['workspaceId'],
      loadOptionsMethod: 'loadProjects',
    },
    default: '',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: {
      show: {
        operation: ['patch', 'assign', 'remove'],
        resource: ['project membership'],
      },
    },
    required: true,
    requiresDataPath: 'single',
    validateType: 'string',
  },
  {
    displayName: 'User Names or IDs',
    name: 'memberships',
    type: 'multiOptions',
    typeOptions: {
      loadOptionsDependsOn: ['workspaceId'],
      loadOptionsMethod: 'loadUsers',
    },
    default: [],
    description:
      'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: {
      show: {
        operation: ['patch'],
        resource: ['project membership'],
      },
    },
    requiresDataPath: 'multiple',
    validateType: 'array',
  },
  {
    displayName: 'User Names or IDs',
    name: 'userIdsToAssign',
    type: 'multiOptions',
    typeOptions: {
      loadOptionsDependsOn: ['workspaceId', 'projectId'],
      loadOptionsMethod: 'loadNonProjectUsers',
    },
    default: [],
    description:
      'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: {
      show: {
        operation: ['assign'],
        resource: ['project membership'],
      },
    },
    required: true,
    requiresDataPath: 'multiple',
    validateType: 'array',
  },
  {
    displayName: 'User Names or IDs',
    name: 'userIdsToRemove',
    type: 'multiOptions',
    typeOptions: {
      loadOptionsDependsOn: ['workspaceId', 'projectId'],
      loadOptionsMethod: 'loadProjectUsers',
    },
    default: [],
    description:
      'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    displayOptions: {
      show: {
        operation: ['remove'],
        resource: ['project membership'],
      },
    },
    required: true,
    requiresDataPath: 'multiple',
    validateType: 'array',
  },
];
