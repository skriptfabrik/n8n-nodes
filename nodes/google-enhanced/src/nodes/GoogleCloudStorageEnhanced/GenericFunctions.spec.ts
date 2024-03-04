import { mockClear, mockDeep } from 'jest-mock-extended';
import type { IExecuteFunctions } from 'n8n-workflow';
import { requestServiceAccount } from '../GenericFunctions';
import { googleApiRequest, googleApiRequestAllItems } from './GenericFunctions';

jest.mock('jsonwebtoken');
jest.mock('../GenericFunctions');

describe('GenericFunctions', () => {
  const executeFunctions = mockDeep<IExecuteFunctions>();
  const mockedRequestServiceAccount = jest.mocked(requestServiceAccount);

  afterEach(() => {
    mockClear(executeFunctions);
    mockClear(mockedRequestServiceAccount);
  });

  it('should make an API request with service account to get one item', () => {
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

    executeFunctions.getNodeParameter
      .calledWith('authentication', 0, 'serviceAccount')
      .mockReturnValue('serviceAccount');
    mockedRequestServiceAccount.mockResolvedValue(returnData);

    expect(
      googleApiRequest.call(executeFunctions, 'GET', '/b/__bucket__'),
    ).resolves.toEqual(returnData);

    expect(mockedRequestServiceAccount).toHaveBeenCalledWith(
      'googleApi',
      expect.any(Object),
      [
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/cloud-platform.read-only',
        'https://www.googleapis.com/auth/devstorage.full_control',
        'https://www.googleapis.com/auth/devstorage.read_only',
        'https://www.googleapis.com/auth/devstorage.read_write',
      ],
    );
  });

  it('should make an API request with oAuth2 to get one item', () => {
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

    executeFunctions.getNodeParameter
      .calledWith('authentication', 0, 'serviceAccount')
      .mockReturnValue('oAuth2');
    executeFunctions.helpers.requestOAuth2
      .calledWith('googleApi', expect.any(Object))
      .mockResolvedValue(returnData);

    expect(
      googleApiRequest.call(
        executeFunctions,
        'GET',
        new URL('https://storage.googleapis.com/storage/v1/b/__bucket__'),
        undefined,
        { alt: 'media' },
      ),
    ).resolves.toEqual(returnData);
  });

  it('should make an API request to get all items', () => {
    const returnData = [
      {
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
      },
    ];

    executeFunctions.getNodeParameter
      .calledWith('authentication', 0, 'serviceAccount')
      .mockReturnValue('serviceAccount');
    mockedRequestServiceAccount.mockResolvedValue({ items: returnData });

    expect(
      googleApiRequestAllItems.call(executeFunctions, 'GET', '/b'),
    ).resolves.toEqual(returnData);
  });

  it('should make an API request to get no items', () => {
    executeFunctions.getNodeParameter
      .calledWith('authentication', 0, 'serviceAccount')
      .mockReturnValue('serviceAccount');
    mockedRequestServiceAccount.mockResolvedValue({});

    expect(
      googleApiRequestAllItems.call(executeFunctions, 'GET', '/b'),
    ).resolves.toEqual([]);
  });
});
