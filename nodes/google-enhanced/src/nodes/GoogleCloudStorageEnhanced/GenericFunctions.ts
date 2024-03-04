import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestMethods,
  ILoadOptionsFunctions,
  IRequestOptions,
} from 'n8n-workflow';
import { requestServiceAccount } from '../GenericFunctions';

export async function googleApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  url: URL | string,
  body?: IDataObject,
  qs?: IDataObject,
  headers: IDataObject = { 'Content-Type': 'application/json' },
): Promise<IDataObject> {
  const authenticationMethod = this.getNodeParameter(
    'authentication',
    0,
    'serviceAccount',
  );

  const options: IRequestOptions = {
    ...(url instanceof URL
      ? {
          uri: `${url}`,
        }
      : {
          baseURL: 'https://storage.googleapis.com/storage/v1',
          url: `${url}`,
        }),
    method,
    qs,
    headers,
    body,
    json: true,
    ...(qs && qs['alt'] === 'media' && { encoding: 'arraybuffer' }),
  };

  if (authenticationMethod === 'serviceAccount') {
    return requestServiceAccount.call(this, 'googleApi', options, [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/cloud-platform.read-only',
      'https://www.googleapis.com/auth/devstorage.full_control',
      'https://www.googleapis.com/auth/devstorage.read_only',
      'https://www.googleapis.com/auth/devstorage.read_write',
    ]);
  }

  return this.helpers.requestOAuth2.call(this, 'googleApi', options);
}

export async function googleApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: string,
  url: URL | string,
  body?: IDataObject,
  qs: IDataObject = {},
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];

  let responseData: IDataObject;

  do {
    responseData = await googleApiRequest.call(this, method, url, body, qs);

    returnData.push(...((responseData['items'] as IDataObject[]) || []));

    qs['pageToken'] = responseData['nextPageToken'];
  } while (qs['pageToken'] !== undefined);

  return returnData;
}
