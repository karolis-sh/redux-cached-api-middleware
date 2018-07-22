import { validateCacheModule } from '../__tests__/utils';
import * as simpleSuccess from './simpleSuccess';

const { shouldFetch } = simpleSuccess;

describe('shouldFetch', () => {
  it('should be a valid module', () => {
    validateCacheModule(simpleSuccess);
  });

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

  it('should fetch if it has already fetched but was error', () => {
    expect(shouldFetch({ state: { fetched: true, error: true } })).toBe(true);
  });
});
