import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'babel-polyfill';
import 'whatwg-fetch';

import App, { init } from './App';
import { store } from './state';
import './index.css';

init();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
