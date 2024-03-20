import { MocoApi } from './MocoApi.credentials';

describe('MocoApi', () => {
  let api: MocoApi;

  beforeEach(() => {
    api = new MocoApi();
  });

  it('should be defined', () => {
    expect(api).toBeDefined();
  });
});
