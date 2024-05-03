import {
  IDataObject,
  IExecuteFunctions,
  NodeOperationError,
  PaginationOptions,
} from 'n8n-workflow';

export type OttoMarketRequestData = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  uri: string;
  body: Record<string, unknown> | Record<string, unknown>[] | string;
};

interface OttoMarketResponse extends IDataObject {
  links?: [{ rel: string; href: string }];
}

export async function OttoMarketRequest<T extends OttoMarketResponse>(
  instance: IExecuteFunctions,
  requestData: OttoMarketRequestData,
  itemIndex: number,
): Promise<T[]> {
  const credentialIdentifier = 'ottoMarketApi';
  const baseUrl = 'https://api.otto.market';

  const paginationData: PaginationOptions = {
    continue: `={{ Boolean($response?.body?.links?.find(link => link.rel === 'next')) }}`,
    request: {
      url: `=${baseUrl}{{ $response?.body?.links.find(l => l.rel === 'next')?.href ?? '${requestData.uri}' }}`,
    },
    requestInterval: 25,
  };

  const baseOptions = {
    json: true,
  };

  const baseHeaders = {
    Accept: 'application/json',
  };

  let responseData: T[];

  try {
    const response =
      await instance.helpers.requestWithAuthenticationPaginated.call(
        instance,
        {
          ...baseOptions,
          headers: {
            ...baseHeaders,
          },
          method: requestData.method,
          body: requestData.body,
        },
        itemIndex,
        paginationData,
        credentialIdentifier,
      );

    response.forEach((r) => {
      if ((r['statusCode'] as number) >= 400) {
        throw new NodeOperationError(
          instance.getNode(),
          JSON.stringify(r['body']),
        );
      }
    });

    responseData = response.map((val) => val['body'] as T);
  } catch (error: unknown) {
    throw new NodeOperationError(instance.getNode(), error as never);
  }

  return responseData;
}
