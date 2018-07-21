import { shouldFetch } from './simple';

describe('shouldFetch', () => {
  it('should fetch if no state', () => {
    expect(shouldFetch({})).toBe(true);
    expect(shouldFetch({ state: {} })).toBe(true);
  });

  it('should not fetch if it is fetching', () => {
    expect(shouldFetch({ state: { fetching: true } })).toBe(false);
  });

  it('should not fetch if it has already fetched', () => {
    expect(shouldFetch({ state: { fetched: true } })).toBe(false);
  });
});
