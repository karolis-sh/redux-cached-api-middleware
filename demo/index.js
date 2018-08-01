import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import registerServiceWorker from './registerServiceWorker';
import 'babel-polyfill';
import 'whatwg-fetch';

import App, { init } from './App';
import { store, persistor } from './state';
import './index.css';

init();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

if (process.env.DEVELOP !== 'true') registerServiceWorker();

if (module.hot) {
  module.hot.accept();
}
