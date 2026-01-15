import { devicesOperations, devicesFields } from './Descriptions/DevicesDescription';
import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

export class HeadwindMdmNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Headwind MDM',
    name: 'headwindMdm',
    icon: 'file:../../icons/HeadwindMDM.svg',
    group: ['transform'],
    version: 1,
    documentationUrl: 'https://srv.h-mdm.com/swagger-ui/',
    subtitle: '={{ $parameter["resource"] + ": " + $parameter["operation"] }}',
    description: 'Consume Headwind MDM API',
    defaults: {
      name: 'Headwind MDM',
    },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: 'headwindMdmApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Device',
            value: 'device',
          },
        ],
        default: 'device',
        required: true,
      },
      ...devicesFields,
      ...devicesOperations
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return []
  }
}
