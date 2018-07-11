import { RSAA } from 'redux-api-middleware';

import config from './config';

export const callAPI = apiOptions => {
  const action = Object.assign({}, config.getDefaultEvent(), apiOptions);
  return { [RSAA]: action };
};
