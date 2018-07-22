import { CACHE_TYPES } from '../constants';

export const type = CACHE_TYPES.SIMPLE_SUCCESS;

export const buildStrategy = () => ({ type });

export const shouldFetch = ({ state }) => {
  if (state) {
    if (state.fetching) return false;
    if (state.fetched && !state.error) return false;
  }
  return true;
};
