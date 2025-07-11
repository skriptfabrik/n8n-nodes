import {
  IDataObject,
  IExecuteFunctions,
  NodeOperationError,
} from 'n8n-workflow';

export type KauflandRequestData = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  uri: string;
  body: Record<string, unknown> | Record<string, unknown>[] | string;
  qs?: IDataObject;
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

  const searchParams = new URLSearchParams(
    requestData.qs as Record<string, string> | undefined,
  );

  if (offset > 0) searchParams.set('offset', String(offset));

  const url = searchParams.size
    ? `${requestData.uri}?${searchParams.toString()}`
    : requestData.uri;

  const res = (await instance.helpers.requestWithAuthentication
    .call(instance, credentialIdentifier, {
      method: requestData.method,
      url,
      body: requestData.body,
      json: true,
    })
    .catch((error) => {
      throw new NodeOperationError(instance.getNode(), error);
    })) as T;

  // If response contains pagination object and we need to fetch more data
  if (
    res?.pagination &&
    res.pagination.offset + res.pagination.limit < res.pagination.total
  ) {
    const remaining = await kauflandMarketplaceRequest(
      instance,
      requestData,
      res.pagination.offset + res.pagination.limit,
    );
    res.data = [...res.data, ...remaining.data];
  }

  if (res.pagination) delete res.pagination;

  return res;
}
