import { CACHE_TYPES } from '../constants';
import cache from '.';

describe('cache', () => {
  it('should be a valid module', () => {
    expect(cache.get(CACHE_TYPES.SIMPLE)).not.toBeUndefined();
    expect(cache.get(CACHE_TYPES.SIMPLE_SUCCESS)).not.toBeUndefined();
    expect(cache.get(CACHE_TYPES.TTL)).not.toBeUndefined();
    expect(cache.get(CACHE_TYPES.TTL_SUCCESS)).not.toBeUndefined();
  });

  it('should trow an error on invalid module', () => {
    expect(() => cache.get()).toThrow();
  });
});
