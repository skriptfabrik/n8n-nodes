declare module 'n8n-nodes-base/dist/nodes/Clockify/GenericFunctions' {
  import type {
    IExecuteFunctions,
    ILoadOptionsFunctions,
    IPollFunctions,
    IDataObject,
    IHttpRequestMethods,
  } from 'n8n-workflow';

  export const clockifyApiRequest: (
    this: ILoadOptionsFunctions | IPollFunctions | IExecuteFunctions,
    method: IHttpRequestMethods,
    resource: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any = {},
    qs?: IDataObject = {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>;

  export const clockifyApiRequestAllItems: (
    this: ILoadOptionsFunctions | IPollFunctions | IExecuteFunctions,
    method: IHttpRequestMethods,
    resource: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any = {},
    qs?: IDataObject = {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>;
}

declare global {
  interface Window {
    Foo: string;
  }
}
