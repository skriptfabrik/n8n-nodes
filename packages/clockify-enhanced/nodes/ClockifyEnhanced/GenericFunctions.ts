import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IPollFunctions,
  IDataObject,
  IHttpRequestMethods,
  IHttpRequestOptions,
  IHookFunctions,
} from 'n8n-workflow';

export async function clockifyApiRequest<T = unknown>(
  this:
    | IExecuteFunctions
    | IHookFunctions
    | ILoadOptionsFunctions
    | IPollFunctions,
  method: IHttpRequestMethods,
  url: string,
  body: IDataObject = {},
  qs: IDataObject = {},
): Promise<T> {
  const requestOptions: IHttpRequestOptions = {
    baseURL: 'https://api.clockify.me/api/v1',
    url,
    headers: {
      'Content-Type': 'application/json',
    },
    method,
    qs,
    body,
    json: true,
  };

  return await this.helpers.httpRequestWithAuthentication.call(
    this,
    'clockifyEnhancedApi',
    requestOptions,
  );
}

export async function clockifyApiRequestAllItems<T = unknown>(
  this:
    | IExecuteFunctions
    | IHookFunctions
    | ILoadOptionsFunctions
    | IPollFunctions,
  method: IHttpRequestMethods,
  url: string,
  body: IDataObject = {},
  query: IDataObject = {},
): Promise<T[]> {
  const returnData: T[] = [];

  let responseData;

  query['page-size'] = 50;

  query.page = 1;

  do {
    responseData = await (clockifyApiRequest<T[]>).call(
      this,
      method,
      url,
      body,
      query,
    );

    returnData.push.apply(returnData, responseData);

    const limit = query.limit as number | undefined;
    if (limit && returnData.length >= limit) {
      return returnData;
    }

    query.page++;
  } while (responseData.length !== 0);

  return returnData;
}
