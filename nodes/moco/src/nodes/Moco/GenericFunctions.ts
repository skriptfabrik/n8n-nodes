import moment from 'moment-timezone';
import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IPollFunctions,
  IDataObject,
  IHttpRequestMethods,
  IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeApiError, sleep } from 'n8n-workflow';
import { CredentialData } from '../../credentials/MocoApi.credentials';

export function createUTCStringFromNodeParameter(
  this: IExecuteFunctions | IPollFunctions | ILoadOptionsFunctions,
  parameterName: string,
  itemIndex?: number,
): string | undefined {
  const dateTime = this.getNodeParameter(parameterName, itemIndex) as string;

  if (dateTime === '') {
    return undefined;
  }

  const timezone = this.getTimezone();

  return moment.tz(dateTime, timezone).utc().format();
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

export async function mocoApiRequest(
  this: ILoadOptionsFunctions | IPollFunctions | IExecuteFunctions,
  itemIndex: number | undefined,
  method: IHttpRequestMethods,
  url: string,
  options?: {
    impersonateUserId?: string;
    body?: IDataObject;
    qs?: IDataObject;
  },
): Promise<IDataObject> {
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
    body: IDataObject | string;
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
        httpCode: response.statusCode.toString(),
      },
    );
  }

  return response.body as IDataObject;
}

export async function mocoApiRequestAllItems(
  this: IExecuteFunctions | IPollFunctions | ILoadOptionsFunctions,
  itemIndex: number | undefined,
  method: IHttpRequestMethods,
  url: string,
  options?: {
    impersonateUserId?: string;
    body?: IDataObject;
    qs?: IDataObject;
  },
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];

  const qs = options?.qs || {};

  const { limit }: { limit?: number } = qs;

  let responseData;

  qs['page'] = 1;

  delete qs['limit'];

  do {
    responseData = (await mocoApiRequest.call(this, itemIndex, method, url, {
      ...options,
      qs,
    })) as IDataObject[];

    returnData.push(...responseData);

    if (limit !== undefined && returnData.length >= limit) {
      return returnData.splice(0, limit);
    }

    qs['page']++;
  } while (responseData.length > 0);

  return returnData;
}
