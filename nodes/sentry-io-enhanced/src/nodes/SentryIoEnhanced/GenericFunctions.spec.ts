import { mockClear, mockDeep } from 'jest-mock-extended';

import type { IExecuteFunctions } from 'n8n-workflow';

import { getOptionsFromNodeParameter } from './GenericFunctions';

describe('GenericFunctions', () => {
  describe('getOptionsFromNodeParameter', () => {
    const executeFunctions = mockDeep<IExecuteFunctions>();

    afterEach(() => {
      mockClear(executeFunctions);
    });

    it('should return an object with the key as the key and the value as the value', () => {
      executeFunctions.getNodeParameter
        .calledWith('tags.values', 0, expect.arrayContaining([]))
        .mockReturnValue([
          {
            key: '_key_',
            value: '_value_',
          },
        ]);

      expect(
        getOptionsFromNodeParameter.call(executeFunctions, 'tags.values', 0),
      ).toEqual({
        _key_: '_value_',
      });
    });
  });
});
