import { createHmac } from 'crypto';
import type {
  Icon,
  ICredentialDataDecryptedObject,
  ICredentialTestRequest,
  ICredentialType,
  IHttpRequestOptions,
  INodeProperties,
} from 'n8n-workflow';

export class KauflandMarketplaceApi implements ICredentialType {
  name = 'kauflandMarketplaceApi';

  displayName = 'Kaufland Marketplace API';

  icon: Icon = 'file:../icons/Kaufland.svg';

  documentationUrl = 'https://sellerapi.kaufland.com/?page=rest-api';

  properties: INodeProperties[] = [
    {
      displayName: 'Client ID',
      name: 'clientId',
      type: 'string',
      placeholder: 'Client ID',
      required: true,
      default: undefined,
    },
    {
      displayName: 'Client Secret',
      name: 'clientSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      placeholder: 'Client secret',
      required: true,
      default: undefined,
    },
  ];

  async authenticate(
    credentials: ICredentialDataDecryptedObject,
    requestOptions: IHttpRequestOptions,
  ): Promise<IHttpRequestOptions> {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = createHmac(
      'SHA256',
      credentials['clientSecret'] as string,
    )
      .update(
        [
          requestOptions.method,
          requestOptions.url,
          typeof requestOptions.body === 'string'
            ? requestOptions.body
            : JSON.stringify(requestOptions.body),
          timestamp,
        ].join('\n'),
      )
      .digest('hex');

    requestOptions.json = true;

    requestOptions.headers = {
      ...requestOptions.headers,
      'User-Agent': 'n8n',
      Accept: 'application/json',
      'Shop-Timestamp': timestamp,
      'Shop-Signature': signature,
      'Shop-Client-Key': credentials['clientId'],
    };

    return requestOptions;
  }

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://sellerapi.kaufland.com',
      url: '/v2/status/ping',
    },
  };
}
