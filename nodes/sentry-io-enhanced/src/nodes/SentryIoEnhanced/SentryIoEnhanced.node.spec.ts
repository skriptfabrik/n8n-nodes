import { mockClear, mockDeep } from 'jest-mock-extended';
import type { IExecuteFunctions } from 'n8n-workflow';
import { SentryIoEnhanced } from './SentryIoEnhanced.node';
import { getOptionsFromNodeParameter } from './GenericFunctions';

jest.mock('./GenericFunctions');

describe('SentryIoEnhanced', () => {
  const executeFunctions = mockDeep<IExecuteFunctions>();

  let sentryIoEnhanced: SentryIoEnhanced;

  beforeEach(() => {
    sentryIoEnhanced = new SentryIoEnhanced();
  });

  afterEach(() => {
    mockClear(executeFunctions);
  });

  it('should be defined', () => {
    expect(sentryIoEnhanced).toBeDefined();
  });

  it('should send a event envelope to Sentry.io', async () => {
    const jsonArray = [{ json: { id: '_sentry_io_event_id_' } }];
    const executionData = jsonArray.map(({ json }) => ({
      json,
      pairedItem: { item: 0 },
    }));

    executeFunctions.getCredentials
      .calledWith('sentryIoDSNApi')
      .mockResolvedValue({
        projectId: '_project_id_',
        dsn: '_dsn_',
      });

    executeFunctions.getWorkflow.mockReturnValue({
      active: true,
      id: '_workflow_id_',
      name: '_workflow_name_',
    });

    executeFunctions.getExecutionId.mockReturnValue('_execution_id_');

    executeFunctions.getInstanceBaseUrl.mockReturnValue(
      'http://localhost:5678/',
    );

    executeFunctions.getNode.mockReturnValue({
      id: '_node_id_',
      name: '_node_name_',
      typeVersion: 1,
      type: '_node_type_',
      position: [0, 0],
      parameters: {},
    });

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('message', 0)
      .mockReturnValue('_message_');

    executeFunctions.getNodeParameter
      .calledWith('level', 0)
      .mockReturnValue('_level_');

    executeFunctions.getNodeParameter
      .calledWith('environment', 0)
      .mockReturnValue('_environment_');

    jest
      .mocked(getOptionsFromNodeParameter)
      .mockReturnValueOnce({ _tag_key_: '_tag_value_' });

    jest
      .mocked(getOptionsFromNodeParameter)
      .mockReturnValueOnce({ _extra_key_: '_extra_value_' });

    const eventPayload = JSON.stringify({
      message: '_message_',
      level: '_level_',
      platform: 'node',
      transaction: 'http://localhost:5678/workflow/_workflow_id_',
      server_name: 'localhost',
      environment: '_environment_',
      tags: {
        workflow_id: '_workflow_id_',
        workflow_name: '_workflow_name_',
        _tag_key_: '_tag_value_',
      },
      extra: {
        execution_id: '_execution_id_',
        execution_url:
          'http://localhost:5678/workflow/_workflow_id_/execution/_execution_id_',
        trigger_name: '_node_name_',
        _extra_key_: '_extra_value_',
      },
    });

    const itemHeaders = JSON.stringify({
      type: 'event',
      length: eventPayload.length,
    });

    executeFunctions.helpers.returnJsonArray
      .calledWith(expect.objectContaining({ id: '_sentry_io_event_id_' }))
      .mockReturnValue(jsonArray);

    executeFunctions.helpers.constructExecutionMetaData
      .calledWith(
        expect.arrayContaining(jsonArray),
        expect.objectContaining({ itemData: { item: 0 } }),
      )
      .mockReturnValue(executionData);

    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith(
        'sentryIoDSNApi',
        expect.objectContaining({
          url: '/api/_project_id_/envelope/',
          body: `${itemHeaders}\n${eventPayload}`,
        }),
      )
      .mockResolvedValue({ id: '_sentry_io_event_id_' });

    await expect(
      sentryIoEnhanced.execute.call(executeFunctions),
    ).resolves.toEqual([executionData]);

    expect(getOptionsFromNodeParameter).toHaveBeenCalledTimes(2);
    expect(getOptionsFromNodeParameter).toHaveBeenNthCalledWith(
      1,
      'tags.values',
      0,
    );
    expect(getOptionsFromNodeParameter).toHaveBeenNthCalledWith(
      2,
      'extra.values',
      0,
    );
  });

  it('should return on error', () => {
    executeFunctions.getCredentials
      .calledWith('sentryIoDSNApi')
      .mockResolvedValue({
        projectId: '_project_id_',
        dsn: '_dsn_',
      });

    executeFunctions.getWorkflow.mockReturnValue({
      active: true,
      id: '_workflow_id_',
      name: '_workflow_name_',
    });

    executeFunctions.getExecutionId.mockReturnValue('_execution_id_');

    executeFunctions.getInstanceBaseUrl.mockReturnValue(
      'http://localhost:5678/',
    );

    executeFunctions.getNode.mockReturnValue({
      id: '_node_id_',
      name: '_node_name_',
      typeVersion: 1,
      type: '_node_type_',
      position: [0, 0],
      parameters: {},
    });

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('options', 0)
      .mockReturnValue({});

    executeFunctions.getNodeParameter
      .calledWith('message', 0)
      .mockReturnValue('_message_');

    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('sentryIoDSNApi', expect.any(Object))
      .mockRejectedValue(new Error('__error_message__'));

    executeFunctions.continueOnFail.mockReturnValue(true);

    expect(sentryIoEnhanced.execute.call(executeFunctions)).resolves.toEqual([
      [{ json: { error: '__error_message__' }, pairedItem: { item: 0 } }],
    ]);
  });

  it('should throw on error', () => {
    executeFunctions.getCredentials
      .calledWith('sentryIoDSNApi')
      .mockResolvedValue({
        projectId: '_project_id_',
        dsn: '_dsn_',
      });

    executeFunctions.getWorkflow.mockReturnValue({
      active: true,
      id: '_workflow_id_',
      name: '_workflow_name_',
    });

    executeFunctions.getExecutionId.mockReturnValue('_execution_id_');

    executeFunctions.getInstanceBaseUrl.mockReturnValue(
      'http://localhost:5678/',
    );

    executeFunctions.getNode.mockReturnValue({
      id: '_node_id_',
      name: '_node_name_',
      typeVersion: 1,
      type: '_node_type_',
      position: [0, 0],
      parameters: {},
    });

    executeFunctions.getInputData.mockReturnValue([
      {
        json: {},
      },
    ]);

    executeFunctions.getNodeParameter
      .calledWith('options', 0)
      .mockReturnValue({});

    executeFunctions.getNodeParameter
      .calledWith('message', 0)
      .mockReturnValue('_message_');

    const error = new Error('__error_message__');

    executeFunctions.helpers.httpRequestWithAuthentication
      .calledWith('sentryIoDSNApi', expect.any(Object))
      .mockRejectedValue(error);

    executeFunctions.continueOnFail.mockReturnValue(false);

    expect(sentryIoEnhanced.execute.call(executeFunctions)).rejects.toEqual(
      error,
    );
  });
});
