import * as cachedApi from '.';

describe('cachedApi', () => {
  it('should export all needed items', () => {
    expect(Object.keys(cachedApi)).toEqual([
      'config',
      'constants',
      'cache',
      'actions',
      'reducer',
      'selectors',
    ]);
  });

  it('should not export undefined/null objects', () => {
    expect(Object.values(cachedApi).filter(Boolean).length).not.toBe(0);
  });
});
