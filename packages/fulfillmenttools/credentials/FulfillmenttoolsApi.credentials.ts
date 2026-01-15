import { randomBytes } from 'crypto';
import type {
  Icon,
  IAuthenticateGeneric,
  ICredentialDataDecryptedObject,
  ICredentialTestRequest,
  ICredentialType,
  IHttpRequestHelper,
  INodeProperties,
} from 'n8n-workflow';

type IdTokenResponse = {
  kind: string; // deprecated
  localeId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean; // deprecated
  profilePicture: string;
  oauthAccessToken: string; // deprecated
  oauthExpireIn: number; // deprecated
  oauthAuthorizationCode: string; // deprecated
  refreshToken: string;
  expiresIn: number;
  mfaPendingCredential: string;
  mfaInfo: object[];
  userNotifications: object[];
};

type RefreshTokenResponse = {
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
};

export class FulfillmenttoolsApi implements ICredentialType {
  name = 'fulfillmenttoolsApi';

  displayName = 'Fulfillmenttools API';

  icon: Icon = 'file:../icons/Fulfillmenttools.svg';

  documentationUrl =
    'https://docs.fulfillmenttools.com/api-docs/getting-started/make-your-first-api-call';

  properties: INodeProperties[] = [
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      required: true,
      default: undefined,
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      required: true,
      default: undefined,
    },
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
      displayName: 'Sub Domain',
      name: 'subDomain',
      type: 'string',
      required: true,
      default: undefined,
    },
    {
      displayName: 'Webhook Token',
      name: 'webhookToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      required: true,
      default: randomBytes(16).toString('hex'),
    },
    {
      displayName: 'ID Token',
      name: 'idToken',
      type: 'hidden',
      typeOptions: {
        expirable: true,
      },
      default: undefined,
    },
    {
      displayName: 'Refresh Token',
      name: 'refreshToken',
      type: 'hidden',
      typeOptions: {
        password: true,
      },
      default: undefined,
    },
  ];

  async preAuthentication(
    this: IHttpRequestHelper,
    credentials: ICredentialDataDecryptedObject,
  ) {
    if (!credentials['refreshToken']) {
      const responseData = (await this.helpers.httpRequest({
        method: 'POST',
        url: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
        body: {
          email: `${credentials['username']}@${credentials['subDomain']}.com`,
          password: credentials['password'],
          returnSecureToken: true,
        },
        qs: {
          key: credentials['apiKey'],
        },
      })) as IdTokenResponse;

      return {
        idToken: responseData.idToken,
        refreshToken: responseData.refreshToken,
      };
    }

    const responseData = (await this.helpers.httpRequest({
      method: 'POST',
      url: 'https://securetoken.googleapis.com/v1/token',
      body: {
        grant_type: 'refresh_token',
        refresh_token: credentials['refreshToken'],
      },
      qs: {
        key: credentials['apiKey'],
      },
    })) as RefreshTokenResponse;

    return {
      idToken: responseData.id_token,
      refreshToken: responseData.refresh_token,
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
      baseURL:
        '=https://{{$credentials.subDomain}}.api.fulfillmenttools.com/api',
      url: '/health',
    },
  };
}
