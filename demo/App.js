import React from 'react';
import * as cachedApi from 'redux-cached-api-middleware';

import ResourceLoader from './ResourceLoader';

export const init = () => {
  cachedApi.config.DEFAULT_EVENT = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
};

function App() {
  return (
    <div className="demo">
      <h3>redux-cached-api-middleware demo</h3>
      <ResourceLoader
        url="https://api.github.com/users/reduxjs/repos"
        cache={{
          key: 'GET/reduxjs/repos',
          strategy: cachedApi.cache
            .get(cachedApi.constants.CACHE_TYPES.TTL)
            .buildStrategy({ ttl: 10 * 1000 }), // 30 seconds
        }}
      />
    </div>
  );
}

export default App;
