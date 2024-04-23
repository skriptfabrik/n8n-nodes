import FormData from 'form-data';
import { mock, mockClear, mockDeep } from 'jest-mock-extended';
import type {
  IBinaryData,
  IExecuteFunctions,
  ILoadOptionsFunctions,
} from 'n8n-workflow';
import { Readable } from 'stream';
import { createMultipartForm, parseBodyData } from '../GenericFunctions';
import { googleApiRequest, googleApiRequestAllItems } from './GenericFunctions';
import { GoogleCloudStorageEnhanced } from './GoogleCloudStorageEnhanced.node';

jest.mock('../GenericFunctions');
jest.mock('./GenericFunctions');

describe('GoogleCloudStorageEnhanced', () => {
  const loadOptionsFunctions = mockDeep<ILoadOptionsFunctions>();
  const executeFunctions = mockDeep<IExecuteFunctions>();
  const mockedCreateMultipartForm = jest.mocked(createMultipartForm);
  const mockedGoogleApiRequest = jest.mocked(googleApiRequest);
  const mockedGoogleApiRequestAllItems = jest.mocked(googleApiRequestAllItems);
  const mockedParseBodyData = jest.mocked(parseBodyData);

  let googleCloudStorageEnhanced: GoogleCloudStorageEnhanced;

  beforeEach(() => {
    googleCloudStorageEnhanced = new GoogleCloudStorageEnhanced();
  });

  afterEach(() => {
    mockClear(loadOptionsFunctions);
    mockClear(executeFunctions);
    mockClear(mockedCreateMultipartForm);
    mockClear(mockedGoogleApiRequest);
    mockClear(mockedGoogleApiRequestAllItems);
    mockClear(mockedParseBodyData);
  });

  it('should be defined', () => {
    expect(googleCloudStorageEnhanced).toBeDefined();
  });

  it('should create a bucket', () => {
    const bucket = {
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
    const jsonArray = [{ json: bucket }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('bucket');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('create');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('createBody', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('projectId', 0)
      .mockReturnValue('__project_id__');
    executeFunctions.getNodeParameter
      .calledWith('enableObjectRetention', 0)
      .mockReturnValue(true);
    executeFunctions.getNodeParameter
      .calledWith('createAcl', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('projection', 0)
      .mockReturnValue('noAcl');

    mockedParseBodyData.mockReturnValue({});
    mockedGoogleApiRequest.mockResolvedValue(bucket);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(mockedGoogleApiRequest).toHaveBeenCalledWith(
      'POST',
      '/b',
      {
        name: '__bucket__',
      },
      {
        project: '__project_id__',
        enableObjectRetention: true,
        projection: 'noAcl',
      },
    );
  });

  it('should delete a bucket', () => {
    const bucket = {};
    const jsonArray = [{ json: bucket }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('bucket');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('delete');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('getFilters', 0)
      .mockReturnValue({});

    mockedGoogleApiRequest.mockResolvedValue(bucket);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(mockedGoogleApiRequest).toHaveBeenCalledWith(
      'DELETE',
      '/b/__bucket__',
      undefined,
      {},
    );
  });

  it('should get a bucket', () => {
    const bucket = {
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
    const jsonArray = [{ json: bucket }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('bucket');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('getFilters', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('projection', 0)
      .mockReturnValue('noAcl');

    mockedGoogleApiRequest.mockResolvedValue(bucket);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(mockedGoogleApiRequest).toHaveBeenCalledWith(
      'GET',
      '/b/__bucket__',
      undefined,
      {
        projection: 'noAcl',
      },
    );
  });

  it('should get all buckets', () => {
    const buckets = [
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
    const jsonArray = buckets.map((json) => ({ json }));
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('bucket');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('getAll');
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(true);
    executeFunctions.getNodeParameter
      .calledWith('projectId', 0)
      .mockReturnValue('__project_id__');
    executeFunctions.getNodeParameter
      .calledWith('prefix', 0)
      .mockReturnValue('');
    executeFunctions.getNodeParameter
      .calledWith('projection', 0)
      .mockReturnValue('noAcl');

    mockedGoogleApiRequestAllItems.mockResolvedValue(buckets);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(mockedGoogleApiRequestAllItems).toHaveBeenCalledWith(
      'GET',
      '/b',
      undefined,
      {
        project: '__project_id__',
        prefix: '',
        projection: 'noAcl',
      },
    );
  });

  it('should get some buckets', () => {
    const buckets = [
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
    const jsonArray = buckets.map((json) => ({ json }));
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('bucket');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('getAll');
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(false);
    executeFunctions.getNodeParameter
      .calledWith('projectId', 0)
      .mockReturnValue('__project_id__');
    executeFunctions.getNodeParameter
      .calledWith('prefix', 0)
      .mockReturnValue('');
    executeFunctions.getNodeParameter
      .calledWith('projection', 0)
      .mockReturnValue('noAcl');

    mockedGoogleApiRequestAllItems.mockResolvedValue(buckets);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(mockedGoogleApiRequestAllItems).toHaveBeenCalledWith(
      'GET',
      '/b',
      undefined,
      {
        project: '__project_id__',
        prefix: '',
        projection: 'noAcl',
        maxResults: 1000,
      },
    );
  });

  it('should get some buckets with full resonse', () => {
    const buckets = [
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
    const jsonArray = buckets.map((json) => ({ json }));
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('bucket');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('getAll');
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(false);
    executeFunctions.getNodeParameter
      .calledWith('projectId', 0)
      .mockReturnValue('__project_id__');
    executeFunctions.getNodeParameter
      .calledWith('prefix', 0)
      .mockReturnValue('');
    executeFunctions.getNodeParameter
      .calledWith('projection', 0)
      .mockReturnValue('full');

    mockedGoogleApiRequestAllItems.mockResolvedValue(buckets);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(mockedGoogleApiRequestAllItems).toHaveBeenCalledWith(
      'GET',
      '/b',
      undefined,
      {
        project: '__project_id__',
        prefix: '',
        projection: 'full',
        maxResults: 200,
      },
    );
  });

  it('should update a bucket', () => {
    const bucket = {
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
    const jsonArray = [{ json: bucket }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('bucket');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('update');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('createBody', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('getFilters', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('createAcl', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('projection', 0)
      .mockReturnValue('noAcl');

    mockedParseBodyData.mockReturnValue({});
    mockedGoogleApiRequest.mockResolvedValue(bucket);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(mockedGoogleApiRequest).toHaveBeenCalledWith(
      'PATCH',
      '/b/__bucket__',
      {},
      {
        projection: 'noAcl',
      },
    );
  });

  it('should create an object from binary stream without mime type', () => {
    const object = {
      kind: 'storage#object',
      id: '__bucket__/__object__/1234567890',
      selfLink:
        'https://www.googleapis.com/storage/v1/b/__bucket__/o/__object__',
      mediaLink:
        'https://storage.googleapis.com/download/storage/v1/b/__bucket__/o/__object__?generation=1234567890&alt=media',
      name: '__object__',
      bucket: '__bucket__',
      generation: '1234567890',
      metageneration: '1',
      contentType: 'application/json',
      storageClass: 'STANDARD',
      size: '15',
      md5Hash: 'govO+HY8G8YW4loGvkuQ/w==',
      crc32c: 'JA/WgA==',
      etag: 'CMHqspap2oQDEAE=',
      timeCreated: '2024-03-04T09:44:35.645Z',
      updated: '2024-03-04T09:44:35.645Z',
      timeStorageClassUpdated: '2024-03-04T09:44:35.645Z',
    };
    const jsonArray = [{ json: object }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('object');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('create');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('objectName', 0)
      .mockReturnValue('__object__');
    executeFunctions.getNodeParameter
      .calledWith('createData', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('createQuery', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('updateProjection', 0)
      .mockReturnValue('noAcl');
    executeFunctions.getNodeParameter
      .calledWith('encryptionHeaders', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('createFromBinary', 0)
      .mockReturnValue(true);
    executeFunctions.getNodeParameter
      .calledWith('createBinaryPropertyName', 0)
      .mockReturnValue('data');
    executeFunctions.helpers.assertBinaryData.mockReturnValue(
      mock<IBinaryData>({
        id: '123',
      }),
    );
    executeFunctions.helpers.getBinaryStream.mockResolvedValue(
      mock<Readable>(),
    );
    executeFunctions.helpers.getBinaryMetadata.mockResolvedValue({
      fileSize: 0,
    });

    const body = mock<FormData>({
      getLengthSync: jest.fn().mockReturnValue(0),
      getBoundary: jest.fn().mockReturnValue('__boundary__'),
    });

    mockedCreateMultipartForm.mockReturnValue(body);
    mockedParseBodyData.mockReturnValue({});
    mockedGoogleApiRequest.mockResolvedValue(object);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);
  });

  it('should create an object from binary stream with mime type', () => {
    const object = {
      kind: 'storage#object',
      id: '__bucket__/__object__/1234567890',
      selfLink:
        'https://www.googleapis.com/storage/v1/b/__bucket__/o/__object__',
      mediaLink:
        'https://storage.googleapis.com/download/storage/v1/b/__bucket__/o/__object__?generation=1234567890&alt=media',
      name: '__object__',
      bucket: '__bucket__',
      generation: '1234567890',
      metageneration: '1',
      contentType: 'application/json',
      storageClass: 'STANDARD',
      size: '15',
      md5Hash: 'govO+HY8G8YW4loGvkuQ/w==',
      crc32c: 'JA/WgA==',
      etag: 'CMHqspap2oQDEAE=',
      timeCreated: '2024-03-04T09:44:35.645Z',
      updated: '2024-03-04T09:44:35.645Z',
      timeStorageClassUpdated: '2024-03-04T09:44:35.645Z',
    };
    const jsonArray = [{ json: object }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('object');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('create');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('objectName', 0)
      .mockReturnValue('__object__');
    executeFunctions.getNodeParameter
      .calledWith('createData', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('createQuery', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('updateProjection', 0)
      .mockReturnValue('noAcl');
    executeFunctions.getNodeParameter
      .calledWith('encryptionHeaders', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('createFromBinary', 0)
      .mockReturnValue(true);
    executeFunctions.getNodeParameter
      .calledWith('createBinaryPropertyName', 0)
      .mockReturnValue('data');
    executeFunctions.helpers.assertBinaryData.mockReturnValue(
      mock<IBinaryData>({
        id: '123',
      }),
    );
    executeFunctions.helpers.getBinaryStream.mockResolvedValue(
      mock<Readable>(),
    );
    executeFunctions.helpers.getBinaryMetadata.mockResolvedValue({
      mimeType: 'application/octet-stream',
      fileSize: 0,
    });

    const body = mock<FormData>({
      getLengthSync: jest.fn().mockReturnValue(0),
      getBoundary: jest.fn().mockReturnValue('__boundary__'),
    });

    mockedCreateMultipartForm.mockReturnValue(body);
    mockedParseBodyData.mockReturnValue({});
    mockedGoogleApiRequest.mockResolvedValue(object);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);
  });

  it('should create an object from binary data', () => {
    const object = {
      kind: 'storage#object',
      id: '__bucket__/__object__/1234567890',
      selfLink:
        'https://www.googleapis.com/storage/v1/b/__bucket__/o/__object__',
      mediaLink:
        'https://storage.googleapis.com/download/storage/v1/b/__bucket__/o/__object__?generation=1234567890&alt=media',
      name: '__object__',
      bucket: '__bucket__',
      generation: '1234567890',
      metageneration: '1',
      contentType: 'application/json',
      storageClass: 'STANDARD',
      size: '15',
      md5Hash: 'govO+HY8G8YW4loGvkuQ/w==',
      crc32c: 'JA/WgA==',
      etag: 'CMHqspap2oQDEAE=',
      timeCreated: '2024-03-04T09:44:35.645Z',
      updated: '2024-03-04T09:44:35.645Z',
      timeStorageClassUpdated: '2024-03-04T09:44:35.645Z',
    };
    const jsonArray = [{ json: object }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('object');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('create');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('objectName', 0)
      .mockReturnValue('__object__');
    executeFunctions.getNodeParameter
      .calledWith('createData', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('createQuery', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('updateProjection', 0)
      .mockReturnValue('noAcl');
    executeFunctions.getNodeParameter
      .calledWith('encryptionHeaders', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('createFromBinary', 0)
      .mockReturnValue(true);
    executeFunctions.helpers.assertBinaryData.mockReturnValue(
      mock<IBinaryData>({
        id: undefined,
        data: '',
        mimeType: 'application/octet-stream',
      }),
    );

    const body = mock<FormData>({
      getLengthSync: jest.fn().mockReturnValue(0),
      getBoundary: jest.fn().mockReturnValue('__boundary__'),
    });

    mockedCreateMultipartForm.mockReturnValue(body);
    mockedParseBodyData.mockReturnValue({});
    mockedGoogleApiRequest.mockResolvedValue(object);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(mockedGoogleApiRequest).toHaveBeenCalledWith(
      'POST',
      expect.any(URL),
      body,
      {
        name: '__object__',
        uploadType: 'multipart',
        projection: 'noAcl',
      },
      {
        'Content-Length': 0,
        'Content-Type': `multipart/related; boundary=__boundary__`,
      },
    );
  });

  it('should create an object from string data', () => {
    const object = {
      kind: 'storage#object',
      id: '__bucket__/__object__/1234567890',
      selfLink:
        'https://www.googleapis.com/storage/v1/b/__bucket__/o/__object__',
      mediaLink:
        'https://storage.googleapis.com/download/storage/v1/b/__bucket__/o/__object__?generation=1234567890&alt=media',
      name: '__object__',
      bucket: '__bucket__',
      generation: '1234567890',
      metageneration: '1',
      contentType: 'application/json',
      storageClass: 'STANDARD',
      size: '15',
      md5Hash: 'govO+HY8G8YW4loGvkuQ/w==',
      crc32c: 'JA/WgA==',
      etag: 'CMHqspap2oQDEAE=',
      timeCreated: '2024-03-04T09:44:35.645Z',
      updated: '2024-03-04T09:44:35.645Z',
      timeStorageClassUpdated: '2024-03-04T09:44:35.645Z',
    };
    const jsonArray = [{ json: object }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('object');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('create');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('objectName', 0)
      .mockReturnValue('__object__');
    executeFunctions.getNodeParameter
      .calledWith('createData', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('createQuery', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('updateProjection', 0)
      .mockReturnValue('noAcl');
    executeFunctions.getNodeParameter
      .calledWith('encryptionHeaders', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('createFromBinary', 0)
      .mockReturnValue(false);
    executeFunctions.getNodeParameter
      .calledWith('createContent', 0)
      .mockReturnValue('');

    const body = mock<FormData>({
      getLengthSync: jest.fn().mockReturnValue(0),
      getBoundary: jest.fn().mockReturnValue('__boundary__'),
    });

    mockedCreateMultipartForm.mockReturnValue(body);
    mockedParseBodyData.mockReturnValue({});
    mockedGoogleApiRequest.mockResolvedValue(object);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(mockedGoogleApiRequest).toHaveBeenCalledWith(
      'POST',
      expect.any(URL),
      body,
      {
        name: '__object__',
        uploadType: 'multipart',
        projection: 'noAcl',
      },
      {
        'Content-Length': 0,
        'Content-Type': `multipart/related; boundary=__boundary__`,
      },
    );
  });

  it('should delete an object', () => {
    const object = {};
    const jsonArray = [{ json: object }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('object');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('delete');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('objectName', 0)
      .mockReturnValue('__object__');
    executeFunctions.getNodeParameter
      .calledWith('getParameters', 0)
      .mockReturnValue({});

    mockedGoogleApiRequest.mockResolvedValue(object);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(mockedGoogleApiRequest).toHaveBeenCalledWith(
      'DELETE',
      '/b/__bucket__/o/__object__',
      undefined,
      {},
    );
  });

  it('should get an object', () => {
    const object = {
      kind: 'storage#object',
      id: '__bucket__/__object__/1234567890',
      selfLink:
        'https://www.googleapis.com/storage/v1/b/__bucket__/o/__object__',
      mediaLink:
        'https://storage.googleapis.com/download/storage/v1/b/__bucket__/o/__object__?generation=1234567890&alt=media',
      name: '__object__',
      bucket: '__bucket__',
      generation: '1234567890',
      metageneration: '1',
      contentType: 'application/json',
      storageClass: 'STANDARD',
      size: '15',
      md5Hash: 'govO+HY8G8YW4loGvkuQ/w==',
      crc32c: 'JA/WgA==',
      etag: 'CMHqspap2oQDEAE=',
      timeCreated: '2024-03-04T09:44:35.645Z',
      updated: '2024-03-04T09:44:35.645Z',
      timeStorageClassUpdated: '2024-03-04T09:44:35.645Z',
    };
    const jsonArray = [{ json: object }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('object');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('objectName', 0)
      .mockReturnValue('__object__');
    executeFunctions.getNodeParameter
      .calledWith('getParameters', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('projection', 0)
      .mockReturnValue('noAcl');
    executeFunctions.getNodeParameter
      .calledWith('encryptionHeaders', 0)
      .mockReturnValue({});

    mockedGoogleApiRequest.mockResolvedValue(object);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(mockedGoogleApiRequest).toHaveBeenCalledWith(
      'GET',
      '/b/__bucket__/o/__object__',
      undefined,
      {
        projection: 'noAcl',
      },
      {},
    );
  });

  it('should get all objects', () => {
    const objects = [
      {
        kind: 'storage#object',
        id: '__bucket__/__object__/1234567890',
        selfLink:
          'https://www.googleapis.com/storage/v1/b/__bucket__/o/__object__',
        mediaLink:
          'https://storage.googleapis.com/download/storage/v1/b/__bucket__/o/__object__?generation=1234567890&alt=media',
        name: '__object__',
        bucket: '__bucket__',
        generation: '1234567890',
        metageneration: '1',
        contentType: 'application/json',
        storageClass: 'STANDARD',
        size: '15',
        md5Hash: 'govO+HY8G8YW4loGvkuQ/w==',
        crc32c: 'JA/WgA==',
        etag: 'CMHqspap2oQDEAE=',
        timeCreated: '2024-03-04T09:44:35.645Z',
        updated: '2024-03-04T09:44:35.645Z',
        timeStorageClassUpdated: '2024-03-04T09:44:35.645Z',
      },
    ];
    const jsonArray = objects.map((json) => ({ json }));
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('object');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('getAll');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('listFilters', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('projection', 0)
      .mockReturnValue('noAcl');
    executeFunctions.getNodeParameter
      .calledWith('encryptionHeaders', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(true);
    executeFunctions.getNodeParameter
      .calledWith('maxResults', 0)
      .mockReturnValue(100);

    mockedGoogleApiRequestAllItems.mockResolvedValue(objects);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(mockedGoogleApiRequestAllItems).toHaveBeenCalledWith(
      'GET',
      '/b/__bucket__/o',
      undefined,
      {
        projection: 'noAcl',
      },
    );
  });

  it('should get some objects', () => {
    const objects = [
      {
        kind: 'storage#object',
        id: '__bucket__/__object__/1234567890',
        selfLink:
          'https://www.googleapis.com/storage/v1/b/__bucket__/o/__object__',
        mediaLink:
          'https://storage.googleapis.com/download/storage/v1/b/__bucket__/o/__object__?generation=1234567890&alt=media',
        name: '__object__',
        bucket: '__bucket__',
        generation: '1234567890',
        metageneration: '1',
        contentType: 'application/json',
        storageClass: 'STANDARD',
        size: '15',
        md5Hash: 'govO+HY8G8YW4loGvkuQ/w==',
        crc32c: 'JA/WgA==',
        etag: 'CMHqspap2oQDEAE=',
        timeCreated: '2024-03-04T09:44:35.645Z',
        updated: '2024-03-04T09:44:35.645Z',
        timeStorageClassUpdated: '2024-03-04T09:44:35.645Z',
      },
    ];
    const jsonArray = objects.map((json) => ({ json }));
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('object');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('getAll');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('listFilters', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('projection', 0)
      .mockReturnValue('noAcl');
    executeFunctions.getNodeParameter
      .calledWith('encryptionHeaders', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('returnAll', 0)
      .mockReturnValue(false);
    executeFunctions.getNodeParameter
      .calledWith('maxResults', 0)
      .mockReturnValue(100);

    mockedGoogleApiRequestAllItems.mockResolvedValue(objects);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(mockedGoogleApiRequestAllItems).toHaveBeenCalledWith(
      'GET',
      '/b/__bucket__/o',
      undefined,
      {
        projection: 'noAcl',
        maxResults: 100,
      },
    );
  });
  it('should update an object', () => {
    const object = {
      kind: 'storage#object',
      id: '__bucket__/__object__/1234567890',
      selfLink:
        'https://www.googleapis.com/storage/v1/b/__bucket__/o/__object__',
      mediaLink:
        'https://storage.googleapis.com/download/storage/v1/b/__bucket__/o/__object__?generation=1234567890&alt=media',
      name: '__object__',
      bucket: '__bucket__',
      generation: '1234567890',
      metageneration: '1',
      contentType: 'application/json',
      storageClass: 'STANDARD',
      size: '15',
      md5Hash: 'govO+HY8G8YW4loGvkuQ/w==',
      crc32c: 'JA/WgA==',
      etag: 'CMHqspap2oQDEAE=',
      timeCreated: '2024-03-04T09:44:35.645Z',
      updated: '2024-03-04T09:44:35.645Z',
      timeStorageClassUpdated: '2024-03-04T09:44:35.645Z',
    };
    const jsonArray = [{ json: object }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('object');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('update');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('objectName', 0)
      .mockReturnValue('__object__');
    executeFunctions.getNodeParameter
      .calledWith('updateData', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('metagenAndAclQuery', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('updateProjection', 0)
      .mockReturnValue('noAcl');
    executeFunctions.getNodeParameter
      .calledWith('encryptionHeaders', 0)
      .mockReturnValue({});

    mockedParseBodyData.mockReturnValue({});
    mockedGoogleApiRequest.mockResolvedValue(object);

    executeFunctions.helpers.returnJsonArray.mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData.mockReturnValue(
      executionData,
    );

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(mockedGoogleApiRequest).toHaveBeenCalledWith(
      'PATCH',
      '/b/__bucket__/o/__object__',
      {},
      {
        projection: 'noAcl',
      },
      {},
    );
  });

  it('should return an error', async () => {
    const error = new Error('__error_message__');

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('bucket');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('getFilters', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('projection', 0)
      .mockReturnValue('noAcl');

    jest.mocked(googleApiRequest).mockRejectedValue(error);

    executeFunctions.continueOnFail.mockReturnValue(true);

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([
      [{ json: { error: '__error_message__' }, pairedItem: { item: 0 } }],
    ]);

    expect(googleApiRequest).toHaveBeenCalledWith(
      'GET',
      `/b/__bucket__`,
      undefined,
      { projection: 'noAcl' },
    );
  });

  it('should throw an error', async () => {
    const error = new Error('__error_message__');

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('resource', 0)
      .mockReturnValue('bucket');
    executeFunctions.getNodeParameter
      .calledWith('operation', 0)
      .mockReturnValue('get');
    executeFunctions.getNodeParameter
      .calledWith('bucketName', 0)
      .mockReturnValue('__bucket__');
    executeFunctions.getNodeParameter
      .calledWith('getFilters', 0)
      .mockReturnValue({});
    executeFunctions.getNodeParameter
      .calledWith('projection', 0)
      .mockReturnValue('noAcl');

    jest.mocked(googleApiRequest).mockRejectedValue(error);

    executeFunctions.continueOnFail.mockReturnValue(false);

    expect(
      googleCloudStorageEnhanced.execute.call(executeFunctions),
    ).rejects.toEqual(error);

    expect(googleApiRequest).toHaveBeenCalledWith(
      'GET',
      `/b/__bucket__`,
      undefined,
      { projection: 'noAcl' },
    );
  });
});
