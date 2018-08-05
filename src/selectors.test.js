import { NAME } from './constants';
import { DEFAULT_KEY_STATE } from './reducer';
import * as selectors from './selectors';

describe('selectors', () => {
  it('should handle invalid state', () => {
    expect(selectors.getKeyState(null, null)).toBeUndefined();
    expect(selectors.getResult(null, null)).toBeUndefined();
  });

  it('should return default values for simple fields', () => {
    const key = 'GET/stuff';
    const state = {};
    expect(selectors.isFetching(state, key)).toEqual(
      DEFAULT_KEY_STATE.fetching
    );
    expect(selectors.hasFetched(state, key)).toEqual(DEFAULT_KEY_STATE.fetched);
    expect(selectors.isError(state, key)).toEqual(DEFAULT_KEY_STATE.error);
    expect(selectors.getTimestamp(state, key)).toEqual(
      DEFAULT_KEY_STATE.timestamp
    );
    expect(selectors.getSuccessPayload(state, key)).toEqual(
      DEFAULT_KEY_STATE.successPayload
    );
    expect(selectors.getErrorPayload(state, key)).toEqual(
      DEFAULT_KEY_STATE.errorPayload
    );
  });

  it('should return key values for simple fields', () => {
    const key = 'GET/stuff';
    const keyState = {
      fetching: false,
      fetched: true,
      error: false,
      timestamp: 123987,
      successPayload: ['hello', 'world'],
      errorPayload: null,
    };
    const state = { [NAME]: { [key]: keyState, otherKey: {} } };
    expect(selectors.isFetching(state, key)).toEqual(keyState.fetching);
    expect(selectors.hasFetched(state, key)).toEqual(keyState.fetched);
    expect(selectors.isError(state, key)).toEqual(keyState.error);
    expect(selectors.getTimestamp(state, key)).toEqual(keyState.timestamp);
    expect(selectors.getSuccessPayload(state, key)).toEqual(
      keyState.successPayload
    );
    expect(selectors.getErrorPayload(state, key)).toEqual(
      keyState.errorPayload
    );
    expect(selectors.getKeyState(state, key)).toEqual(keyState);
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
    expect(selectors.getResult(state, key)).toEqual({
      fetching: keyState.fetching,
      fetched: keyState.fetched,
      error: keyState.error,
      timestamp: keyState.timestamp,
      lastSuccessPayload: keyState.successPayload,
      lastErrorPayload: keyState.errorPayload,
      payload: keyState.successPayload,
    });
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
    expect(selectors.getResult(state, key)).toEqual({
      fetching: keyState.fetching,
      fetched: keyState.fetched,
      error: keyState.error,
      timestamp: keyState.timestamp,
      lastSuccessPayload: keyState.successPayload,
      lastErrorPayload: keyState.errorPayload,
      payload: keyState.errorPayload,
    });
  });
});
