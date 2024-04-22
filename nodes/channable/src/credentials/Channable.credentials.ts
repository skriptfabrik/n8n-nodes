import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class Channable implements ICredentialType {
  name = 'channableApi';

  displayName = 'Channable';

  documentationUrl = 'https://api.channable.com/v1/docs#section/Introduction';

  properties: INodeProperties[] = [
    {
      displayName: 'Project ID',
      name: 'projectId',
      type: 'string',
      required: true,
      default: undefined,
    },
    {
      displayName: 'Company ID',
      name: 'companyId',
      type: 'string',
      required: true,
      default: undefined,
    },
    {
      displayName: 'API Token',
      name: 'accessToken',
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
        Authorization: '=Bearer {{$credentials.accessToken}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.channable.com',
      url: '=/v1/companies/{{$credentials.companyId}}/projects/{{$credentials.projectId}}/statistics/orders',
    },
  };
}
