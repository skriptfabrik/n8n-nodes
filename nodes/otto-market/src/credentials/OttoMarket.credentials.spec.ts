import {
  ICredentialDataDecryptedObject,
  IHttpRequestHelper,
} from 'n8n-workflow';
import { mockClear, mockDeep } from 'jest-mock-extended';
import { OttoMarket } from './OttoMarket.credentials';

describe('OttoMarket', () => {
  const httpRequestHelper = mockDeep<IHttpRequestHelper>({
    helpers: {
      httpRequest: jest.fn().mockResolvedValue({
        access_token: '_access_token_',
        expires_in: 3600,
        refresh_token: '_refresh_token_',
        refresh_expires_in: 18000,
        token_type: '_token_type_',
        'not-before-policy': '_not-before-policy_',
        session_state: '_session_state_',
        scope: '_scope_',
      }),
    },
  });

  let credentials: ICredentialDataDecryptedObject;

  let ottoMarketCredential: OttoMarket;

  beforeEach(() => {
    credentials = {
      username: '_username_',
      password: '_password_',
    };

    ottoMarketCredential = new OttoMarket();
  });

  afterEach(() => {
    mockClear(httpRequestHelper);
  });

  it('should be defined', () => {
    expect(ottoMarketCredential).toBeDefined();
  });

  it('should retrieve accessToken', async () => {
    const result = await ottoMarketCredential.preAuthentication.call(
      httpRequestHelper,
      credentials,
    );

    expect(httpRequestHelper.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.otto.market/v1/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: 'username=_username_&password=_password_&grant_type=password&client_id=token-otto-api',
    });

    expect(result).toHaveProperty('accessToken');
    expect(result.accessToken).toBe('_access_token_');
  });
});
