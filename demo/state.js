import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import { persistStore, persistCombineReducers } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import storage from 'redux-persist/lib/storage';
import cachedApi from 'redux-cached-api-middleware';

const persistConfig = {
  key: 'demo-1',
  storage,
};

const persistanceNormalizer = store => next => action => {
  const result = next(action);
  if (action.type === 'persist/REHYDRATE') {
    store.dispatch(cachedApi.actions.invalidateCache());
  }
  return result;
};

const store = createStore(
  persistCombineReducers(persistConfig, {
    [cachedApi.constants.NAME]: cachedApi.reducer,
  }),
  composeWithDevTools(
    applyMiddleware(thunk, apiMiddleware, persistanceNormalizer)
  )
);

const persistor = persistStore(store);

export { store, persistor };
