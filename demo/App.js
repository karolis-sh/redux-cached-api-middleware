import React from 'react';
import * as cachedApi from 'redux-cached-api-middleware';

import Header from './Header';
import Information from './Information';
import ResourceLoader from './ResourceLoader';
import Footer from './Footer';

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
    <div className="flex flex-col h-full overflow-hidden overflow-y-auto">
      <Header />
      <div className="container mx-auto flex-1">
        <Information />

        <div className="mb-4 overflow-x-auto px-4">
          <ResourceLoader
            url="https://api.github.com/users/reduxjs/repos"
            cache={{
              key: 'GET/reduxjs/repos',
              strategy: cachedApi.cache
                .get(cachedApi.constants.CACHE_TYPES.TTL)
                .buildStrategy({ ttl: 10 * 60 * 1000 }), // 10 minutes
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
