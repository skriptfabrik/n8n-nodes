import {
  IDataObject,
  IExecuteFunctions,
  IRequestOptions,
  NodeOperationError,
  PaginationOptions,
} from 'n8n-workflow';

export type ChannableRequestData = Pick<
  IRequestOptions,
  'method' | 'uri' | 'qs' | 'body'
>;

interface ChannableResponse extends IDataObject {
  links?: [{ rel: string; href: string }];
}

export async function ChannableRequest<T extends ChannableResponse[]>(
  instance: IExecuteFunctions,
  requestData: ChannableRequestData,
  itemIndex: number,
): Promise<T> {
  const credentialIdentifier = 'channableApi';
  const credentials = (await instance.getCredentials(credentialIdentifier)) as {
    projectId: string;
    companyId: string;
    accessToken: string;
  };
  const projectParam = instance.getNodeParameter('projectId', 0) as string;
  const projectId =
    projectParam.length > 0 ? projectParam : credentials.projectId;

  const baseUrl = `https://api.channable.com`;

  const limit = 100;

  const paginationData: PaginationOptions = {
    continue: `={{ ($response.body.total && ($response.body.total > ($pageCount * ${limit})))}}`,
    request: {
      qs: {
        limit,
        offset: `={{ ($pageCount * ${limit}) }}`,
      },
    },
    // Ratelimit of 2 requests per second
    requestInterval: 550,
  };

  return (await instance.helpers.requestWithAuthenticationPaginated
    .call(
      instance,
      {
        json: true,
        headers: {
          Accept: 'application/json',
        },
        method: requestData.method,
        body: requestData.body,
        uri: `${baseUrl}/v1/companies/${credentials.companyId}/projects/${projectId}${requestData.uri}`,
        qs: requestData.qs || {},
        rejectUnauthorized: false,
      },
      itemIndex,
      paginationData,
      credentialIdentifier,
    )
    .then((res: IDataObject[]) => {
      res.forEach((r) => {
        if ((r['statusCode'] as number) >= 400) {
          throw new NodeOperationError(
            instance.getNode(),
            JSON.stringify(r['body']),
          );
        }
      });
      return res;
    })
    .then((res: IDataObject[]) => res.map((val) => val['body']))
    .catch((error) => {
      throw new NodeOperationError(instance.getNode(), error);
    })) as T;
}
