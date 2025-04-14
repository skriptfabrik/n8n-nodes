declare module 'n8n-nodes-base/dist/nodes/Google/CloudStorage/BucketDescription' {
  import type { INodeProperties } from 'n8n-workflow';

  export const bucketFields: INodeProperties[];
  export const bucketOperations: INodeProperties[];
}

declare module 'n8n-nodes-base/dist/nodes/Google/CloudStorage/ObjectDescription' {
  import type { INodeProperties } from 'n8n-workflow';

  export const objectFields: INodeProperties[];
  export const objectOperations: INodeProperties[];
}
