import { NAME } from './constants';
import { DEFAULT_KEY_STATE } from './reducer';

const keyValue = (state, key, valueName) => {
  let value;
  if (state[NAME] && state[NAME][key]) value = state[NAME][key][valueName];
  return typeof value === 'undefined' ? DEFAULT_KEY_STATE[valueName] : value;
};

export const isFetching = (state, key) => keyValue(state, key, 'fetching');
export const hasFetched = (state, key) => keyValue(state, key, 'fetched');
export const isError = (state, key) => keyValue(state, key, 'error');
export const getTimestamp = (state, key) => keyValue(state, key, 'timestamp');
export const getSuccessPayload = (state, key) =>
  keyValue(state, key, 'successPayload');
export const getErrorPayload = (state, key) =>
  keyValue(state, key, 'errorPayload');

export const getKeyState = (state, key) =>
  state[NAME] ? state[NAME][key] : undefined;

export const getResult = (state, key) => {
  if (hasFetched(state, key)) {
    const result = {
      error: isError(state, key),
      timestamp: getTimestamp(state, key),
    };
    result.payload = result.error
      ? getErrorPayload(state, key)
      : getSuccessPayload(state, key);
    return result;
  }
  return undefined;
};
