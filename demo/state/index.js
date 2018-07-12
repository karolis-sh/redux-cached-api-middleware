import { createStore, combineReducers, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';

import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(
  combineReducers({
    temp: (state = {}) => state,
  }),
  composeWithDevTools(applyMiddleware(apiMiddleware))
);

export { store };
