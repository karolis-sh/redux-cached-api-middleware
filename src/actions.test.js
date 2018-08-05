import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';

import { NAME, CACHE_TYPES } from './constants';
import config, { resetConfig } from './config';
import * as types from './actionTypes';
import cache from './cache';
import * as simpleCacheMock from './cache/simple';
import { invalidateCache, clearCache, invoke } from './actions';

const middlewares = [thunk, apiMiddleware];
const mockStore = configureStore(middlewares);
const RESPONSE_200_JSON = {
  status: 200,
  headers: {
    'content-type': 'application/json',
  },
};
const RESPONSE_403_JSON = {
  status: 403,
  headers: {
    'content-type': 'application/json',
  },
};

// =============================================================================
describe('generic actions', () => {
  it('should construct a valid invalidateCache object', () => {
    expect(invalidateCache()).toEqual({ type: types.INVALIDATE_CACHE });
    expect(invalidateCache('key-1')).toEqual({
      type: types.INVALIDATE_CACHE,
      payload: 'key-1',
    });
  });

  it('should construct a valid clearCache object', () => {
    expect(clearCache()).toEqual({ type: types.CLEAR_CACHE });
    expect(clearCache('key-2')).toEqual({
      type: types.CLEAR_CACHE,
      payload: 'key-2',
    });
  });
});

