import { toBuffer, type RenderOptions } from 'bwip-js';
import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes } from 'n8n-workflow';

const BARCODE_FORMAT_MAP: Record<string, string> = {
  codabar: 'rationalizedCodabar',
  CODE128: 'code128',
  CODE128A: 'code128',
  CODE128B: 'code128',
  CODE128D: 'code128',
  CODE39: 'code39',
  EAN13: 'ean13',
  EAN2: 'ean2',
  EAN5: 'ean5',
  EAN8: 'ean8',
  ITF14: 'itf14',
  MSI10: 'msi',
  MSI1010: 'msi',
  MSI11: 'msi',
  MSI1110: 'msi',
  pharmacode: 'pharmacode',
  UPC: 'upca',
};

function normalizeColor(color?: string): string | undefined {
  if (!color) {
    return undefined;
  }

  return color.replace('#', '');
}

function buildRenderOptions(data: string, options: IDataObject): RenderOptions {
  const renderOptions: RenderOptions = {
    bcid: 'code128',
    text: data,
    includetext: true,
  };

  const format = (options['format'] as string) || 'CODE128';
  renderOptions.bcid = BARCODE_FORMAT_MAP[format] ?? 'code128';
  renderOptions.text = ((options['text'] as string) || data).toString();
  renderOptions.includetext = options['displayValue'] !== false;

  if (typeof options['width'] === 'number') {
    renderOptions.scale = Math.max(1, Math.round(options['width'] as number));
  }

  if (typeof options['height'] === 'number') {
    renderOptions.height = options['height'] as number;
  }

  if (typeof options['fontSize'] === 'number') {
    renderOptions.textsize = options['fontSize'] as number;
  }

  if (typeof options['margin'] === 'number') {
    renderOptions.paddingwidth = options['margin'] as number;
    renderOptions.paddingheight = options['margin'] as number;
  }

  const textAlign = options['textAlign'];
  if (textAlign === 'center' || textAlign === 'left' || textAlign === 'right') {
    renderOptions.textxalign = textAlign;
  }

  const barColor = normalizeColor(options['lineColor'] as string | undefined);
  if (barColor) {
    renderOptions.barcolor = barColor;
  }

  const backgroundColor = normalizeColor(
    options['background'] as string | undefined,
  );
  if (backgroundColor) {
    renderOptions.backgroundcolor = backgroundColor;
  }

  return renderOptions;
}

export class Barcode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Barcode',
    name: 'barcode',
    icon: 'file:../../icons/Barcode.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["name"]}}',
    description: 'Create a Barcode image',
    defaults: {
      name: 'Barcode',
    },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    properties: [
      {
        displayName: 'Data',
        name: 'data',
        type: 'string',
        default: '',
        required: true,
        description: 'The data to encode',
      },
      {
        displayName: 'Output Field Name',
        name: 'output',
        type: 'string',
        default: 'data',
        required: true,
        description:
          'The name of the output field to put the binary file data in',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        options: [
          {
            displayName: 'Background Color',
            name: 'background',
            type: 'color',
            default: '#ffffff',
          },
          {
            displayName: 'Barcode Type',
            name: 'format',
            type: 'options',
            options: [
              {
                name: 'Codabar',
                value: 'codabar',
              },
              {
                name: 'CODE128',
                value: 'CODE128',
              },
              {
                name: 'CODE128 A',
                value: 'CODE128A',
              },
              {
                name: 'CODE128 B',
                value: 'CODE128B',
              },
              {
                name: 'CODE128 C',
                value: 'CODE128D',
              },
              {
                name: 'CODE39',
                value: 'CODE39',
              },
              {
                name: 'EAN-13',
                value: 'EAN13',
              },
              {
                name: 'EAN-2',
                value: 'EAN2',
              },
              {
                name: 'EAN-5',
                value: 'EAN5',
              },
              {
                name: 'EAN-8',
                value: 'EAN8',
              },
              {
                name: 'ITF-14',
                value: 'ITF14',
              },
              {
                name: 'MSI10',
                value: 'MSI10',
              },
              {
                name: 'MSI1010',
                value: 'MSI1010',
              },
              {
                name: 'MSI11',
                value: 'MSI11',
              },
              {
                name: 'MSI1110',
                value: 'MSI1110',
              },
              {
                name: 'Pharmacode',
                value: 'pharmacode',
              },
              {
                name: 'UPC',
                value: 'UPC',
              },
            ],
            default: 'CODE128',
          },
          {
            displayName: 'Color Of The Bars And The Text',
            name: 'lineColor',
            type: 'color',
            default: '#000000',
          },
          {
            displayName: 'Display Value',
            name: 'displayValue',
            type: 'boolean',
            default: true,
          },
          {
            displayName: 'Flat (Only For EAN8/EAN13)',
            name: 'flat',
            type: 'boolean',
            default: false,
          },
          {
            displayName: 'Font Options',
            name: 'fontOptions',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Font Size',
            name: 'fontSize',
            type: 'number',
            default: 20,
          },
          {
            displayName: 'Font Used For The Text In The Generated Barcode',
            name: 'font',
            type: 'string',
            default: 'monospace',
          },
          {
            displayName: 'Height Of The Barcode',
            name: 'height',
            type: 'number',
            default: 100,
          },
          {
            displayName: 'Horizontal Alignment Of The Text',
            name: 'textAlign',
            type: 'options',
            options: [
              {
                name: 'Center',
                value: 'center',
              },
              {
                name: 'Left',
                value: 'left',
              },
              {
                name: 'Right',
                value: 'right',
              },
            ],
            default: 'center',
          },
          {
            displayName: 'Overide The Text That Is Displayed',
            name: 'text',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Space Margin Around The Barcode',
            name: 'margin',
            type: 'number',
            default: 10,
          },
          {
            displayName: 'Text Margin',
            name: 'textMargin',
            type: 'number',
            default: 2,
          },
          {
            displayName: 'Vertical Position Of The Text',
            name: 'textPosition',
            type: 'options',
            options: [
              {
                name: 'Bottom',
                value: 'bottom',
              },
              {
                name: 'Top',
                value: 'top',
              },
            ],
            default: 'bottom',
          },
          {
            displayName: 'Width Of A Single Bar',
            name: 'width',
            type: 'number',
            default: 2,
          },
        ],
        default: {},
        description: 'The barcode options',
        placeholder: 'Add Option',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const returnData: INodeExecutionData[] = [];
    const data = this.getNodeParameter('data', 0) as string;
    const output = this.getNodeParameter('output', 0) as string;
    const options = this.getNodeParameter('options', 0) as IDataObject;

    try {
      const barcodeImageBuffer = await toBuffer(
        buildRenderOptions(data, options),
      );
      const barcodeImageBase64 = barcodeImageBuffer.toString('base64');
      const mimeType = 'image/png';

      returnData.push({
        json: {
          data: barcodeImageBase64,
          mimeType,
        },
        binary: {
          [output]: await this.helpers.prepareBinaryData(
            Buffer.from(barcodeImageBase64, 'base64'),
            undefined,
            mimeType,
          ),
        },
        pairedItem: { item: 0 },
      });
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: (error as NodeApiError).message },
          pairedItem: { item: 0 },
        });
      } else {
        throw new NodeApiError(this.getNode(), error, { itemIndex: 0 });
      }
    }

    return [returnData];
  }
}
