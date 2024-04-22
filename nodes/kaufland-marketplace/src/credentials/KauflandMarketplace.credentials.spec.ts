import { KauflandMarketplace } from './KauflandMarketplace.credentials';
import { KauflandRequestData } from '../nodes/KauflandMarketplace/GenericFunctions';
import { signRequest } from './KauflandMarketplace.credentials';
import {
  ICredentialDataDecryptedObject,
  IHttpRequestOptions,
  IRequestOptions,
} from 'n8n-workflow';

describe('signRequest function', () => {
  let requestTestData: KauflandRequestData;
  let secret: string;

  it('returns correct signature for GET request with string body', () => {
    requestTestData = {
      method: 'GET',
      uri: 'test-uri',
      body: 'string',
      timestamp: 123456,
    };
    secret = 'test-secret';
    const expectedSignature =
      'e6208195efece21182fde2eea07c71025e544885079dc83d7fb68ace13c53764';

    const resultSignature = signRequest(requestTestData, secret);

    expect(resultSignature).toBe(expectedSignature);
  });

  it('returns correct signature for GET request with JSON body', () => {
    requestTestData = {
      method: 'GET',
      uri: 'test-uri',
      body: { key: 'value' },
      timestamp: 123456,
    };
    secret = 'test-secret';
    const expectedSignature =
      'c3b8499073972b4d75b29d185828bb7431bc7c4e0407962b3d466765698311e8';

    const resultSignature = signRequest(requestTestData, secret);

    expect(resultSignature).toBe(expectedSignature);
  });
});

describe('KauflandMarketplace', () => {
  let kauflandMarketplaceCredential: KauflandMarketplace;
  let requestOptions: IHttpRequestOptions & Pick<IRequestOptions, 'uri'>;

  beforeEach(() => {
    kauflandMarketplaceCredential = new KauflandMarketplace();
  });

  it('should be defined', () => {
    expect(kauflandMarketplaceCredential).toBeDefined();
  });

  it('authenticate should return updated request options with url', async () => {
    requestOptions = {
      url: 'http://test.com',
      method: 'GET',
      body: '',
      headers: {},
    };
    const credentials: ICredentialDataDecryptedObject = {
      clientId: 'testClientId',
      clientSecret: 'testClientSecret',
    };

    const signRequestResult = signRequest(
      {
        uri: requestOptions.url,
        body: requestOptions.body,
        method: requestOptions.method as 'GET',
        timestamp: Math.floor(Date.now() / 1000),
      },
      'testClientSecret',
    );

    const result = await kauflandMarketplaceCredential.authenticate(
      credentials,
      requestOptions,
    );

    expect(result.json).toEqual(true);
    expect(result.headers).toEqual({
      'User-Agent': 'n8n',
      Accept: 'application/json',
      'Shop-Timestamp': expect.any(Number),
      'Shop-Signature': signRequestResult,
      'Shop-Client-Key': 'testClientId',
    });
  });

  it('authenticate should return updated request options with uri', async () => {
    //@ts-expect-error property `url` is mandatory in type but not in production
    requestOptions = {
      uri: 'http://test.com',
      method: 'GET',
      body: '',
      headers: {},
    };
    const credentials: ICredentialDataDecryptedObject = {
      clientId: 'testClientId',
      clientSecret: 'testClientSecret',
    };

    const signRequestResult = signRequest(
      {
        uri: requestOptions.uri as string,
        body: requestOptions.body,
        method: requestOptions.method as 'GET',
        timestamp: Math.floor(Date.now() / 1000),
      },
      'testClientSecret',
    );

    const result = await kauflandMarketplaceCredential.authenticate(
      credentials,
      requestOptions,
    );

    expect(result.json).toEqual(true);
    expect(result.headers).toEqual({
      'User-Agent': 'n8n',
      Accept: 'application/json',
      'Shop-Timestamp': expect.any(Number),
      'Shop-Signature': signRequestResult,
      'Shop-Client-Key': 'testClientId',
    });
  });
});
