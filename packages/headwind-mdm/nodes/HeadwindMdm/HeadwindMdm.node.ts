import {
  applicationFields,
  applicationOperations,
} from './Descriptions/ApplicationDescription';
import {
  applicationVersionFields,
  applicationVersionOperations,
} from './Descriptions/ApplicationVersionDescription';
import {
  configurationApplicationSettingFields,
  configurationApplicationSettingOperations,
} from './Descriptions/ConfigurationApplicationSettingDescription';
import {
  configurationFields,
  configurationOperations,
} from './Descriptions/ConfigurationDescription';
import {
  deviceApplicationSettingFields,
  deviceApplicationSettingOperations,
} from './Descriptions/DeviceApplicationSettingDescription';
import {
  deviceOperations,
  deviceFields,
} from './Descriptions/DeviceDescription';
import {
  deviceGroupFields,
  deviceGroupOperations,
} from './Descriptions/DeviceGroupDescription';
import {
  headwindMdmApiGetApplication,
  headwindMdmApiGetApplications,
  headwindMdmApiGetApplicationVersions,
  headwindMdmApiGetConfiguration,
  headwindMdmApiGetConfigurations,
  headwindMdmApiGetDeviceApplicationSettings,
  headwindMdmApiGetDevices,
  headwindMdmApiGetGroups,
  headwindMdmApiUpdateConfiguration,
} from './GenericFunctions';
import type {
  IDataObject,
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes } from 'n8n-workflow';

