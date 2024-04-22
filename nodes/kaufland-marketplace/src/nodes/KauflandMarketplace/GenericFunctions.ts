import {
  IDataObject,
  IExecuteFunctions,
  NodeOperationError,
} from 'n8n-workflow';

export type KauflandRequestData = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  uri: string;
  body: Record<string, unknown> | Record<string, unknown>[] | string;
  timestamp?: number;
};

export interface KauflandResponse extends IDataObject {
  data: unknown[];
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

export async function kauflandMarketplaceRequest<T extends KauflandResponse>(
  instance: IExecuteFunctions,
  requestData: KauflandRequestData,
  offset = 0,
): Promise<T> {
  const credentialIdentifier = 'kauflandMarketplaceApi';

  if (offset > 0) {
    requestData.uri += requestData.uri.includes('?') ? '&' : '?';
    requestData.uri += 'offset=' + offset;
  }

  const res = (await instance.helpers.requestWithAuthentication
    .call(instance, credentialIdentifier, {
      method: requestData.method,
      url: requestData.uri,
      body: requestData.body,
    })
    .catch((error) => {
      throw new NodeOperationError(instance.getNode(), error);
    })) as T;

  // If response contains pagination object and we need to fetch more data
  if (
    res &&
    res.pagination &&
    res.pagination.offset + res.pagination.limit < res.pagination.total
  ) {
    const remaining = (await kauflandMarketplaceRequest(
      instance,
      requestData,
      res.pagination.offset + res.pagination.limit,
    )) as { data: unknown[] };
    res.data = [...res.data, ...remaining.data];
  }

  if (res.pagination) delete res.pagination;

  return res;
}
