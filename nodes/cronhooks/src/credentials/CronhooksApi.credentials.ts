import {
  type IAuthenticateGeneric,
  type ICredentialTestRequest,
  type ICredentialType,
  type INodeProperties,
} from 'n8n-workflow';

export class CronhooksApi implements ICredentialType {
  name = 'cronhooksApi';

  displayName = 'cronhooks.io API';

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
