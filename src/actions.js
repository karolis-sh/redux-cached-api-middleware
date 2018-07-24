import { RSAA } from 'redux-api-middleware';

import cacheStrategies from './cache';
import config from './config';
import * as types from './actionTypes';
import * as selectors from './selectors';

export const invalidateCache = () => ({ type: types.INVALIDATE_CACHE });

export const callAPI = ({ cache, ...restOptions }) => async (
  dispatch,
  getState
) => {
  const action = Object.assign(
    { types: [] },
    config.getDefaultEvent(),
    restOptions
  );

  if (cache && cache.key) {
    const keyState = selectors.getKeyState(getState(), cache.key);
    action.types = [
      { type: types.FETCH_START, meta: { cache } },
      { type: types.FETCH_SUCCESS, meta: { cache } },
      { type: types.FETCH_ERROR, meta: { cache } },
    ];

    if (
      cache.strategy &&
      !cacheStrategies
        .get(cache.strategy.type)
        .shouldFetch({ state: keyState, strategy: cache.strategy })
    ) {
      return undefined;
    }

    if (
      cache.shouldFetch &&
      !cache.shouldFetch({ state: keyState, strategy: cache.strategy })
    ) {
      return undefined;
    }
  }

  return dispatch({ [RSAA]: action });
};
