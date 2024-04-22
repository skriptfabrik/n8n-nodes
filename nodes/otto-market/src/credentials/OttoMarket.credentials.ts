import {
  IAuthenticateGeneric,
  ICredentialDataDecryptedObject,
  ICredentialTestRequest,
  ICredentialType,
  IHttpRequestHelper,
  INodeProperties,
} from 'n8n-workflow';

import * as querystring from 'querystring';

type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
};

export class OttoMarket implements ICredentialType {
  name = 'ottoMarketApi';

  displayName = 'Otto Market';

  documentationUrl =
    "https://api.otto.market/docs#section/OTTO-Market-API-Developer's-Guide/Authorization-(OAuth2)";

  properties: INodeProperties[] = [
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
      type: 'string',
      typeOptions: {
        password: true,
      },
      required: true,
      default: undefined,
    },
    {
      displayName: 'Access Token',
      name: 'accessToken',
      type: 'hidden',
      typeOptions: {
        expirable: true,
      },
      default: undefined,
    },
  ];

  async preAuthentication(
    this: IHttpRequestHelper,
    credentials: ICredentialDataDecryptedObject,
  ) {
    const response = (await this.helpers.httpRequest({
      method: 'POST',
      url: 'https://api.otto.market/v1/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify({
        username: credentials['username'] as string,
        password: credentials['password'] as string,
        grant_type: 'password',
        client_id: 'token-otto-api',
      }),
    })) as TokenResponse;

    return {
      accessToken: response.access_token,
    };
  }

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
      baseURL: 'https://api.otto.market',
      url: '/v3/products',
      qs: {
        limit: 1,
      },
    },
  };
}
