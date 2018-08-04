import api from '.';

describe('api', () => {
  it('should export all needed items', () => {
    expect(Object.keys(api)).toEqual([
      'config',
      'constants',
      'cache',
      'actions',
      'reducer',
      'selectors',
    ]);
  });

  it('should not export undefined/null objects', () => {
    expect(Object.values(api).filter(Boolean).length).not.toBe(0);
  });
});
