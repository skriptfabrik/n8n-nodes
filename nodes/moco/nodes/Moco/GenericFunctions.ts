import { CredentialData } from '../../credentials/MocoApi.credentials';
import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IPollFunctions,
  IDataObject,
  IHttpRequestMethods,
  IHttpRequestOptions,
  IHookFunctions,
} from 'n8n-workflow';
import { NodeApiError, sleep, tryToParseDateTime } from 'n8n-workflow';

export function createUTCStringFromNodeParameter(
  this: IExecuteFunctions | IPollFunctions | ILoadOptionsFunctions,
  parameterName: string,
  itemIndex?: number,
): string | undefined {
  const dateTimeParam = this.getNodeParameter(
    parameterName,
    itemIndex,
  ) as string;

  if (dateTimeParam === '') {
    return undefined;
  }

  const dateTime = tryToParseDateTime(dateTimeParam, this.getTimezone());

  if (!dateTime.isValid) {
    return undefined;
  }

  const dateTimeValue = dateTime.toUTC().toISO({
    suppressMilliseconds: true,
  });

  if (dateTimeValue === null) {
    return undefined;
  }

  return dateTimeValue;
}

export function createParametersFromNodeParameter(
  this: IExecuteFunctions | IPollFunctions | ILoadOptionsFunctions,
  parameterName: string,
  itemIndex: number | undefined,
  fields: string[],
): IDataObject {
  const additionalFieldsData = this.getNodeParameter(
    parameterName,
    itemIndex,
  ) as IDataObject;

  const returnData: IDataObject = {};

  for (const field of fields) {
    if (
      additionalFieldsData[field] === undefined ||
      additionalFieldsData[field] === ''
    ) {
      continue;
    }

    const name = field.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`,
    );

    returnData[name] = additionalFieldsData[field];

    if (typeof returnData[name] === 'boolean') {
      returnData[name] = Boolean(returnData[name]).toString();
    }
  }

  return returnData;
}

export async function mocoApiRequest<T = unknown>(
  this:
    | IHookFunctions
    | ILoadOptionsFunctions
    | IPollFunctions
    | IExecuteFunctions,
  itemIndex: number | undefined,
  method: IHttpRequestMethods,
  url: string,
  options?: {
    impersonateUserId?: string;
    body?: IDataObject;
    qs?: IDataObject;
  },
): Promise<T> {
  const credentials = (await this.getCredentials(
    'mocoApi',
    itemIndex,
  )) as CredentialData;

  const { impersonateUserId, body, qs } = options || {};

  const requestOptions: IHttpRequestOptions = {
    url,
    baseURL: `https://${credentials.subDomain}.mocoapp.com/api/v1`,
    headers: {
      accept: 'application/json',
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(impersonateUserId
        ? { 'x-impersonate-user-id': impersonateUserId }
        : {}),
    },
    method,
    body,
    qs,
    returnFullResponse: true,
    ignoreHttpStatusErrors: true,
    json: true,
  };

  let response: {
    body: T;
    headers: Record<string, string>;
    statusCode: number;
    statusMessage: string;
  };

  const retries = 5;

  let remainingRetries = retries;

  do {
    response = await this.helpers.httpRequestWithAuthentication.call(
      this,
      'mocoApi',
      requestOptions,
    );

    if (response.statusCode === 429) {
      await sleep(Math.pow(2, retries - remainingRetries) * 1000);
      remainingRetries = remainingRetries - 1;
    } else {
      remainingRetries = 0;
    }
  } while (remainingRetries > 0);

  if (response.statusCode >= 400) {
    throw new NodeApiError(
      this.getNode(),
      {},
      {
        message: response.statusMessage,
        description: JSON.stringify(response.body) as string,
        httpCode: response.statusCode.toString(),
        itemIndex,
      },
    );
  }

  return response.body;
}

export async function mocoApiRequestAllItems<T = unknown>(
  this:
    | IHookFunctions
    | IExecuteFunctions
    | IPollFunctions
    | ILoadOptionsFunctions,
  itemIndex: number | undefined,
  method: IHttpRequestMethods,
  url: string,
  options?: {
    impersonateUserId?: string;
    body?: IDataObject;
    qs?: IDataObject;
  },
): Promise<T[]> {
  const returnData: T[] = [];

  const qs = options?.qs || {};

  const { limit }: { limit?: number } = qs;

  let responseData;

  qs['page'] = 1;

  delete qs['limit'];

  do {
    responseData = await (mocoApiRequest<T>).call(
      this,
      itemIndex,
      method,
      url,
      {
        ...options,
        qs,
      },
    );

    if (!Array.isArray(responseData)) {
      break;
    }

    returnData.push(...responseData);

    if (limit !== undefined && returnData.length >= limit) {
      return returnData.splice(0, limit);
    }

    qs['page']++;
  } while (responseData.length > 0);

  return returnData;
}
