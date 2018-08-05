import { NAME } from './constants';
import { DEFAULT_KEY_STATE } from './reducer';

const keyValue = (state, key, valueName) => {
  let value;
  if (state && state[NAME] && state[NAME][key]) {
    value = state[NAME][key][valueName];
  }
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
  state && state[NAME] ? state[NAME][key] : undefined;

export const getResult = (state, key) => {
  const keyState = getKeyState(state, key);
  if (!keyState) return undefined;
  const result = {
    fetching: keyState.fetching,
    fetched: keyState.fetched,
    error: keyState.error,
    timestamp: keyState.timestamp,
    lastSuccessPayload: keyState.successPayload,
    lastErrorPayload: keyState.errorPayload,
    payload: keyState.error ? keyState.errorPayload : keyState.successPayload,
  };
  return result;
};
