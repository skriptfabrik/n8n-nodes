import { IHttpRequestOptions } from 'n8n-workflow';
import {
  SentryIoDSNApi,
  SentryIoDSNApiCredential,
} from './SentryIoDSNApi.credentials';

import * as crypto from 'crypto';

jest.mock('crypto');

describe('SentryIoDSNApi', () => {
  let credentials: SentryIoDSNApiCredential;

  let sentryIoDSNApi: SentryIoDSNApi;

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 5, 6));
  });

  beforeEach(() => {
    credentials = {
      projectId: '_project_id_',
      dsn: '_dsn_',
    };

    sentryIoDSNApi = new SentryIoDSNApi();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(sentryIoDSNApi).toBeDefined();
  });

  it('should extend the request options with authentication and resource related data', async () => {
    jest
      .mocked(crypto)
      .randomUUID.mockReturnValueOnce('00000000-0000-0000-0000-000000000000');

    const envelopeHeader = JSON.stringify({
      dsn: '_dsn_',
      sdk: {
        name: 'skriptfabrik.javascript.n8n',
        version: '0.1.0',
      },
      sent_at: new Date(jest.now()).toISOString(),
      event_id: '00000000-0000-0000-0000-000000000000',
    });

    const requestOptions: IHttpRequestOptions = {
      url: '_url_',
      body: '_body_',
    };

    const result = await sentryIoDSNApi.authenticate(
      credentials,
      requestOptions,
    );

    expect(result).toEqual({
      baseURL: 'https://sentry.io',
      url: '_url_',
      method: 'POST',
      headers: {
        'content-type': 'application/x-sentry-envelope',
      },
      body: `${envelopeHeader}\n_body_`,
    });
  });
});
