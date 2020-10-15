import { NAME } from './constants';

export const getResult = (state, key) => (state && state[NAME] ? state[NAME][key] : undefined);
