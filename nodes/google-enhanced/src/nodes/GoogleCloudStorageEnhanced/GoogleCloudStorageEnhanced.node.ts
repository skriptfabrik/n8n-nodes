import {
  bucketFields,
  bucketOperations,
} from 'n8n-nodes-base/dist/nodes/Google/CloudStorage/BucketDescription';
import {
  objectFields,
  objectOperations,
} from 'n8n-nodes-base/dist/nodes/Google/CloudStorage/ObjectDescription';
import {
  BINARY_ENCODING,
  NodeApiError,
  NodeConnectionType,
  type IDataObject,
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeType,
  type INodeTypeDescription,
} from 'n8n-workflow';
import type { Readable } from 'stream';
import { createMultipartForm, parseBodyData } from '../GenericFunctions';
import { googleApiRequest, googleApiRequestAllItems } from './GenericFunctions';

export class GoogleCloudStorageEnhanced implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Google Cloud Storage Enhanced',
    name: 'googleCloudStorageEnhanced',
    icon: 'file:googleCloudStorageEnhanced.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Use the Google Cloud Storage API',
    defaults: {
      name: 'Google Cloud Storage Enhanced',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'googleApi',
        required: true,
        displayOptions: {
          show: {
            authentication: ['serviceAccount'],
          },
        },
      },
      {
        name: 'googleCloudStorageOAuth2Api',
        required: true,
        displayOptions: {
          show: {
            authentication: ['oAuth2'],
          },
        },
      },
    ],
    properties: [
      {
        displayName: 'Authentication',
        name: 'authentication',
        type: 'options',
        options: [
          {
            name: 'Service Account',
            value: 'serviceAccount',
          },
          {
            name: 'OAuth2',
            value: 'oAuth2',
          },
        ],
        default: 'serviceAccount',
      },
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Bucket',
            value: 'bucket',
          },
          {
            name: 'Object',
            value: 'object',
          },
        ],
        default: 'bucket',
      },

      // BUCKET
      ...bucketOperations,
      ...bucketFields,
      {
        displayName: 'Enable Object Retention',
        name: 'enableObjectRetention',
        type: 'boolean',
        displayOptions: {
          show: {
            resource: ['bucket'],
            operation: ['create'],
          },
        },
        default: false,
        description:
          'Whether to permanently enable object retention for this bucket',
      },

      // OBJECT
      ...objectOperations,
      ...objectFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();

    const returnData: INodeExecutionData[] = [];

    let responseData: IDataObject | IDataObject[] = {};

    const resource = this.getNodeParameter('resource', 0);

    const operation = this.getNodeParameter('operation', 0);

    for (let item = 0; item < items.length; item++) {
      try {
        if (resource === 'bucket') {
          const bodyDataFields = [
            'acl',
            'billing',
            'cors',
            'customPlacementConfig',
            'dataLocations',
            'defaultObjectAcl',
            'encryption',
            'iamConfiguration',
            'labels',
            'lifecycle',
            'logging',
            'retentionPolicy',
            'versioning',
            'website',
          ];

          if (operation === 'create') {
            const bucketName = this.getNodeParameter(
              'bucketName',
              item,
            ) as string;
            const createData = this.getNodeParameter(
              'createBody',
              item,
            ) as IDataObject;
            const project = this.getNodeParameter('projectId', item) as string;
            const enableObjectRetention = this.getNodeParameter(
              'enableObjectRetention',
              item,
            ) as boolean;
            const createAcl = this.getNodeParameter(
              'createAcl',
              item,
            ) as IDataObject;
            const projection = this.getNodeParameter(
              'projection',
              item,
            ) as string;

            responseData = await googleApiRequest.call(
              this,
              'POST',
              '/b',
              {
                name: bucketName,
                ...parseBodyData(createData, bodyDataFields),
              },
              {
                project,
                enableObjectRetention,
                ...createAcl,
                projection,
              },
            );
          }

          if (operation === 'delete') {
            const bucketName = this.getNodeParameter(
              'bucketName',
              item,
            ) as string;
            const deleteFilters = this.getNodeParameter(
              'getFilters',
              item,
            ) as IDataObject;

            responseData = await googleApiRequest.call(
              this,
              'DELETE',
              `/b/${bucketName}`,
              undefined,
              deleteFilters,
            );
          }

          if (operation === 'get') {
            const bucketName = this.getNodeParameter(
              'bucketName',
              item,
            ) as string;
            const getFilters = this.getNodeParameter(
              'getFilters',
              item,
            ) as IDataObject;
            const projection = this.getNodeParameter(
              'projection',
              item,
            ) as string;

            responseData = await googleApiRequest.call(
              this,
              'GET',
              `/b/${bucketName}`,
              undefined,
              {
                ...getFilters,
                projection,
              },
            );
          }

          if (operation === 'getAll') {
            const returnAll = this.getNodeParameter(
              'returnAll',
              item,
            ) as boolean;
            const project = this.getNodeParameter('projectId', item) as string;
            const prefix = this.getNodeParameter('prefix', item) as string;
            const projection = this.getNodeParameter(
              'projection',
              item,
            ) as string;

            responseData = await googleApiRequestAllItems.call(
              this,
              'GET',
              '/b',
              undefined,
              {
                project,
                prefix,
                projection,
                ...(!returnAll && {
                  maxResults: projection === 'noAcl' ? 1000 : 200,
                }),
              },
            );
          }

          if (operation === 'update') {
            const bucketName = this.getNodeParameter(
              'bucketName',
              item,
            ) as string;
            const updateData = this.getNodeParameter(
              'createBody',
              item,
            ) as IDataObject;
            const updateFilters = this.getNodeParameter(
              'getFilters',
              item,
            ) as IDataObject;
            const createAcl = this.getNodeParameter(
              'createAcl',
              item,
            ) as IDataObject;
            const projection = this.getNodeParameter(
              'projection',
              item,
            ) as string;

            responseData = await googleApiRequest.call(
              this,
              'PATCH',
              `/b/${bucketName}`,
              parseBodyData(updateData, bodyDataFields),
              {
                ...updateFilters,
                ...createAcl,
                projection,
              },
            );
          }
        }

        if (resource === 'object') {
          const bodyDataFields = ['acl', 'metadata'];

          if (operation === 'create') {
            const bucketName = this.getNodeParameter(
              'bucketName',
              item,
            ) as string;
            const objectName = this.getNodeParameter(
              'objectName',
              item,
            ) as string;
            const createData = this.getNodeParameter(
              'createData',
              item,
            ) as IDataObject;
            const createFilters = this.getNodeParameter(
              'createQuery',
              item,
            ) as IDataObject;
            const projection = this.getNodeParameter(
              'updateProjection',
              item,
            ) as string;
            const encryptionHeaders = this.getNodeParameter(
              'encryptionHeaders',
              item,
            ) as IDataObject;

            // Determine content, content type and known length
            let content: string | Buffer | Readable;
            let contentType: string;
            let knownLength: number;

            const useBinary = this.getNodeParameter(
              'createFromBinary',
              item,
            ) as boolean;

            if (useBinary) {
              const binaryPropertyName = this.getNodeParameter(
                'createBinaryPropertyName',
                item,
              ) as string;

              const binaryData = this.helpers.assertBinaryData(
                item,
                binaryPropertyName,
              );

              if (binaryData.id) {
                content = await this.helpers.getBinaryStream(binaryData.id);
                const binaryMetadata = await this.helpers.getBinaryMetadata(
                  binaryData.id,
                );
                contentType =
                  binaryMetadata.mimeType ?? 'application/octet-stream';
                knownLength = binaryMetadata.fileSize;
              } else {
                content = Buffer.from(binaryData.data, BINARY_ENCODING);
                contentType = binaryData.mimeType;
                knownLength = content.length;
              }
            } else {
              content = this.getNodeParameter('createContent', item) as string;
              contentType =
                (createData['contentType'] as string) || 'text/plain';
              knownLength = content.length;
            }

            const body = createMultipartForm(
              parseBodyData(createData, bodyDataFields),
              content,
              contentType,
              knownLength,
            );

            responseData = await googleApiRequest.call(
              this,
              'POST',
              new URL(
                `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o`,
              ),
              body,
              {
                name: objectName,
                uploadType: 'multipart',
                ...createFilters,
                projection,
              },
              {
                'Content-Length': body.getLengthSync(),
                'Content-Type': `multipart/related; boundary=${body.getBoundary()}`,
                ...encryptionHeaders,
              },
            );
          }

          if (operation === 'delete') {
            const bucketName = this.getNodeParameter(
              'bucketName',
              item,
            ) as string;
            const objectName = this.getNodeParameter(
              'objectName',
              item,
            ) as string;
            const deleteParameters = this.getNodeParameter(
              'getParameters',
              item,
            ) as IDataObject;

            responseData = await googleApiRequest.call(
              this,
              'DELETE',
              `/b/${bucketName}/o/${objectName}`,
              undefined,
              deleteParameters,
            );
          }

          if (operation === 'get') {
            const bucketName = this.getNodeParameter(
              'bucketName',
              item,
            ) as string;
            const objectName = this.getNodeParameter(
              'objectName',
              item,
            ) as string;
            const alt = this.getNodeParameter('alt', item) as string;
            const getParameters = this.getNodeParameter(
              'getParameters',
              item,
            ) as IDataObject;
            const projection = this.getNodeParameter(
              'projection',
              item,
            ) as string;
            const encryptionHeaders = this.getNodeParameter(
              'encryptionHeaders',
              item,
            ) as IDataObject;

            responseData = await googleApiRequest.call(
              this,
              'GET',
              `/b/${bucketName}/o/${objectName}`,
              undefined,
              {
                alt,
                ...getParameters,
                projection,
              },
              encryptionHeaders,
            );
          }

          if (operation === 'getAll') {
            const bucketName = this.getNodeParameter(
              'bucketName',
              item,
            ) as string;
            const listFilters = this.getNodeParameter(
              'listFilters',
              item,
            ) as IDataObject;
            const projection = this.getNodeParameter(
              'projection',
              item,
            ) as string;
            const returnAll = this.getNodeParameter(
              'returnAll',
              item,
            ) as boolean;
            const maxResults = this.getNodeParameter(
              'maxResults',
              item,
            ) as number;

            responseData = await googleApiRequestAllItems.call(
              this,
              'GET',
              `/b/${bucketName}/o`,
              undefined,
              {
                ...listFilters,
                projection,
                ...(!returnAll && {
                  maxResults,
                }),
              },
            );
          }

          if (operation === 'update') {
            const bucketName = this.getNodeParameter(
              'bucketName',
              item,
            ) as string;
            const objectName = this.getNodeParameter(
              'objectName',
              item,
            ) as string;
            const updateData = this.getNodeParameter(
              'updateData',
              item,
            ) as IDataObject;
            const updateFilters = this.getNodeParameter(
              'metagenAndAclQuery',
              item,
            ) as IDataObject;
            const projection = this.getNodeParameter(
              'updateProjection',
              item,
            ) as string;
            const encryptionHeaders = this.getNodeParameter(
              'encryptionHeaders',
              item,
            ) as IDataObject;

            responseData = await googleApiRequest.call(
              this,
              'PATCH',
              `/b/${bucketName}/o/${objectName}`,
              parseBodyData(updateData, bodyDataFields),
              {
                ...updateFilters,
                projection,
              },
              encryptionHeaders,
            );
          }
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData),
          { itemData: { item } },
        );

        returnData.push(...executionData);
      } catch (error: unknown) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as NodeApiError).message },
            pairedItem: { item },
          });
          continue;
        }

        throw error;
      }
    }

    return [returnData];
  }
}
