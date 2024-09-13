import { createCanvas } from 'canvas';
import JsBarcode, {
  BaseOptions,
  Code128Options,
  Ean13Options,
  NodeOptions,
} from 'jsbarcode';
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';

export class Barcode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Barcode',
    name: 'barcode',
    icon: 'file:icons/Barcode.svg',
    group: ['transform'],
    version: 1,
    description: 'Create a Barcode image',
    defaults: {
      name: 'Barcode',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
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
            displayName: 'Width Of A Single Bar',
            name: 'width',
            type: 'number',
            typeOptions: {
              minValue: 1,
              numberStepSize: 1,
            },
            default: 2,
          },
          {
            displayName: 'Height Of The Barcode',
            name: 'height',
            type: 'number',
            typeOptions: {
              minValue: 1,
              numberStepSize: 1,
            },
            default: 100,
          },
          {
            displayName: 'Display Value',
            name: 'displayValue',
            type: 'boolean',
            default: true,
          },
          {
            displayName: 'Overide The Text That Is Displayed',
            name: 'text',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Font Options',
            name: 'fontOptions',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Font Used For The Text In The Generated Barcode',
            name: 'font',
            type: 'string',
            default: 'monospace',
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
            displayName: 'Text Margin',
            name: 'textMargin',
            type: 'number',
            typeOptions: {
              minValue: 1,
              numberStepSize: 1,
            },
            default: 2,
          },
          {
            displayName: 'Font Size',
            name: 'fontSize',
            type: 'number',
            typeOptions: {
              minValue: 1,
              numberStepSize: 1,
            },
            default: 20,
          },
          {
            displayName: 'Background Color',
            name: 'background',
            type: 'color',
            default: '#ffffff',
          },
          {
            displayName: 'Color Of The Bars And The Text',
            name: 'lineColor',
            type: 'color',
            default: '#000000',
          },
          {
            displayName: 'Space Margin Around The Barcode',
            name: 'margin',
            type: 'number',
            typeOptions: {
              minValue: 1,
              numberStepSize: 1,
            },
            default: 10,
          },
          {
            displayName: 'Flat (Only For EAN8/EAN13)',
            name: 'flat',
            type: 'boolean',
            default: false,
          },
        ],
        default: {},
        description: 'The barcode options',
        placeholder: 'Add Option',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const data = this.getNodeParameter('data', 0) as string;
    const output = this.getNodeParameter('output', 0) as string;
    const options = this.getNodeParameter('options', 0) as
      | BaseOptions
      | Code128Options
      | Ean13Options
      | NodeOptions;

    const canvas = createCanvas(0, 0);

    JsBarcode(canvas, data, options);

    const matches = canvas
      .toDataURL()
      .match(/^data:(.+\/.+);base64,(.*)$/) as RegExpMatchArray;

    return this.prepareOutputData([
      {
        json: {
          data: matches[2],
          mimeType: matches[1],
        },
        binary: {
          [output]: await this.helpers.prepareBinaryData(
            Buffer.from(matches[2], 'base64'),
            undefined,
            matches[1],
          ),
        },
      },
    ]);
  }
}
