import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import { persistStore, persistCombineReducers } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import storage from 'redux-persist/lib/storage';

import * as cachedApi from '../es';

const persistConfig = {
  key: 'test',
  storage,
};

const store = createStore(
  persistCombineReducers(persistConfig, {
    [cachedApi.constants.NAME]: cachedApi.reducer,
  }),
  composeWithDevTools(applyMiddleware(thunk, apiMiddleware))
);

const persistor = persistStore(store);

export { store, persistor };