export class HeadwindMdm implements INodeType {
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
            name: 'Application',
            value: 'application',
          },
          {
            name: 'Application Version',
            value: 'applicationVersion',
          },
          {
            name: 'Configuration',
            value: 'configuration',
          },
          {
            name: 'Configuration Application Setting',
            value: 'configurationApplicationSetting',
          },
          {
            name: 'Device',
            value: 'device',
          },
          {
            name: 'Device Application Setting',
            value: 'deviceApplicationSetting',
          },
          {
            name: 'Device Group',
            value: 'deviceGroup',
          },
        ],
        default: 'device',
        required: true,
      },
      ...applicationOperations,
      ...applicationFields,
      ...applicationVersionOperations,
      ...applicationVersionFields,
      ...configurationOperations,
      ...configurationFields,
      ...configurationApplicationSettingOperations,
      ...configurationApplicationSettingFields,
      ...deviceOperations,
      ...deviceFields,
      ...deviceApplicationSettingOperations,
      ...deviceApplicationSettingFields,
      ...deviceGroupOperations,
      ...deviceGroupFields,
    ],
  };

  methods = {
    loadOptions: {
      async listApplications(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        const applications = await headwindMdmApiGetApplications.call(this);

        for (const application of applications) {
          if (application.name === undefined || application.id === undefined) {
            continue;
          }

          returnData.push({
            name: application.name,
            value: application.id,
          });
        }

        return returnData;
      },
      async listConfigurations(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        const configurations = await headwindMdmApiGetConfigurations.call(this);

        for (const configuration of configurations) {
          if (
            configuration.name === undefined ||
            configuration.id === undefined
          ) {
            continue;
          }

          returnData.push({
            name: configuration.name,
            value: configuration.id,
          });
        }

        return returnData;
      },

      async listDevices(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        const devices = await headwindMdmApiGetDevices.call(this);

        for (const device of devices) {
          if (device.number === undefined || device.id === undefined) {
            continue;
          }

          returnData.push({
            name: device.number,
            value: device.id,
          });
        }

        return returnData;
      },
      async listDeviceGroups(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        const groups = await headwindMdmApiGetGroups.call(this);

        for (const group of groups) {
          if (group.name === undefined || group.id === undefined) {
            continue;
          }

          returnData.push({
            name: group.name,
            value: group.id,
          });
        }

        return returnData;
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();

    const returnData: INodeExecutionData[] = [];

    let responseData: IDataObject | IDataObject[] = {};

    const resource = this.getNodeParameter('resource', 0);

    const operation = this.getNodeParameter('operation', 0);

    for (let item = 0; item < items.length; item++) {
      try {
        if (resource === 'application') {
          if (operation === 'search') {
            const value = String(this.getNodeParameter('value', item));
            const options = Object(this.getNodeParameter('options', item));

            responseData = await headwindMdmApiGetApplications.call(
              this,
              value,
              {
                ...options,
                itemIndex: item,
              },
            );
          }

          if (operation === 'get') {
            const applicationId = String(
              this.getNodeParameter('applicationId', item),
            );
            const options = Object(this.getNodeParameter('options', item));

            responseData = await headwindMdmApiGetApplication.call(
              this,
              applicationId,
              {
                ...options,
                itemIndex: item,
              },
            );
          }
        }

        if (resource === 'applicationVersion') {
          if (operation === 'search') {
            const applicationId = String(
              this.getNodeParameter('applicationId', item),
            );
            const version = String(this.getNodeParameter('version', item));

            const applicationVersions =
              await headwindMdmApiGetApplicationVersions.call(
                this,
                applicationId,
                {
                  itemIndex: item,
                },
              );

            responseData = applicationVersions.filter((appVersion) => {
              if (version.length > 0) {
                if (appVersion.version === undefined) {
                  return false;
                }
                return appVersion.version.startsWith(version);
              }
              return true;
            });
          }
        }

        if (resource === 'configuration') {
          if (operation === 'get') {
            const configurationId = String(
              this.getNodeParameter('configurationId', item),
            );
            const options = Object(this.getNodeParameter('options', item));

            responseData = await headwindMdmApiGetConfiguration.call(
              this,
              configurationId,
              { ...options, itemIndex: item },
            );
          }

          if (operation === 'search') {
            const value = String(this.getNodeParameter('value', item));
            const options = Object(this.getNodeParameter('options', item));

            responseData = await headwindMdmApiGetConfigurations.call(
              this,
              value,
              { ...options, itemIndex: item },
            );
          }
        }

        if (resource === 'configurationApplicationSetting') {
          if (operation === 'search') {
            const configurationId = String(
              this.getNodeParameter('configurationId', item),
            );
            const applicationPkg = String(
              this.getNodeParameter('applicationPkg', item),
            );
            const additionalFields = Object(
              this.getNodeParameter('additionalFields', item),
            );

            const configuration = await headwindMdmApiGetConfiguration.call(
              this,
              configurationId,
              { applicationsFilter: applicationPkg, itemIndex: item },
            );

            const { applicationName = '', name = '' } = additionalFields as {
              applicationName?: string;
              name?: string;
            };

            responseData = (configuration.applicationSettings || [])
              .filter((appSetting) => {
                if (applicationName.length > 0) {
                  if (appSetting.applicationName === undefined) {
                    return false;
                  }
                  return appSetting.applicationName
                    .toLowerCase()
                    .includes(applicationName.toLowerCase());
                }
                return true;
              })
              .filter((appSetting) => {
                if (name.length > 0) {
                  if (appSetting.name === undefined) {
                    return false;
                  }
                  return appSetting.name
                    .toLowerCase()
                    .includes(name.toLowerCase());
                }
                return true;
              });
          }

          if (operation === 'update') {
            const configurationId = String(
              this.getNodeParameter('configurationId', item),
            );
            const applicationId = Number(
              this.getNodeParameter('applicationId', item),
            );
            const name = String(this.getNodeParameter('name', item));
            const value = String(this.getNodeParameter('value', item));
            const additionalFields = Object(
              this.getNodeParameter('additionalFields', item),
            );

            const configuration = await headwindMdmApiGetConfiguration.call(
              this,
              configurationId,
              { embedApplications: true, itemIndex: item },
            );

            const index = configuration.applicationSettings?.findIndex(
              (appSetting) =>
                appSetting.applicationId === applicationId &&
                appSetting.name === name,
            );

            if (index === undefined || index < 0) {
              throw new NodeApiError(
                this.getNode(),
                {},
                {
                  message: `Application setting ${name} for application ${applicationId} not found in configuration ${configurationId}`,
                  httpCode: '404',
                  itemIndex: item,
                },
              );
            }

            const { comment } = additionalFields as { comment?: string };

            if (comment !== undefined) {
              configuration.applicationSettings![index].comment = comment;
            }

            configuration.applicationSettings![index].value = value;

            responseData = (
              (
                await headwindMdmApiUpdateConfiguration.call(
                  this,
                  configuration,
                  { itemIndex: item },
                )
              ).applicationSettings || []
            ).filter(
              (appSetting) =>
                appSetting.applicationId === applicationId &&
                appSetting.name === name,
            );
          }
        }

        if (resource === 'device') {
          if (operation === 'search') {
            const value = String(this.getNodeParameter('value', item));
            const options = Object(this.getNodeParameter('options', item));

            responseData = await headwindMdmApiGetDevices.call(this, value, {
              ...options,
              itemIndex: item,
            });
          }
        }

        if (resource === 'deviceApplicationSetting') {
          if (operation === 'search') {
            const deviceId = String(this.getNodeParameter('deviceId', item));
            const applicationPkg = String(
              this.getNodeParameter('applicationPkg', item),
            );

            const deviceApplicationSettings =
              await headwindMdmApiGetDeviceApplicationSettings.call(
                this,
                deviceId,
                { itemIndex: item },
              );

            responseData = deviceApplicationSettings.filter((appSetting) => {
              if (applicationPkg.length > 0) {
                if (appSetting.applicationPkg === undefined) {
                  return false;
                }
                return appSetting.applicationPkg
                  .toLowerCase()
                  .includes(applicationPkg.toLowerCase());
              }
              return true;
            });
          }
        }

        if (resource === 'deviceGroup') {
          if (operation === 'search') {
            const value = String(this.getNodeParameter('value', item));

            responseData = await headwindMdmApiGetGroups.call(this, value, {
              itemIndex: item,
            });
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
