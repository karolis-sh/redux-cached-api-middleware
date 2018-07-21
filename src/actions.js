import { RSAA } from 'redux-api-middleware';

import cache from './cache/index';
import config from './config';
import * as types from './actionTypes';
import * as selectors from './selectors';

export const callAPI = ({ cache: cacheOption, ...restOptions }) => async (
  dispatch,
  getState
) => {
  const action = Object.assign(
    { types: [] },
    config.getDefaultEvent(),
    restOptions
  );

  if (cacheOption && cacheOption.key) {
    const keyState = selectors.getKeyState(getState(), cacheOption.key);
    action.types = [
      { type: types.FETCH_START, meta: { cache: cacheOption } },
      { type: types.FETCH_SUCCESS, meta: { cache: cacheOption } },
      { type: types.FETCH_ERROR, meta: { cache: cacheOption } },
    ];

    if (
      cacheOption.strategy &&
      !cache
        .get(cacheOption.strategy.type)
        .shouldFetch({ state: keyState, strategy: cacheOption.strategy })
    ) {
      return undefined;
    }
  }

  return dispatch({ [RSAA]: action });
};
