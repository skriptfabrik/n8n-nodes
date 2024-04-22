import {
  ICredentialDataDecryptedObject,
  ICredentialType,
  IHttpRequestOptions,
  INodeProperties,
  IRequestOptions,
} from 'n8n-workflow';
import { createHmac } from 'crypto';
import { KauflandRequestData } from '../nodes/KauflandMarketplace/GenericFunctions';

export function signRequest(
  request: KauflandRequestData,
  secret: string,
): string {
  const signatureData = [
    request.method,
    request.uri,
    typeof request.body === 'string'
      ? request.body
      : JSON.stringify(request.body),
    request.timestamp,
  ].join('\n');

  return createHmac('SHA256', secret).update(signatureData).digest('hex');
}

export class KauflandMarketplace implements ICredentialType {
  name = 'kauflandMarketplaceApi';

  displayName = 'Kaufland Marketplace';

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
    requestOptions: IHttpRequestOptions & Pick<IRequestOptions, 'uri'>,
  ): Promise<IHttpRequestOptions> {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = signRequest(
      {
        method: requestOptions.method as KauflandRequestData['method'],
        body: requestOptions.body,
        uri: requestOptions.url ?? requestOptions.uri,
        timestamp,
      },
      credentials['clientSecret'] as string,
    );

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
}
