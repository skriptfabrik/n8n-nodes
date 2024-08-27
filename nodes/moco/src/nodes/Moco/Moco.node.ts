import type {
  IDataObject,
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
  NodeApiError,
  NodeParameterValue,
} from 'n8n-workflow';
import type {
  Activity,
  ActivityParameters,
  ActivityFilters,
  Company,
  CompanyParameters,
  CompanyFilters,
  Deal,
  Project,
  ProjectParameters,
  ProjectTask,
  Unit,
  User,
  UserParameters,
  UserFilters,
} from '../../api';
import {
  createUTCStringFromNodeParameter,
  createParametersFromNodeParameter,
  mocoApiRequest,
  mocoApiRequestAllItems,
} from './GenericFunctions';
import { userFields, userOperations } from './UserDescription';
import { activityFields, activityOperations } from './ActivityDescription';
import { companyFields, companyOperations } from './CompanyDescription';
import { projectFields, projectOperations } from './ProjectDescription';

export class Moco implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'MOCO',
    name: 'moco',
    icon: 'file:moco.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Consume MOCO API',
    defaults: {
      name: 'MOCO',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'mocoApi',
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
            name: 'Activity',
            value: 'activity',
          },
          {
            name: 'Company',
            value: 'company',
          },
          {
            name: 'Project',
            value: 'project',
          },
          {
            name: 'User',
            value: 'user',
          },
        ],
        default: 'user',
      },
      ...activityOperations,
      ...activityFields,
      ...companyOperations,
      ...companyFields,
      ...projectOperations,
      ...projectFields,
      ...userOperations,
      ...userFields,
    ],
  };

  methods = {
    loadOptions: {
      async listCompanies(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        const companies: Company[] = await mocoApiRequestAllItems.call(
          this,
          undefined,
          'GET',
          '/companies',
        );

        for (const company of companies) {
          returnData.push({
            name: company.name,
            value: company.id,
          });
        }

        return returnData.sort((a, b) => a.name.localeCompare(b.name));
      },
      async listCustomers(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        const companies: Company[] = await mocoApiRequestAllItems.call(
          this,
          undefined,
          'GET',
          '/companies',
          { qs: { type: 'customer' } },
        );

        for (const company of companies) {
          returnData.push({
            name: company.name,
            value: company.id,
          });
        }

        return returnData.sort((a, b) => a.name.localeCompare(b.name));
      },
      async listLeads(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        const deals: Deal[] = await mocoApiRequestAllItems.call(
          this,
          undefined,
          'GET',
          '/deals',
        );

        for (const deal of deals) {
          returnData.push({
            name: deal.name,
            value: deal.id,
          });
        }

        return returnData.sort((a, b) => a.name.localeCompare(b.name));
      },
      async listProjects(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        const projects: Project[] = await mocoApiRequestAllItems.call(
          this,
          undefined,
          'GET',
          '/projects',
        );

        for (const project of projects) {
          returnData.push({
            name: `${project.customer.name} > ${project.name}`,
            value: project.id,
          });
        }

        return returnData.sort((a, b) => a.name.localeCompare(b.name));
      },
      async listProjectTasks(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        const projectId =
          (this.getCurrentNodeParameter('projectId') as number) || undefined;

        if (projectId === undefined) {
          const projects: Project[] = await mocoApiRequestAllItems.call(
            this,
            undefined,
            'GET',
            '/projects',
          );

          for (const project of projects) {
            for (const projectTask of project.tasks) {
              returnData.push({
                name: `${project.customer.name} > ${project.name} > ${projectTask.name}`,
                value: projectTask.id,
              });
            }
          }
        } else {
          const projectTasks: ProjectTask[] = await mocoApiRequestAllItems.call(
            this,
            undefined,
            'GET',
            `/projects/${projectId}/tasks`,
          );

          for (const projectTask of projectTasks) {
            returnData.push({
              name: projectTask.name,
              value: projectTask.id,
            });
          }
        }

        return returnData.sort((a, b) => a.name.localeCompare(b.name));
      },
      async listTeams(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        const units: Unit[] = await mocoApiRequestAllItems.call(
          this,
          undefined,
          'GET',
          '/units',
        );

        for (const unit of units) {
          returnData.push({
            name: unit.name,
            value: unit.id,
          });
        }

        return returnData.sort((a, b) => a.name.localeCompare(b.name));
      },
      async listUsers(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        const users: User[] = await mocoApiRequestAllItems.call(
          this,
          undefined,
          'GET',
          '/users',
        );

        for (const user of users) {
          returnData.push({
            name: `${user.firstname} ${user.lastname}`,
            value: user.id,
          });
        }

        return returnData.sort((a, b) => a.name.localeCompare(b.name));
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
        if (resource === 'activity') {
          if (operation === 'create') {
            const impersonateUserId =
              (this.getNodeParameter('impersonateUserId', item) as string) ||
              undefined;

            const body: ActivityParameters = {
              date: this.getNodeParameter('date', item) as string,
              project_id: this.getNodeParameter('projectId', item) as number,
              task_id: this.getNodeParameter('taskId', item) as number,
              seconds: this.getNodeParameter('seconds', item) as number,
              description: this.getNodeParameter('description', item) as string,
              ...createParametersFromNodeParameter.call(
                this,
                'additionalFields',
                item,
                ['billable', 'tag', 'remoteService', 'remoteId', 'remoteUrl'],
              ),
            };

            responseData = (await mocoApiRequest.call(
              this,
              item,
              'POST',
              '/activities',
              { impersonateUserId, body },
            )) as Activity;
          }

          if (operation === 'delete') {
            const activityId = this.getNodeParameter('activityId', item);

            responseData = (await mocoApiRequest.call(
              this,
              item,
              'DELETE',
              `/activities/${activityId}`,
            )) as never;
          }

          if (operation === 'get') {
            const activityId = this.getNodeParameter('activityId', item);

            responseData = (await mocoApiRequest.call(
              this,
              item,
              'GET',
              `/activities/${activityId}`,
            )) as Activity;
          }

          if (operation === 'list') {
            const returnAll = this.getNodeParameter('returnAll', item);

            const qs: ActivityFilters = {
              ...(returnAll
                ? {}
                : {
                    limit:
                      (this.getNodeParameter('limit', item) as number) ||
                      undefined,
                    ids:
                      (this.getNodeParameter('ids', item) as string) ||
                      undefined,
                    updated_after: createUTCStringFromNodeParameter.call(
                      this,
                      'updatedAfter',
                      item,
                    ),
                  }),
              ...createParametersFromNodeParameter.call(
                this,
                'additionalFields',
                item,
                [
                  'from',
                  'to',
                  'userId',
                  'projectId',
                  'taskId',
                  'companyId',
                  'term',
                  'sortBy',
                ],
              ),
            };

            responseData = (await mocoApiRequestAllItems.call(
              this,
              item,
              'GET',
              '/activities',
              { qs },
            )) as Activity[];
          }

          if (operation === 'update') {
            const activityId = this.getNodeParameter('activityId', item);

            const impersonateUserId =
              (this.getNodeParameter('impersonateUserId', item) as string) ||
              undefined;

            const body: ActivityParameters = {
              date: this.getNodeParameter('date', item) as string,
              project_id: this.getNodeParameter('projectId', item) as number,
              task_id: this.getNodeParameter('taskId', item) as number,
              seconds: this.getNodeParameter('seconds', item) as number,
              description: this.getNodeParameter('description', item) as string,
              ...createParametersFromNodeParameter.call(
                this,
                'additionalFields',
                item,
                ['billable', 'tag', 'remoteService', 'remoteId', 'remoteUrl'],
              ),
            };

            responseData = (await mocoApiRequest.call(
              this,
              item,
              'PUT',
              `/activities/${activityId}`,
              { impersonateUserId, body },
            )) as User;
          }
        }

        if (resource === 'company') {
          if (operation === 'create' || operation === 'update') {
            const type = this.getNodeParameter(
              'type',
              item,
            ) as CompanyParameters['type'];

            let typeSpecificParameters = {};

            const additionalFields = [
              'countryCode',
              'vatIdentifier',
              'alternativeCorrespondenceLanguage',
              'website',
              'fax',
              'phone',
              'email',
              'billingEmailCc',
              'address',
              'info',
              'customProperties',
              'tags',
              'footer',
            ];

            if (type === 'customer') {
              typeSpecificParameters = {
                currency: this.getNodeParameter('currency', item) as string,
                identifier: this.getNodeParameter('identifier', item) as string,
              };

              additionalFields.push(
                'customerTax',
                'defaultInvoiceDueDays',
                'debitNumber',
              );
            }

            if (type === 'supplier') {
              additionalFields.push('iban', 'supplierTax', 'creditNumber');
            }

            const additionalFieldsParameters =
              createParametersFromNodeParameter.call(
                this,
                'additionalFields',
                item,
                additionalFields,
              );

            // Patch custom properties to be in the correct format
            if (additionalFieldsParameters.custom_properties) {
              additionalFieldsParameters.custom_properties = (
                additionalFieldsParameters.custom_properties.values as {
                  key: string;
                  value: string;
                }[]
              ).reduce<
                Record<
                  string,
                  NodeParameterValue | NodeParameterValue[] | object
                >
              >((properties, { key, value }) => {
                properties[key] = value;
                return properties;
              }, {});
            }

            const body: CompanyParameters = {
              name: this.getNodeParameter('name', item) as string,
              type,
              ...typeSpecificParameters,
              ...additionalFieldsParameters,
            };

            let companyId = undefined;
            if (operation === 'update') {
              companyId = this.getNodeParameter('companyId', item) as number;
            }

            responseData = (await mocoApiRequest.call(
              this,
              item,
              operation === 'create' ? 'POST' : 'PUT',
              operation === 'create' ? '/companies' : `/companies/${companyId}`,
              {
                body,
              },
            )) as Company;
          }

          if (operation === 'delete') {
            const companyId = this.getNodeParameter('companyId', item);

            responseData = (await mocoApiRequest.call(
              this,
              item,
              'DELETE',
              `/companies/${companyId}`,
            )) as never;
          }

          if (operation === 'get') {
            const companyId = this.getNodeParameter('companyId', item);

            responseData = (await mocoApiRequest.call(
              this,
              item,
              'GET',
              `/companies/${companyId}`,
            )) as Company;
          }

          if (operation === 'list') {
            const returnAll = this.getNodeParameter('returnAll', item);

            const qs: CompanyFilters = {
              ...(returnAll
                ? {}
                : {
                    limit:
                      (this.getNodeParameter('limit', item) as number) ||
                      undefined,
                    ids:
                      (this.getNodeParameter('ids', item) as string) ||
                      undefined,
                    updated_after: createUTCStringFromNodeParameter.call(
                      this,
                      'updatedAfter',
                      item,
                    ),
                  }),
              ...createParametersFromNodeParameter.call(
                this,
                'additionalFields',
                item,
                ['type', 'tags', 'identifier', 'term', 'sortBy'],
              ),
            };

            responseData = (await mocoApiRequestAllItems.call(
              this,
              item,
              'GET',
              '/companies',
              { qs },
            )) as Company[];
          }
        }

        if (resource === 'project') {
          if (operation === 'create') {
            const body: ProjectParameters = {
              name: this.getNodeParameter('name', item) as string,
              currency: this.getNodeParameter('currency', item) as string,
              start_date: this.getNodeParameter('startDate', item) as string,
              finish_date: this.getNodeParameter('finishDate', item) as string,
              fixed_price: this.getNodeParameter('fixedPrice', item) as boolean,
              retainer: this.getNodeParameter('retainer', item) as boolean,
              leader_id: this.getNodeParameter('leaderId', item) as number,
              customer_id: this.getNodeParameter('customerId', item) as number,
              budget_monthly: this.getNodeParameter(
                'budgetMonthly',
                item,
              ) as number,
              identifier: this.getNodeParameter('identifier', item) as string,
              ...createParametersFromNodeParameter.call(
                this,
                'additionalFields',
                item,
                [
                  'coLeaderId',
                  'dealId',
                  'billingAddress',
                  'billingEmailTo',
                  'billingEmailCc',
                  'billingNotes',
                  'settingIncludeTimeReport',
                  'billingVariant',
                  'hourlyRate',
                  'budget',
                  'budgetExpenses',
                  'tags',
                  'customProperties',
                  'info',
                ],
              ),
            };

            responseData = (await mocoApiRequest.call(
              this,
              item,
              'POST',
              '/projects',
              {
                body,
              },
            )) as Project;
          }

          if (operation === 'delete') {
            const projectId = this.getNodeParameter('projectId', item);

            responseData = (await mocoApiRequest.call(
              this,
              item,
              'DELETE',
              `/projects/${projectId}`,
            )) as never;
          }

          if (operation === 'get') {
            const projectId = this.getNodeParameter('projectId', item);

            responseData = (await mocoApiRequest.call(
              this,
              item,
              'GET',
              `/projects/${projectId}`,
            )) as Project;
          }

          if (operation === 'list') {
            const returnAll = this.getNodeParameter('returnAll', item);

            const qs: UserFilters = {
              ...(returnAll
                ? {}
                : {
                    limit:
                      (this.getNodeParameter('limit', item) as number) ||
                      undefined,
                    ids:
                      (this.getNodeParameter('ids', item) as string) ||
                      undefined,
                    updated_after: createUTCStringFromNodeParameter.call(
                      this,
                      'updatedAfter',
                      item,
                    ),
                  }),
              ...createParametersFromNodeParameter.call(
                this,
                'additionalFields',
                item,
                [
                  'includeArchived',
                  'includeCompany',
                  'leaderId',
                  'companyId',
                  'createdFrom',
                  'createdTo',
                  'updatedFrom',
                  'updatedTo',
                  'tags',
                  'identifier',
                  'retainer',
                  'projectGroupId',
                  'sortBy',
                ],
              ),
            };

            responseData = (await mocoApiRequestAllItems.call(
              this,
              item,
              'GET',
              '/projects',
              { qs },
            )) as Project[];
          }

          if (operation === 'update') {
            const projectId = this.getNodeParameter('projectId', item);

            const body: ProjectParameters = {
              name: this.getNodeParameter('name', item) as string,
              currency: this.getNodeParameter('currency', item) as string,
              start_date: this.getNodeParameter('startDate', item) as string,
              finish_date: this.getNodeParameter('finishDate', item) as string,
              fixed_price: this.getNodeParameter('fixedPrice', item) as boolean,
              retainer: this.getNodeParameter('retainer', item) as boolean,
              leader_id: this.getNodeParameter('leaderId', item) as number,
              customer_id: this.getNodeParameter('customerId', item) as number,
              budget_monthly: this.getNodeParameter(
                'budgetMonthly',
                item,
              ) as number,
              identifier: this.getNodeParameter('identifier', item) as string,
              ...createParametersFromNodeParameter.call(
                this,
                'additionalFields',
                item,
                [
                  'coLeaderId',
                  'dealId',
                  'billingAddress',
                  'billingEmailTo',
                  'billingEmailCc',
                  'billingNotes',
                  'settingIncludeTimeReport',
                  'billingVariant',
                  'hourlyRate',
                  'budget',
                  'budgetExpenses',
                  'tags',
                  'customProperties',
                  'info',
                ],
              ),
            };

            responseData = (await mocoApiRequest.call(
              this,
              item,
              'PUT',
              `/projects/${projectId}`,
              { body },
            )) as Project;
          }
        }

        if (resource === 'user') {
          if (operation === 'create') {
            const body: UserParameters = {
              firstname: this.getNodeParameter('firstname', item) as string,
              lastname: this.getNodeParameter('lastname', item) as string,
              email: this.getNodeParameter('email', item) as string,
              password: this.getNodeParameter('password', item) as string,
              unit_id: this.getNodeParameter('unitId', item) as number,
              ...createParametersFromNodeParameter.call(
                this,
                'additionalFields',
                item,
                ['active', 'external'],
              ),
            };

            responseData = (await mocoApiRequest.call(
              this,
              item,
              'POST',
              '/users',
              {
                body,
              },
            )) as User;
          }

          if (operation === 'delete') {
            const userId = this.getNodeParameter('userId', item);

            responseData = (await mocoApiRequest.call(
              this,
              item,
              'DELETE',
              `/users/${userId}`,
            )) as never;
          }

          if (operation === 'get') {
            const userId = this.getNodeParameter('userId', item);

            responseData = (await mocoApiRequest.call(
              this,
              item,
              'GET',
              `/users/${userId}`,
            )) as User;
          }

          if (operation === 'list') {
            const returnAll = this.getNodeParameter('returnAll', item);

            const qs: UserFilters = {
              ...(returnAll
                ? {}
                : {
                    limit:
                      (this.getNodeParameter('limit', item) as number) ||
                      undefined,
                    ids:
                      (this.getNodeParameter('ids', item) as string) ||
                      undefined,
                    updated_after: createUTCStringFromNodeParameter.call(
                      this,
                      'updatedAfter',
                      item,
                    ),
                  }),
              ...createParametersFromNodeParameter.call(
                this,
                'additionalFields',
                item,
                ['includeArchived', 'sortBy'],
              ),
            };

            responseData = (await mocoApiRequestAllItems.call(
              this,
              item,
              'GET',
              '/users',
              { qs },
            )) as User[];
          }

          if (operation === 'update') {
            const userId = this.getNodeParameter('userId', item);

            const body: UserParameters = {
              firstname: this.getNodeParameter('firstname', item) as string,
              lastname: this.getNodeParameter('lastname', item) as string,
              email: this.getNodeParameter('email', item) as string,
              password: this.getNodeParameter('password', item) as string,
              unit_id: this.getNodeParameter('unitId', item) as number,
              ...createParametersFromNodeParameter.call(
                this,
                'additionalFields',
                item,
                ['active', 'external'],
              ),
            };

            responseData = (await mocoApiRequest.call(
              this,
              item,
              'PUT',
              `/users/${userId}`,
              { body },
            )) as User;
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
