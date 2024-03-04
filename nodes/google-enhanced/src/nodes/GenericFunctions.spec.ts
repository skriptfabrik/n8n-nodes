import { mockClear, mockDeep } from 'jest-mock-extended';
import * as jwt from 'jsonwebtoken';
import moment from 'moment-timezone';
import type { IExecuteFunctions } from 'n8n-workflow';
import {
  createMultipartForm,
  parseBodyData,
  requestAccessToken,
  requestServiceAccount,
} from './GenericFunctions';

jest.mock('jsonwebtoken');
jest.mock('moment-timezone');

describe('GenericFunctions', () => {
  const executeFunctions = mockDeep<IExecuteFunctions>();
  const mockedJwt = jest.mocked(jwt);
  const mockedMoment = jest.mocked(moment);
  const momentInstance = mockDeep<moment.Moment>();

  beforeEach(() => {
    mockedMoment.mockReturnValue(momentInstance);
  });

  afterEach(() => {
    mockClear(executeFunctions);
    mockClear(mockedMoment);
    mockClear(momentInstance);
  });

  it('should create multipart form', () => {
    const metadata = {
      items: '[{"name": "__test__"}]',
    };

    expect(
      createMultipartForm(metadata, '__content__', 'application/json', 100),
    ).toBeDefined();
  });

  it('should parse body data', () => {
    const bodyData = {
      validItems: '[{"name": "__test__"}]',
      invalidItems: '{name: "__test__"}',
    };

    expect(
      parseBodyData(bodyData, ['validItems', 'invalidItems', 'undefinedItems']),
    ).toEqual({
      validItems: [{ name: '__test__' }],
      invalidItems: '{name: "__test__"}',
    });
  });

  it('should request access token', () => {
    momentInstance.unix.mockReturnValue(300);
    executeFunctions.getCredentials.calledWith('googleApi').mockResolvedValue({
      email: '__email__',
      privateKey: '__private_key__',
    });
    mockedJwt.sign.mockImplementation(() => '__jwt__');
    executeFunctions.helpers.request.mockResolvedValueOnce({
      access_token: '__access_token__',
    });

    expect(
      requestAccessToken.call(executeFunctions, 'googleApi', [
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/cloud-platform.read-only',
        'https://www.googleapis.com/auth/devstorage.full_control',
        'https://www.googleapis.com/auth/devstorage.read_only',
        'https://www.googleapis.com/auth/devstorage.read_write',
      ]),
    ).resolves.toEqual({
      access_token: '__access_token__',
    });
  });

  it('should request access token with delegated email', () => {
    momentInstance.unix.mockReturnValue(300);
    executeFunctions.getCredentials.calledWith('googleApi').mockResolvedValue({
      delegatedEmail: '__delegated_email__',
      privateKey: '__private_key__',
    });
    mockedJwt.sign.mockImplementation(() => '__jwt__');
    executeFunctions.helpers.request.mockResolvedValueOnce({
      access_token: '__access_token__',
    });

    expect(
      requestAccessToken.call(executeFunctions, 'googleApi', [
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/cloud-platform.read-only',
        'https://www.googleapis.com/auth/devstorage.full_control',
        'https://www.googleapis.com/auth/devstorage.read_only',
        'https://www.googleapis.com/auth/devstorage.read_write',
      ]),
    ).resolves.toEqual({
      access_token: '__access_token__',
    });
  });

  it('should request service account', () => {
    const returnData = {
      kind: 'storage#bucket',
      selfLink: 'https://www.googleapis.com/storage/v1/b/__bucket__',
      id: '__bucket__',
      name: '__bucket__',
      projectNumber: '1234567890',
      metageneration: '2',
      location: 'EU',
      storageClass: 'STANDARD',
      etag: 'CAI=',
      timeCreated: '2024-02-26T12:29:08.082Z',
      updated: '2024-02-26T12:55:47.601Z',
      iamConfiguration: {
        bucketPolicyOnly: {
          enabled: true,
          lockedTime: '2024-05-26T12:29:08.082Z',
        },
        uniformBucketLevelAccess: {
          enabled: true,
          lockedTime: '2024-05-26T12:29:08.082Z',
        },
        publicAccessPrevention: 'enforced',
      },
      locationType: 'multi-region',
      rpo: 'DEFAULT',
    };

    momentInstance.unix.mockReturnValue(300);
    executeFunctions.getCredentials.calledWith('googleApi').mockResolvedValue({
      email: '__email__',
      privateKey: '__private_key__',
    });
    mockedJwt.sign.mockImplementation(() => '__jwt__');
    executeFunctions.helpers.request.mockResolvedValueOnce({
      access_token: '__access_token__',
    });
    executeFunctions.helpers.request.mockResolvedValueOnce(returnData);

    expect(
      requestServiceAccount.call(
        executeFunctions,
        'googleApi',
        {
          baseURL: 'https://storage.googleapis.com/storage/v1',
          url: '/b/__bucket__',
        },
        [
          'https://www.googleapis.com/auth/cloud-platform',
          'https://www.googleapis.com/auth/cloud-platform.read-only',
          'https://www.googleapis.com/auth/devstorage.full_control',
          'https://www.googleapis.com/auth/devstorage.read_only',
          'https://www.googleapis.com/auth/devstorage.read_write',
        ],
      ),
    ).resolves.toEqual(returnData);
  });
});
