import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestMethods,
  IHookFunctions,
  ILoadOptionsFunctions,
  IPollFunctions,
  IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeApiError, sleep } from 'n8n-workflow';

export async function fulfillmenttoolsApiRequest(
  this:
    | IExecuteFunctions
    | IHookFunctions
    | ILoadOptionsFunctions
    | IPollFunctions,
  method: IHttpRequestMethods,
  url: string,
  body?: IDataObject,
  qs?: IDataObject,
): Promise<IDataObject> {
  const credentials = await this.getCredentials('fulfillmenttoolsApi');

  const requestOptions: IHttpRequestOptions = {
    url,
    baseURL: `https://${credentials['subDomain']}.api.fulfillmenttools.com/api`,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method,
    body,
    qs,
    returnFullResponse: true,
    ignoreHttpStatusErrors: true,
    json: true,
  };

  let response: {
    body: IDataObject | IDataObject[];
    headers: Record<string, string>;
    statusCode: number;
    statusMessage: string;
  };

  const totalRetries = 9;

  let remainingRetries = totalRetries;

  do {
    response = await this.helpers.httpRequestWithAuthentication.call(
      this,
      'fulfillmenttoolsApi',
      requestOptions,
    );

    if (response.statusCode === 409) {
      const body = response.body as IDataObject[];

      if (
        remainingRetries > 1 &&
        body.length > 0 &&
        body[0]['version'] !== undefined
      ) {
        requestOptions.body.version = body[0]['version'];
        remainingRetries = 1;
      } else {
        remainingRetries = 0;
      }
    } else if (response.statusCode === 429) {
      await sleep(Math.pow(2, totalRetries - remainingRetries) * 500);
      remainingRetries = remainingRetries - 1;
    } else {
      remainingRetries = 0;
    }
  } while (remainingRetries > 0);

  if (response.statusCode === 429) {
    throw new NodeApiError(
      this.getNode(),
      {},
      {
        message: response.statusMessage,
        httpCode: response.statusCode.toString(),
        description: 'The maximum number of retries has been reached.',
      },
    );
  } else if (response.statusCode >= 400) {
    throw new NodeApiError(
      this.getNode(),
      {},
      {
        message: response.statusMessage,
        httpCode: response.statusCode.toString(),
        description: (response.body as IDataObject[])
          .map((error) => error['summary'])
          .join('\n'),
      },
    );
  }

  return response.body as IDataObject;
}

export async function fulfillmenttoolsApiRequestAllItems<
  T extends string | undefined,
>(
  this:
    | IExecuteFunctions
    | IHookFunctions
    | ILoadOptionsFunctions
    | IPollFunctions,
  resource: T,
  method: IHttpRequestMethods,
  url: string,
  body?: IDataObject,
  qs: IDataObject = {},
): Promise<IDataObject[]> {
  const returnData: (IDataObject & { id?: string })[] = [];

  let responseItems;

  do {
    const responseData = (await fulfillmenttoolsApiRequest.call(
      this,
      method,
      url,
      body,
      qs,
    )) as T extends string
      ? { [R: string]: (IDataObject & { id?: string })[] }
      : (IDataObject & { id?: string })[];

    if (resource === undefined) {
      responseItems = responseData as (IDataObject & { id?: string })[];
    } else {
      responseItems = (
        responseData as { [R: string]: (IDataObject & { id?: string })[] }
      )[resource];
    }

    returnData.push(...responseItems);

    if (
      qs['limit'] !== undefined &&
      returnData.length >= (qs['limit'] as number)
    ) {
      return returnData.splice(0, qs['limit'] as number);
    }

    qs['startAfterId'] = returnData[returnData.length - 1].id;
  } while (responseItems.length > 0);

  return returnData;
}
