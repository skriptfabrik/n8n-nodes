import type { IExecuteFunctions, NodeParameterValue } from 'n8n-workflow';

export function getOptionsFromNodeParameter(
  this: IExecuteFunctions,
  parameterName: 'tags.values' | 'extra.values',
  item: number,
) {
  const options = this.getNodeParameter(parameterName, item, []) as {
    key: string;
    value: NodeParameterValue | NodeParameterValue[] | object;
  }[];

  return options.reduce(
    (
      acc: {
        [key: string]: NodeParameterValue | NodeParameterValue[] | object;
      },
      option,
    ) => {
      acc[option.key] = option.value;

      return acc;
    },
    {},
  );
}