// =============================================================================
describe('invoke base features', () => {
  beforeEach(() => {
    resetConfig();
    fetch.resetMocks();
  });

  it('should handle simple RSAA fetch success response', async () => {
    const store = mockStore({});
    const apiResponse = { hello: 'world' };
    fetch.mockResponseOnce(JSON.stringify(apiResponse), RESPONSE_200_JSON);
    await store.dispatch(
      invoke({
        endpoint: 'test.me',
        method: 'GET',
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
      })
    );
    expect(store.getActions()).toEqual([
      { type: 'REQUEST' },
      { type: 'SUCCESS', payload: apiResponse },
    ]);
  });

  it('should handle simple RSAA fetch error response', async () => {
    const store = mockStore({});
    const apiResponse = { hello: 'world' };
    fetch.mockResponseOnce(JSON.stringify(apiResponse), RESPONSE_403_JSON);
    await store.dispatch(
      invoke({
        endpoint: 'test.me',
        method: 'GET',
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
      })
    );
    expect(store.getActions()).toEqual([
      { type: 'REQUEST' },
      { type: 'FAILURE', error: true, payload: expect.anything() },
    ]);
    expect(Object.keys(store.getActions()[1].payload)).toEqual([
      'name',
      'status',
      'statusText',
      'response',
      'message',
    ]);
    expect(store.getActions()[1].payload.name).toEqual('ApiError');
    expect(store.getActions()[1].payload.message).toEqual('403 - Forbidden');
    expect(store.getActions()[1].payload.response).toEqual(apiResponse);
  });

  it('should re-use default event', async () => {
    config.DEFAULT_EVENT = {
      method: 'GET',
      endpoint: 'test.me',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const store = mockStore({});
    const apiResponse = { hello: 'world' };
    fetch.mockResponseOnce(JSON.stringify(apiResponse), RESPONSE_200_JSON);
    await store.dispatch(
      invoke({ method: 'POST', types: ['REQUEST', 'SUCCESS', 'FAILURE'] })
    );
    expect(store.getActions()).toEqual([
      { type: 'REQUEST' },
      { type: 'SUCCESS', payload: apiResponse },
    ]);
  });
});

// =============================================================================
describe('invoke cache features', () => {
  simpleCacheMock.shouldFetch = jest.fn();

  beforeEach(() => {
    resetConfig();
    fetch.resetMocks();
    config.DEFAULT_EVENT = {
      method: 'GET',
      endpoint: 'test.me',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    simpleCacheMock.shouldFetch.mockReset();
  });

  it('should handle fetch error', async () => {
    const store = mockStore({});
    const apiResponse = { hello: 'world' };
    const cacheOption = {
      key: 'GET/stuff',
      strategy: cache.get(CACHE_TYPES.SIMPLE).buildStrategy(),
    };
    simpleCacheMock.shouldFetch.mockReturnValueOnce(true);
    fetch.mockResponseOnce(JSON.stringify(apiResponse), RESPONSE_403_JSON);
    await store.dispatch(invoke({ cache: cacheOption }));
    expect(store.getActions()).toEqual([
      { type: types.FETCH_START, meta: { cache: cacheOption } },
      {
        type: types.FETCH_ERROR,
        error: true,
        meta: { cache: cacheOption },
        payload: expect.anything(),
      },
    ]);
    expect(Object.keys(store.getActions()[1].payload)).toEqual([
      'name',
      'status',
      'statusText',
      'response',
      'message',
    ]);
    expect(store.getActions()[1].payload.name).toEqual('ApiError');
    expect(store.getActions()[1].payload.message).toEqual('403 - Forbidden');
    expect(store.getActions()[1].payload.response).toEqual(apiResponse);
  });

  it('should call fetch when there is nothing in store', async () => {
    const store = mockStore({});
    const cacheOption = {
      key: 'GET/stuff',
      strategy: cache.get(CACHE_TYPES.SIMPLE).buildStrategy(),
    };
    const apiResponse = { hello: 'world' };
    simpleCacheMock.shouldFetch.mockReturnValueOnce(true);
    fetch.mockResponseOnce(JSON.stringify(apiResponse), RESPONSE_200_JSON);
    await store.dispatch(invoke({ cache: cacheOption }));
    expect(store.getActions()).toEqual([
      { type: types.FETCH_START, meta: { cache: cacheOption } },
      {
        type: types.FETCH_SUCCESS,
        payload: apiResponse,
        meta: { cache: cacheOption },
      },
    ]);
  });

  it('should not call fetch when already cached', async () => {
    const cacheKey = 'GET/stuff';
    const keyState = {
      fetching: false,
      fetched: true,
      error: false,
      timestamp: 1531982586597,
      successPayload: { 1: 2 },
      errorPayload: null,
    };
    const store = mockStore({ [NAME]: { [cacheKey]: keyState } });
    const cacheOption = {
      key: cacheKey,
      strategy: cache.get(CACHE_TYPES.SIMPLE).buildStrategy(),
    };
    simpleCacheMock.shouldFetch.mockReturnValueOnce(false);
    await store.dispatch(invoke({ cache: cacheOption }));
    expect(store.getActions()).toEqual([]);
    expect(simpleCacheMock.shouldFetch.mock.calls.length).toBe(1);
    expect(simpleCacheMock.shouldFetch.mock.calls[0]).toEqual([
      { state: keyState, strategy: cacheOption.strategy },
    ]);
  });

  it('should call fetch when custom shouldFetch returns true', async () => {
    const cacheKey = 'GET/stuff';
    const keyState = {
      fetching: false,
      fetched: true,
      error: false,
      timestamp: 1531982586597,
      successPayload: { hello: 'world' },
      errorPayload: null,
    };
    config.DEFAULT_CACHE_STRATEGY = cache
      .get(CACHE_TYPES.SIMPLE)
      .buildStrategy();
    const store = mockStore({ [NAME]: { [cacheKey]: keyState } });
    const shouldFetchMock = jest.fn();
    const cacheOption = { key: cacheKey, shouldFetch: shouldFetchMock };
    const apiResponse = { hello: 'world' };
    fetch.mockResponseOnce(JSON.stringify(apiResponse), RESPONSE_200_JSON);
    shouldFetchMock.mockReturnValueOnce(true);
    await store.dispatch(invoke({ cache: cacheOption }));
    expect(shouldFetchMock.mock.calls.length).toBe(1);
    expect(shouldFetchMock.mock.calls[0]).toEqual([{ state: keyState }]);
    expect(store.getActions()).toEqual([
      { type: types.FETCH_START, meta: { cache: cacheOption } },
      {
        type: types.FETCH_SUCCESS,
        payload: apiResponse,
        meta: { cache: cacheOption },
      },
    ]);
  });

  it('should not call fetch when custom shouldFetch returns false', async () => {
    const cacheKey = 'GET/stuff';
    const keyState = {
      fetching: false,
      fetched: true,
      error: false,
      timestamp: 1531982586597,
      successPayload: { hello: 'world' },
      errorPayload: null,
    };
    const store = mockStore({ [NAME]: { [cacheKey]: keyState } });
    const shouldFetchMock = jest.fn();
    const cacheOption = { key: cacheKey, shouldFetch: shouldFetchMock };
    shouldFetchMock.mockReturnValueOnce(false);
    await store.dispatch(invoke({ cache: cacheOption }));
    expect(shouldFetchMock.mock.calls.length).toBe(1);
    expect(shouldFetchMock.mock.calls[0]).toEqual([
      { state: keyState, strategy: cacheOption.strategy },
    ]);
    expect(store.getActions()).toEqual([]);
  });

  it('should use DEFAULT_CACHE_STRATEGY from config', async () => {
    const cacheKey = 'GET/stuff';
    const keyState = {
      fetching: false,
      fetched: true,
      error: false,
      timestamp: 1531982586597,
      successPayload: { 1: 2 },
      errorPayload: null,
    };
    const store = mockStore({ [NAME]: { [cacheKey]: keyState } });
    const cacheOption = { key: cacheKey };
    const cacheStrategy = cache.get(CACHE_TYPES.SIMPLE).buildStrategy();
    config.DEFAULT_CACHE_STRATEGY = cacheStrategy;
    simpleCacheMock.shouldFetch.mockReturnValueOnce(false);
    await store.dispatch(invoke({ cache: cacheOption }));
    expect(store.getActions()).toEqual([]);
    expect(simpleCacheMock.shouldFetch.mock.calls.length).toBe(1);
    expect(simpleCacheMock.shouldFetch.mock.calls[0]).toEqual([
      { state: keyState, strategy: cacheStrategy },
    ]);
  });

  it('should use custom shouldFetch instead of cache strategy', async () => {
    const cacheKey = 'GET/stuff';
    const keyState = {
      fetching: false,
      fetched: true,
      error: false,
      timestamp: 1531982586597,
      successPayload: { 1: 2 },
      errorPayload: null,
    };
    const store = mockStore({ [NAME]: { [cacheKey]: keyState } });
    const shouldFetchMock = jest.fn();
    const cacheOption = {
      key: cacheKey,
      shouldFetch: shouldFetchMock,
      strategy: cache.get(CACHE_TYPES.SIMPLE).buildStrategy(),
    };
    const apiResponse = { hello: 'world' };
    fetch.mockResponseOnce(JSON.stringify(apiResponse), RESPONSE_200_JSON);
    shouldFetchMock.mockReturnValueOnce(true);
    await store.dispatch(invoke({ cache: cacheOption }));
    expect(simpleCacheMock.shouldFetch.mock.calls.length).toBe(0);
    expect(shouldFetchMock.mock.calls.length).toBe(1);
    expect(shouldFetchMock.mock.calls[0]).toEqual([{ state: keyState }]);
    expect(store.getActions()).toEqual([
      { type: types.FETCH_START, meta: { cache: cacheOption } },
      {
        type: types.FETCH_SUCCESS,
        payload: apiResponse,
        meta: { cache: cacheOption },
      },
    ]);
  });
});
