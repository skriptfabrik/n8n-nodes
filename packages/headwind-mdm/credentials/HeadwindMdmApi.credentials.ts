import crypto from 'crypto';
import type {
  Icon,
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
  IHttpRequestHelper,
  ICredentialDataDecryptedObject,
} from 'n8n-workflow';

function md5Upper(str: string): string {
  return crypto
    .createHash('md5')
    .update(str, 'utf8')
    .digest('hex')
    .toUpperCase();
}

type TokenResponse = {
  id_token: string;
};


export class HeadwindMdmApi implements ICredentialType {
  name = 'headwindMdmApi';

  displayName = 'Headwind MDM API';

  icon: Icon = 'file:../icons/HeadwindMDM.svg';

  documentationUrl = 'https://srv.h-mdm.com/swagger-ui/';

  properties: INodeProperties[] = [
    {
      displayName: 'Instance URL',
      name: 'url',
      type: 'string',
      placeholder: 'https://your-instance.com',
      required: true,
      default: undefined,
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      placeholder: 'username',
      required: true,
      default: undefined,
    },
    {
      displayName: 'Password',
      name: 'password',
      placeholder: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      required: true,
      default: undefined,
    },
    {
      displayName: 'ID Token',
      name: 'idToken',
      type: 'hidden',
      typeOptions: {
        expirable: true,
        password: true,
      },
      default: '',
    },
  ];

  async preAuthentication(
    this: IHttpRequestHelper,
    credentials: ICredentialDataDecryptedObject,
  ) {
    const response = (await this.helpers.httpRequest({
      method: 'POST',
      url: `${credentials.url}/rest/public/jwt/login`,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: {
        login: credentials.username,
        password: md5Upper(credentials.password as string),
      },
    })) as TokenResponse;

    return {
      idToken: response.id_token,
    };
  }

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.idToken}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.url}}',
      url: '/rest/private/users/current',
    },
  };
}
