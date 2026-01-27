import {
  ApplicationSetting,
  type Application,
  type ApplicationConfigurationLink,
  type ApplicationVersion,
  type ApplicationView,
  type Configuration,
  type DeviceListView,
  type DeviceSearchRequest,
  type DeviceView,
  type Group,
} from '../../types/api';
import type {
  IDataObject,
  IHttpRequestMethods,
  IHttpRequestOptions,
  ICredentialDataDecryptedObject,
  IAllExecuteFunctions,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

interface CredentialData extends ICredentialDataDecryptedObject {
  url: string;
  username: string;
  password: string;
  skipSslCertificateValidation: boolean;
  idToken: string;
}

async function headwindMdmApiRequest<
  T = unknown,
  S extends IDataObject = IDataObject,
  Q extends IDataObject = IDataObject,
>(
  this: IAllExecuteFunctions,
  itemIndex: number | undefined,
  method: IHttpRequestMethods,
  url: string,
  body?: S,
  qs?: Q,
): Promise<T> {
  const { url: baseURL, skipSslCertificateValidation } =
    await this.getCredentials<CredentialData>('headwindMdmApi', itemIndex);

  const requestOptions: IHttpRequestOptions = {
    baseURL: `${baseURL}/rest`,
    url,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method,
    body,
    qs,
    skipSslCertificateValidation,
    json: true,
  };

  const responseBody: { status: string; message: string | null; data: T } =
    await this.helpers.httpRequestWithAuthentication.call(
      this,
      'headwindMdmApi',
      requestOptions,
    );

  if (responseBody.status !== 'OK') {
    throw new NodeApiError(
      this.getNode(),
      {},
      {
        message: responseBody.message ?? 'Unknown error',
        description: JSON.stringify(responseBody.data) as string,
        httpCode: responseBody.status,
        itemIndex,
      },
    );
  }

  return responseBody.data;
}

async function headwindMdmApiGetApplicationConfigurations(
  this: IAllExecuteFunctions,
  id: string,
  options?: { itemIndex?: number },
): Promise<ApplicationConfigurationLink[]> {
  return (headwindMdmApiRequest<ApplicationConfigurationLink[]>).call(
    this,
    options?.itemIndex,
    'GET',
    `/private/applications/configurations/${id}`,
  );
}

export async function headwindMdmApiGetApplication(
  this: IAllExecuteFunctions,
  id: string,
  options?: { embedConfigurations?: boolean; itemIndex?: number },
): Promise<Application> {
  const application = await (headwindMdmApiRequest<Application>).call(
    this,
    options?.itemIndex,
    'GET',
    `/private/applications/${id}`,
  );

  if (options?.embedConfigurations) {
    application.configurations =
      await headwindMdmApiGetApplicationConfigurations.call(this, id, {
        itemIndex: options?.itemIndex,
      });
  } else {
    delete application.configurations;
  }

  return application;
}

export async function headwindMdmApiGetApplications(
  this: IAllExecuteFunctions,
  value?: string,
  options?: { embedConfigurations?: boolean; itemIndex?: number },
): Promise<Application[]> {
  const applications = await (headwindMdmApiRequest<Application[]>).call(
    this,
    options?.itemIndex,
    'GET',
    value
      ? `/private/applications/search/${value}`
      : '/private/applications/search',
  );

  const cache: Record<string, ApplicationConfigurationLink[]> = {};

  for (const application of applications) {
    if (options?.embedConfigurations) {
      const id = String(application.id);

      if (cache[id] === undefined) {
        cache[id] = await headwindMdmApiGetApplicationConfigurations.call(
          this,
          id,
          { itemIndex: options?.itemIndex },
        );
      }

      application.configurations = cache[id];
    } else {
      delete application.configurations;
    }
  }

  return applications;
}

export async function headwindMdmApiGetApplicationVersions(
  this: IAllExecuteFunctions,
  id: string,
  options?: { itemIndex?: number },
): Promise<ApplicationVersion[]> {
  return (headwindMdmApiRequest<ApplicationVersion[]>).call(
    this,
    options?.itemIndex,
    'GET',
    `/private/applications/${id}/versions`,
  );
}

async function headwindMdmApiGetConfigurationApplications(
  this: IAllExecuteFunctions,
  id: string,
  options?: { itemIndex?: number },
): Promise<ApplicationView[]> {
  const applications = await (headwindMdmApiRequest<ApplicationView[]>).call(
    this,
    options?.itemIndex,
    'GET',
    `/private/configurations/applications/${id}`,
  );

  return applications.filter((app) => app.selected);
}

export async function headwindMdmApiGetConfiguration(
  this: IAllExecuteFunctions,
  id: string,
  options?: {
    applicationsFilter?: string;
    embedApplications?: boolean;
    itemIndex?: number;
  },
): Promise<Configuration> {
  const configuration = await (headwindMdmApiRequest<Configuration>).call(
    this,
    options?.itemIndex,
    'GET',
    `/private/configurations/${id}`,
  );

  const applicationsFilter = options?.applicationsFilter;

  if (applicationsFilter) {
    configuration.applicationSettings =
      configuration.applicationSettings?.filter((appSetting) => {
        if (appSetting.applicationPkg === undefined) {
          return false;
        }
        return appSetting.applicationPkg
          .toLowerCase()
          .includes(applicationsFilter.toLowerCase());
      });
  }

  if (options?.embedApplications) {
    configuration.applications =
      await headwindMdmApiGetConfigurationApplications.call(this, id, {
        itemIndex: options?.itemIndex,
      });

    if (applicationsFilter) {
      configuration.applications = configuration.applications.filter((app) => {
        if (app.pkg === undefined) {
          return false;
        }
        return app.pkg.toLowerCase().includes(applicationsFilter.toLowerCase());
      });
    }
  } else {
    delete configuration.applications;
  }

  return configuration;
}

export async function headwindMdmApiGetConfigurations(
  this: IAllExecuteFunctions,
  value?: string,
  options?: {
    applicationsFilter?: string;
    embedApplications?: boolean;
    itemIndex?: number;
  },
): Promise<Configuration[]> {
  const configurations = await (headwindMdmApiRequest<Configuration[]>).call(
    this,
    options?.itemIndex,
    'GET',
    value
      ? `/private/configurations/search/${value}`
      : '/private/configurations/search',
  );

  const applicationsFilter = options?.applicationsFilter;

  if (applicationsFilter) {
    for (const configuration of configurations) {
      configuration.applicationSettings =
        configuration.applicationSettings?.filter((appSetting) => {
          if (appSetting.applicationPkg === undefined) {
            return false;
          }
          return appSetting.applicationPkg
            .toLowerCase()
            .includes(applicationsFilter.toLowerCase());
        });
    }
  }

  const cache: Record<string, ApplicationView[]> = {};

  for (const configuration of configurations) {
    if (options?.embedApplications) {
      const id = String(configuration.id);

      if (cache[id] === undefined) {
        cache[id] = await headwindMdmApiGetConfigurationApplications.call(
          this,
          id,
          { itemIndex: options?.itemIndex },
        );
      }

      if (applicationsFilter) {
        configuration.applications = cache[id].filter((app) => {
          if (app.pkg === undefined) {
            return false;
          }
          return app.pkg
            .toLowerCase()
            .includes(applicationsFilter.toLowerCase());
        });
      } else {
        configuration.applications = cache[id];
      }
    } else {
      delete configuration.applications;
    }
  }

  return configurations;
}

export async function headwindMdmApiUpdateConfiguration(
  this: IAllExecuteFunctions,
  configuration: Configuration,
  options?: { itemIndex?: number },
): Promise<Configuration> {
  return (headwindMdmApiRequest<Configuration>).call(
    this,
    options?.itemIndex,
    'PUT',
    `/private/configurations`,
    configuration,
  );
}

export async function headwindMdmApiGetDevices(
  this: IAllExecuteFunctions,
  value?: string,
  options?: {
    configurationId?: number;
    embedConfiguration?: boolean;
    fastSearch?: boolean;
    groupId?: number;
    itemIndex?: number;
  },
): Promise<DeviceView[]> {
  const responseData: DeviceView[] = [];

  let totalItemsCount = responseData.length;

  let pageNum = 1;

  do {
    const { configurations, devices } = await (headwindMdmApiRequest<
      DeviceListView,
      DeviceSearchRequest
    >).call(this, options?.itemIndex, 'POST', '/private/devices/search', {
      value,
      groupId: options?.groupId,
      configurationId: options?.configurationId,
      pageSize: 50,
      pageNum,
      fastSearch: options?.fastSearch,
    });

    if (devices?.items === undefined) {
      break;
    }

    if (devices?.totalItemsCount === undefined) {
      break;
    }

    if (configurations && options?.embedConfiguration) {
      responseData.push(
        ...devices.items.map(({ configurationId, ...rest }) => ({
          ...rest,
          configuration: configurationId
            ? configurations[String(configurationId)]
            : undefined,
        })),
      );
    } else {
      responseData.push(...devices.items);
    }

    totalItemsCount = devices.totalItemsCount;

    pageNum++;
  } while (responseData.length < totalItemsCount);

  return responseData;
}

export async function headwindMdmApiGetDeviceApplicationSettings(
  this: IAllExecuteFunctions,
  id: string,
  options?: { itemIndex?: number },
): Promise<ApplicationSetting[]> {
  return (headwindMdmApiRequest<ApplicationSetting[]>).call(
    this,
    options?.itemIndex,
    'GET',
    `/private/devices/${id}/applicationSettings`,
  );
}

export async function headwindMdmApiGetGroups(
  this: IAllExecuteFunctions,
  value?: string,
  options?: { itemIndex?: number },
): Promise<Group[]> {
  return (headwindMdmApiRequest<Group[]>).call(
    this,
    options?.itemIndex,
    'GET',
    value ? `/private/groups/search/${value}` : '/private/groups/search',
  );
}
