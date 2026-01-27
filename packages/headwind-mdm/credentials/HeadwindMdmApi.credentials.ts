import type { JWTToken } from '../types/api';
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
      displayName: 'Skip SSL Certificate Validation',
      name: 'skipSslCertificateValidation',
      type: 'boolean',
      default: false,
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
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: {
        login: credentials.username,
        password: crypto
          .createHash('md5')
          .update(credentials.password as string, 'utf8')
          .digest('hex')
          .toUpperCase(),
      },
    })) as JWTToken;

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
