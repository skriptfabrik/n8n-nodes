import FormData from 'form-data';
import * as jwt from 'jsonwebtoken';
import moment from 'moment-timezone';
import { formatPrivateKey } from 'n8n-nodes-base/dist/utils/utilities';
import type {
  IDataObject,
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IRequestOptions,
} from 'n8n-workflow';
import { Readable } from 'stream';

export function createMultipartForm(
  metadata: IDataObject,
  content: string | Buffer | Readable,
  contentType: string,
  knownLength: number,
) {
  const body = new FormData();

  body.append('metadata', JSON.stringify(metadata), {
    contentType: 'application/json',
  });

  body.append('file', content, {
    contentType,
    knownLength,
  });

  return body;
}

export function parseBodyData(bodyData: IDataObject, fields: string[]) {
  for (const field of fields) {
    if (!bodyData[field]) {
      continue;
    }

    try {
      bodyData[field] = JSON.parse(bodyData[field] as string);
    } catch {
      continue;
    }
  }

  return bodyData;
}

export async function requestAccessToken(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  credentialsType: string,
  scopes: string[],
): Promise<IDataObject> {
  const now = moment().unix();
  const credentials = await this.getCredentials(credentialsType);
  const privateKey = formatPrivateKey(credentials['privateKey'] as string);

  credentials['email'] = ((credentials['email'] as string) || '').trim();

  const options: IRequestOptions = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    form: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt.sign(
        {
          iss: credentials['email'],
          sub: credentials['delegatedEmail'] || credentials['email'],
          scope: scopes.join(' '),
          aud: 'https://oauth2.googleapis.com/token',
          iat: now,
          exp: now + 3600,
        },
        privateKey,
        {
          algorithm: 'RS256',
          header: {
            kid: privateKey,
            typ: 'JWT',
            alg: 'RS256',
          },
        },
      ),
    },
    uri: 'https://oauth2.googleapis.com/token',
    json: true,
  };

  return this.helpers.request(options);
}

export async function requestServiceAccount(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  credentialsType: string,
  options: IRequestOptions,
  scopes: string[],
): Promise<IDataObject> {
  const { access_token } = await requestAccessToken.call(
    this,
    credentialsType,
    scopes,
  );

  return this.helpers.request({
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${access_token}`,
    },
  });
}
