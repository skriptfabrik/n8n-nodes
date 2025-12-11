import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestMethods,
  IHookFunctions,
  ILoadOptionsFunctions,
  IPollFunctions,
  IHttpRequestOptions,
} from 'n8n-workflow';

export async function cronhooksApiRequest<T = unknown>(
  this:
    | IExecuteFunctions
    | IHookFunctions
    | ILoadOptionsFunctions
    | IPollFunctions,
  method: IHttpRequestMethods,
  url: string,
  body?: IDataObject,
  qs?: IDataObject,
): Promise<T> {
  const requestOptions: IHttpRequestOptions = {
    baseURL: 'https://api.cronhooks.io',
    url,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method,
    qs,
    body,
    json: true,
  };

  return this.helpers.httpRequestWithAuthentication.call(
    this,
    'cronhooksApi',
    requestOptions,
  );
}

export async function cronhooksApiRequestAllItems<T = unknown>(
  this:
    | IExecuteFunctions
    | IHookFunctions
    | ILoadOptionsFunctions
    | IPollFunctions,
  method: IHttpRequestMethods,
  url: string,
  body?: IDataObject,
  qs: IDataObject = {},
): Promise<T[]> {
  const returnData: T[] = [];

  let responseItems;

  const limit = 100;
  let skip = 0;

  do {
    const responseData = await (cronhooksApiRequest<{ items: T[] }>).call(
      this,
      method,
      url,
      body,
      {
        ...qs,
        limit,
        skip,
      },
    );

    responseItems = responseData.items;

    returnData.push(...responseItems);

    skip = skip + limit;
  } while (responseItems.length > 0);

  return returnData;
}
