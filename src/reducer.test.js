import reducer from './reducer';
import * as types from './actionTypes';

// =============================================================================
describe('generic actions', () => {
  const key = 'GET/stuff';
  const otherState = { 'POST/stuff': { hello: 'world', fetching: false } };

  it('should pass through invalid action type', () => {
    expect(reducer(otherState, {})).toEqual(otherState);
  });

  it('should delete all key states with CLEAR_CACHE', () => {
    expect(
      reducer(
        {
          ...otherState,
          [key]: {
            fetching: true,
            fetched: false,
            error: false,
            timestamp: null,
            successPayload: null,
            errorPayload: null,
          },
        },
        { type: types.CLEAR_CACHE }
      )
    ).toEqual({});
  });

  it('should delete key state with CLEAR_CACHE', () => {
    expect(
      reducer(
        {
          ...otherState,
          [key]: {
            fetching: true,
            fetched: false,
            error: false,
            timestamp: null,
            successPayload: null,
            errorPayload: null,
          },
        },
        { type: types.CLEAR_CACHE, payload: key }
      )
    ).toEqual(otherState);
  });

  it('should not remove valid state with INVALIDATE_CACHE', () => {
    expect(reducer(otherState, { type: types.INVALIDATE_CACHE })).toEqual(
      otherState
    );
  });

  it('should remove key state when restored as fetching with INVALIDATE_CACHE', () => {
    expect(
      reducer(
        {
          ...otherState,
          [key]: {
            fetching: true,
            fetched: false,
            error: false,
            timestamp: null,
            successPayload: null,
            errorPayload: null,
          },
        },
        { type: types.INVALIDATE_CACHE }
      )
    ).toEqual(otherState);
  });
});

// =============================================================================
describe('FETCH_START', () => {
  const key = 'GET/stuff';
  const otherState = { 'POST/stuff': { hello: 'world' } };

  it('should initialize on fetching start', () => {
    expect(
      reducer(otherState, { type: types.FETCH_START, meta: { cache: { key } } })
    ).toEqual({
      ...otherState,
      [key]: {
        fetching: true,
        fetched: false,
        error: false,
        timestamp: null,
        successPayload: null,
        errorPayload: null,
      },
    });
  });

  it('should not fully override previous success state', () => {
    expect(
      reducer(
        {
          ...otherState,
          [key]: {
            fetching: false,
            fetched: true,
            error: false,
            timestamp: 1531916966016,
            successPayload: { just: 'fine' },
            errorPayload: null,
          },
        },
        { type: types.FETCH_START, meta: { cache: { key } } }
      )
    ).toEqual({
      ...otherState,
      [key]: {
        fetching: true,
        fetched: true,
        error: false,
        timestamp: 1531916966016,
        successPayload: { just: 'fine' },
        errorPayload: null,
      },
    });
  });

  it('should not fully override previous error state', () => {
    expect(
      reducer(
        {
          ...otherState,
          [key]: {
            fetching: false,
            fetched: true,
            error: true,
            timestamp: 1531916966016,
            successPayload: null,
            errorPayload: { not: 'good' },
          },
        },
        { type: types.FETCH_START, meta: { cache: { key } } }
      )
    ).toEqual({
      ...otherState,
      [key]: {
        fetching: true,
        fetched: true,
        error: true,
        timestamp: 1531916966016,
        successPayload: null,
        errorPayload: { not: 'good' },
      },
    });
  });
});

// =============================================================================
describe('FETCH_SUCCESS', () => {
  const key = 'GET/more-stuff';
  const otherState = { 'POST/it': { hello: 'world' } };

  it('should load data successfully', () => {
    const payload = { hello: 'world' };
    expect(
      reducer(
        {
          ...otherState,
          [key]: {
            fetching: true,
            fetched: false,
            error: false,
            timestamp: null,
            successPayload: null,
            errorPayload: null,
          },
        },
        {
          type: types.FETCH_SUCCESS,
          payload,
          meta: { cache: { key } },
        }
      )
    ).toEqual({
      ...otherState,
      [key]: {
        fetching: false,
        fetched: true,
        error: false,
        timestamp: expect.any(Number),
        successPayload: payload,
        errorPayload: null,
      },
    });
  });

  it('should not change the state if it was not initialized', () => {
    expect(
      reducer(otherState, {
        type: types.FETCH_SUCCESS,
        payload: 1,
        meta: { cache: { key } },
      })
    ).toEqual(otherState);
  });
});

// =============================================================================
describe('FETCH_FAILURE', () => {
  const key = 'GET/more-stuff';
  const otherState = { 'POST/it': { hello: 'world' } };

  it('should handle failure', () => {
    const payload = { no: 'go' };
    expect(
      reducer(
        {
          ...otherState,
          [key]: {
            fetching: true,
            fetched: false,
            error: false,
            timestamp: null,
            successPayload: null,
            errorPayload: null,
          },
        },
        {
          type: types.FETCH_ERROR,
          payload,
          meta: { cache: { key } },
        }
      )
    ).toEqual({
      ...otherState,
      [key]: {
        fetching: false,
        fetched: true,
        error: true,
        timestamp: expect.any(Number),
        successPayload: null,
        errorPayload: payload,
      },
    });
  });

  it('should not change the state if it was not initialized', () => {
    expect(
      reducer(otherState, {
        type: types.FETCH_ERROR,
        payload: 1,
        meta: { cache: { key } },
      })
    ).toEqual(otherState);
  });
});
