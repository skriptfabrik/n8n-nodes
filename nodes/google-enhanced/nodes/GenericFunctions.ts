import FormData from 'form-data';
import * as jwt from 'jsonwebtoken';
import moment from 'moment-timezone';
import type {
  IDataObject,
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IHttpRequestOptions,
} from 'n8n-workflow';
import { Readable } from 'stream';

/**
 * Formats a private key by removing unnecessary whitespace and adding line breaks.
 * @param privateKey - The private key to format.
 * @returns The formatted private key.
 */
function formatPrivateKey(privateKey: string, keyIsPublic = false): string {
  let regex = /(PRIVATE KEY|CERTIFICATE)/;
  if (keyIsPublic) {
    regex = /(PUBLIC KEY)/;
  }
  if (!privateKey || /\n/.test(privateKey)) {
    return privateKey;
  }
  let formattedPrivateKey = '';
  const parts = privateKey.split('-----').filter((item) => item !== '');
  parts.forEach((part) => {
    if (regex.test(part)) {
      formattedPrivateKey += `-----${part}-----`;
    } else {
      const passRegex = /Proc-Type|DEK-Info/;
      if (passRegex.test(part)) {
        part = part.replace(/:\s+/g, ':');
        formattedPrivateKey += part.replace(/\\n/g, '\n').replace(/\s+/g, '\n');
      } else {
        formattedPrivateKey += part.replace(/\\n/g, '\n').replace(/\s+/g, '\n');
      }
    }
  });
  return formattedPrivateKey;
}

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

async function requestAccessToken(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  credentialsType: string,
  scopes: string[],
): Promise<IDataObject> {
  const now = moment().unix();
  const credentials = await this.getCredentials(credentialsType);
  const privateKey = formatPrivateKey(credentials['privateKey'] as string);

  credentials['email'] = ((credentials['email'] as string) || '').trim();

  const options: IHttpRequestOptions = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body: {
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
    url: 'https://oauth2.googleapis.com/token',
    json: true,
  };

  return this.helpers.httpRequest(options);
}

export async function requestServiceAccount(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  credentialsType: string,
  options: IHttpRequestOptions,
  scopes: string[],
): Promise<IDataObject> {
  const { access_token } = await requestAccessToken.call(
    this,
    credentialsType,
    scopes,
  );

  return this.helpers.httpRequest({
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${access_token}`,
    },
  });
}
