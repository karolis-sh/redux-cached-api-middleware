import { CACHE_TYPES } from '../constants';

export const type = CACHE_TYPES.TTL_SUCCESS;

export const buildStrategy = ({ ttl }) => ({ type, ttl });

export const shouldFetch = ({ state, strategy }) => {
  if (state && strategy) {
    if (state.fetching) return false;
    if (state.fetched && !state.error) {
      return state.timestamp + strategy.ttl <= Date.now();
    }
  }
  return true;
};
