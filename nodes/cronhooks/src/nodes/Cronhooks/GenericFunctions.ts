import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestMethods,
  IHookFunctions,
  ILoadOptionsFunctions,
  IPollFunctions,
  IRequestOptions,
} from 'n8n-workflow';

export async function cronhooksApiRequest(
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
  const requestOptions: IRequestOptions = {
    baseURL: `https://api.cronhooks.io`,
    url,
    method,
    qs,
    useQuerystring: true,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body,
    json: true,
    rejectUnauthorized: false,
  };

  return this.helpers.requestWithAuthentication.call(
    this,
    'cronhooksApi',
    requestOptions,
  );
}

export async function cronhooksApiRequestAllItems(
  this:
    | IExecuteFunctions
    | IHookFunctions
    | ILoadOptionsFunctions
    | IPollFunctions,
  method: IHttpRequestMethods,
  url: string,
  body?: IDataObject,
  qs: IDataObject = {},
): Promise<IDataObject[]> {
  const returnData: (IDataObject & { id?: string })[] = [];

  let responseItems;

  const limit = 100;
  let skip = 0;

  do {
    const responseData = (await cronhooksApiRequest.call(
      this,
      method,
      url,
      body,
      {
        ...qs,
        limit,
        skip,
      },
    )) as { items: (IDataObject & { id?: string })[] };

    responseItems = responseData.items;

    returnData.push(...responseItems);

    skip = skip + limit;
  } while (responseItems.length > 0);

  return returnData;
}
