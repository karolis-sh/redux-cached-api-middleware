import { NAME } from './constants';
import * as selectors from './selectors';

describe('selectors', () => {
  it('should handle empty state', () => {
    expect(selectors.getResult(null, null)).toBeUndefined();
    expect(selectors.getResult(null, 'key')).toBeUndefined();
    expect(selectors.getResult({}, 'key')).toBeUndefined();
    expect(selectors.getResult({ [NAME]: {} }, 'key')).toBeUndefined();
  });

  it('should construct result object in success case', () => {
    const key = 'GET/stuff';
    const keyState = {
      fetching: false,
      fetched: true,
      error: false,
      timestamp: 123987,
      successPayload: ['hello', 'world'],
      errorPayload: { not: 'me' },
    };
    const state = { [NAME]: { [key]: keyState, otherKey: {} } };
    expect(selectors.getResult(state, key)).toEqual(keyState);
  });

  it('should construct result object in error case', () => {
    const key = 'GET/stuff';
    const keyState = {
      fetching: false,
      fetched: true,
      error: true,
      timestamp: 123987,
      successPayload: ['hello', 'world'],
      errorPayload: { not: 'me' },
    };
    const state = { [NAME]: { [key]: keyState, otherKey: {} } };
    expect(selectors.getResult(state, key)).toEqual(keyState);
  });
});
