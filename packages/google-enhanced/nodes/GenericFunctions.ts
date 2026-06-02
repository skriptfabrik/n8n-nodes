import { createSign, randomBytes } from 'crypto';
import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestOptions,
  ILoadOptionsFunctions,
} from 'n8n-workflow';
import { Readable } from 'stream';

export interface MultipartFormPayload {
  getBoundary(): string;
  getLengthSync(): number;
  getBuffer(): Buffer;
}

function base64UrlEncode(value: string | Buffer): string {
  return Buffer.from(value).toString('base64url');
}

function signJwt(
  payload: IDataObject,
  privateKey: string,
  keyId?: string,
): string {
  const header: {
    typ: 'JWT';
    alg: 'RS256';
    kid?: string;
  } = {
    typ: 'JWT',
    alg: 'RS256',
  };

  if (typeof keyId === 'string' && keyId.trim() !== '') {
    header.kid = keyId.trim();
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signer = createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();

  const signature = signer.sign(privateKey, 'base64url');

  return `${unsignedToken}.${signature}`;
}

function createMultipartPartHeader(
  boundary: string,
  name: string,
  contentType: string,
  filename?: string,
): Buffer {
  const disposition = filename
    ? `Content-Disposition: form-data; name="${name}"; filename="${filename}"`
    : `Content-Disposition: form-data; name="${name}"`;

  return Buffer.from(
    `--${boundary}\r\n${disposition}\r\nContent-Type: ${contentType}\r\n\r\n`,
    'utf8',
  );
}

async function toBuffer(content: string | Buffer | Readable): Promise<Buffer> {
  if (Buffer.isBuffer(content)) {
    return content;
  }

  if (typeof content === 'string') {
    return Buffer.from(content, 'utf8');
  }

  const chunks: Buffer[] = [];

  for await (const chunk of content) {
    if (Buffer.isBuffer(chunk)) {
      chunks.push(chunk);
      continue;
    }

    chunks.push(Buffer.from(chunk as Uint8Array));
  }

  return Buffer.concat(chunks);
}

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

export async function createMultipartForm(
  metadata: IDataObject,
  content: string | Buffer | Readable,
  contentType: string,
): Promise<MultipartFormPayload> {
  const boundary = `n8n-boundary-${randomBytes(12).toString('hex')}`;
  const metadataBuffer = Buffer.from(JSON.stringify(metadata), 'utf8');
  const contentBuffer = await toBuffer(content);

  const chunks = [
    createMultipartPartHeader(
      boundary,
      'metadata',
      'application/json; charset=utf-8',
    ),
    metadataBuffer,
    Buffer.from('\r\n', 'utf8'),
    createMultipartPartHeader(boundary, 'file', contentType, 'file'),
    contentBuffer,
    Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8'),
  ];

  const bodyBuffer = Buffer.concat(chunks);

  return {
    getBoundary() {
      return boundary;
    },
    getLengthSync() {
      return bodyBuffer.length;
    },
    getBuffer() {
      return bodyBuffer;
    },
  };
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
  const now = Math.floor(Date.now() / 1000);
  const credentials = await this.getCredentials(credentialsType);
  const privateKey = formatPrivateKey(credentials['privateKey'] as string);
  const privateKeyId = credentials['privateKeyId'] as string | undefined;

  credentials['email'] = ((credentials['email'] as string) || '').trim();

  const options: IHttpRequestOptions = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: signJwt(
        {
          iss: credentials['email'],
          sub: credentials['delegatedEmail'] || credentials['email'],
          scope: scopes.join(' '),
          aud: 'https://oauth2.googleapis.com/token',
          iat: now,
          exp: now + 3600,
        },
        privateKey,
        privateKeyId,
      ),
    },
    url: 'https://oauth2.googleapis.com/token',
    json: true,
  };

  return this.helpers.httpRequestWithAuthentication.call(
    this,
    credentialsType,
    options,
  );
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

  return this.helpers.httpRequestWithAuthentication.call(
    this,
    credentialsType,
    {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${access_token}`,
      },
    },
  );
}
