import type {
  ICredentialDataDecryptedObject,
  ICredentialType,
  IHttpRequestOptions,
  INodeProperties,
} from 'n8n-workflow';

export type SentryIoDSNApiCredential = ICredentialDataDecryptedObject & {
  projectId: string;
  dsn: string;
};

import * as crypto from 'crypto';

export class SentryIoDSNApi implements ICredentialType {
  name = 'sentryIoDSNApi';

  displayName = 'Sentry.io DSN';

  documentationUrl =
    'https://docs.sentry.io/product/sentry-basics/concepts/dsn-explainer/';

  properties: INodeProperties[] = [
    {
      displayName: 'Project ID',
      name: 'projectId',
      required: true,
      type: 'string',
      default: undefined,
    },
    {
      displayName: 'DSN',
      name: 'dsn',
      required: true,
      type: 'string',
      typeOptions: { password: true },
      default: undefined,
    },
  ];

  async authenticate(
    credentials: ICredentialDataDecryptedObject,
    requestOptions: IHttpRequestOptions,
  ): Promise<IHttpRequestOptions> {
    const envelopeHeader = JSON.stringify({
      dsn: credentials['dsn'],
      sdk: {
        name: 'skriptfabrik.javascript.n8n',
        version: '0.1.0',
      },
      sent_at: new Date().toISOString(),
      event_id: crypto.randomUUID(),
    });

    return Object.assign(requestOptions, {
      baseURL: 'https://sentry.io',
      method: 'POST',
      headers: {
        'content-type': 'application/x-sentry-envelope',
      },
      body: `${envelopeHeader}\n${requestOptions.body}`,
    });
  }
}
