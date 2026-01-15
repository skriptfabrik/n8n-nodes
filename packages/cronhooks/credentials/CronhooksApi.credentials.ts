import type {
  Icon,
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class CronhooksApi implements ICredentialType {
  name = 'cronhooksApi';

  displayName = 'cronhooks.io API';

  icon: Icon = 'file:../icons/Cronhooks.svg';

  documentationUrl = 'https://docs.cronhooks.io/#introduction';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      required: true,
      default: undefined,
    },
    {
      displayName: 'Webhook Secret',
      name: 'webhookSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      required: true,
      default: undefined,
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.cronhooks.io',
      url: '/schedules?skip=0&limit=1',
    },
  };
}
