import {
  type IHttpRequestHelper,
  type ICredentialDataDecryptedObject,
} from 'n8n-workflow';
import { mockClear, mockDeep } from 'jest-mock-extended';
import { FulfillmenttoolsApi } from './FulfillmenttoolsApi.credentials';

describe('FulfillmenttoolsApi', () => {
  const httpRequestHelper = mockDeep<IHttpRequestHelper>({});

  let credentials: ICredentialDataDecryptedObject;

  let fulfillmenttoolsApi: FulfillmenttoolsApi;

  beforeEach(() => {
    credentials = {
      username: '_email_',
      password: '_password_',
      apiKey: '_api_key_',
      subDomain: '_sub_domain_',
    };

    fulfillmenttoolsApi = new FulfillmenttoolsApi();
  });

  afterEach(() => {
    mockClear(httpRequestHelper);
  });

  it('should be defined', () => {
    expect(fulfillmenttoolsApi).toBeDefined();
  });

  it('should retrieve idToken', async () => {
    const requestUrl =
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';

    httpRequestHelper.helpers.httpRequest.mockResolvedValueOnce({
      idToken: '_id_token_',
      refreshToken: '_refresh_token_',
      expiresIn: 3600,
    });

    const result = await fulfillmenttoolsApi.preAuthentication.call(
      httpRequestHelper,
      credentials,
    );

    expect(httpRequestHelper.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: requestUrl,
      body: {
        email: `${credentials['username']}@${credentials['subDomain']}.com`,
        password: credentials['password'],
        returnSecureToken: true,
      },
      qs: {
        key: credentials['apiKey'],
      },
    });

    expect(result).toEqual({
      idToken: '_id_token_',
      refreshToken: '_refresh_token_',
    });
  });

  it('should refresh idToken', async () => {
    credentials['refreshToken'] = '_refresh_token_';

    const requestUrl = 'https://securetoken.googleapis.com/v1/token';

    httpRequestHelper.helpers.httpRequest.mockResolvedValueOnce({
      id_token: '_id_token_',
      refresh_token: '_refresh_token_',
      expires_in: 3600,
    });

    const result = await fulfillmenttoolsApi.preAuthentication.call(
      httpRequestHelper,
      credentials,
    );

    expect(httpRequestHelper.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: requestUrl,
      body: {
        grant_type: 'refresh_token',
        refresh_token: '_refresh_token_',
      },
      qs: {
        key: credentials['apiKey'],
      },
    });

    expect(result).toEqual({
      idToken: '_id_token_',
      refreshToken: '_refresh_token_',
    });
  });
});
