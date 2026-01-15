import type {
  IAuthenticateGeneric,
  Icon,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class ClockifyEnhancedApi implements ICredentialType {
  name = 'clockifyEnhancedApi';

  displayName = 'Clockify Enhanced API';

  icon: Icon = 'file:../icons/Clockify.svg';

  documentationUrl =
    'https://github.com/skriptfabrik/n8n-nodes/blob/main/packages/clockify-enhanced/README.md';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-Api-Key': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.clockify.me/api/v1',
      url: '/workspaces',
    },
  };
}
