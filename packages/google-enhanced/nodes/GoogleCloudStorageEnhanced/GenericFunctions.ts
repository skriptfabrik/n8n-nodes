import { requestServiceAccount } from '../GenericFunctions';
import FormData from 'form-data';
import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestMethods,
  ILoadOptionsFunctions,
  IHttpRequestOptions,
} from 'n8n-workflow';

export async function googleApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  url: URL | string,
  body?: FormData | IDataObject | Buffer | URLSearchParams,
  qs?: IDataObject,
  headers: IDataObject = { 'Content-Type': 'application/json' },
): Promise<IDataObject> {
  const authenticationMethod = this.getNodeParameter(
    'authentication',
    0,
    'serviceAccount',
  );

  const options: IHttpRequestOptions = {
    ...(url instanceof URL
      ? {
          url: `${url}`,
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

  return this.helpers.httpRequestWithAuthentication.call(
    this,
    'googleApi',
    options,
  );
}

export async function googleApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  url: URL | string,
  body?: FormData | IDataObject | Buffer | URLSearchParams,
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
