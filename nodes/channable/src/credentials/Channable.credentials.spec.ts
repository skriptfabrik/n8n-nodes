import { Channable } from './Channable.credentials';

describe('Channable', () => {
  let channableCredential: Channable;

  beforeEach(() => {
    channableCredential = new Channable();
  });

  it('should be defined', () => {
    expect(channableCredential).toBeDefined();
  });
});
