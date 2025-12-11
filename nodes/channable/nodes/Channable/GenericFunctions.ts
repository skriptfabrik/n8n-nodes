import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeOperationError, PaginationOptions } from 'n8n-workflow';

export type ChannableRequestData = Pick<
  IHttpRequestOptions,
  'url' | 'method' | 'body' | 'qs'
>;

interface ChannableResponse extends IDataObject {
  links?: [{ rel: string; href: string }];
}

export async function channableApiRequest<T extends ChannableResponse[]>(
  this: IExecuteFunctions,
  requestData: ChannableRequestData,
  itemIndex: number,
): Promise<T> {
  const credentialIdentifier = 'channableApi';
  const credentials = (await this.getCredentials(credentialIdentifier)) as {
    projectId: string;
    companyId: string;
    accessToken: string;
  };
  const projectParam = this.getNodeParameter('projectId', 0) as string;
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

  return (await this.helpers.requestWithAuthenticationPaginated
    .call(
      this,
      {
        json: true,
        headers: {
          Accept: 'application/json',
        },
        method: requestData.method,
        body: requestData.body,
        url: `${baseUrl}/v1/companies/${credentials.companyId}/projects/${projectId}${requestData.url}`,
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
            this.getNode(),
            JSON.stringify(r['body']),
          );
        }
      });
      return res;
    })
    .then((res: IDataObject[]) => res.map((val) => val['body']))
    .catch((error) => {
      throw new NodeOperationError(this.getNode(), error);
    })) as T;
}
