import type {
  IAuthenticateGeneric,
  Icon,
  ICredentialDataDecryptedObject,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export interface CredentialData extends ICredentialDataDecryptedObject {
  subDomain: string;
  apiKey: string;
  webhookSecret: string;
}

export class MocoApi implements ICredentialType {
  name = 'mocoApi';

  displayName = 'MOCO API';

  icon?: Icon = 'file:../icons/Moco.svg';

  documentationUrl =
    'https://github.com/skriptfabrik/n8n-nodes/blob/main/packages/moco/README.md';

  properties: INodeProperties[] = [
    {
      displayName: 'Sub-Domain',
      name: 'subDomain',
      type: 'string',
      default: '',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
    },
    {
      displayName: 'Web Hook Secret',
      name: 'webhookSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        authorization: '=Token token={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '=https://{{$credentials.subDomain}}.mocoapp.com/api/v1',
      url: '/session',
    },
  };
}
