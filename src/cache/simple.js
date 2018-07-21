import { CACHE_TYPES } from '../constants';

export const type = CACHE_TYPES.SIMPLE;

export const buildStrategy = () => ({ type });

export const shouldFetch = ({ state }) => {
  if (state && (state.fetching || state.fetched)) return false;
  return true;
};
