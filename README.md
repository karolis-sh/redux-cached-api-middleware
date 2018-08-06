# redux-cached-api-middleware

> Redux module that makes working with APIs a breeze.

[![npm version][version-badge]][version]
[![Build Status][build-badge]][build]
[![codecov.io][coverage-badge]][coverage]
[![License: MIT][license-badge]][license]
[![gzip size][gzip-badge]][unpkg-bundle]
[![size][size-badge]][unpkg-bundle]
[![module formats: cjs, es][module-formats-badge]][unpkg-bundle]
[![Greenkeeper badge][greenkeeper-badge]][greenkeeper]
[![code style: prettier][code-style-badge]][code-style]

## Table of Contents

- [Why](#why)
- [Installation](#installation)
- [Example](#example)
- [API](#api)
  - [API Config](#api-config)
    - [DEFAULT_INVOKE_OPTIONS](#DEFAULT_INVOKE_OPTIONS)
    - [DEFAULT_CACHE_STRATEGY](#DEFAULT_CACHE_STRATEGY)
  - [Redux Actions](#redux-actions)
    - [invoke()](#invoke)
    - [invalidateCache()](#invalidatecache)
    - [clearCache()](#clearcache)
  - [Redux Selectors](#redux-selectors)
    - [getResult()](#getresult)
  - [Caching Strategies](#caching-strategies)
- [Demos](#demos)
- [Other Solutions](#other-solutions)
- [References](#references)
- [License](#license)

## Why

Caching API responses can greatly increase UX by saving network
bandwidth and not showing loaders for the same resources all over again while
user navigates the application. You can also create a fluid returning UX in
combination with persistance libraries, e.g., [`redux-persist`][redux-persist].

The [`redux-api-middleware`][redux-api-middleware] library is pretty
standardized and popular way to interact with APIs using redux, that's why it was
chosen as a base for this package.

## Installation

1. Install dependencies:

```bash
$ npm install --save redux-cached-api-middleware redux-api-middleware redux-thunk
```

or

```bash
$ yarn add redux-cached-api-middleware redux-api-middleware redux-thunk
```

<!-- markdownlint-disable MD029 -->
2. Setup `redux`:
<!-- markdownlint-enable MD029 -->

```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import api from 'redux-cached-api-middleware';
import reducers from './reducers';

const store = createStore(
  combineReducers({
    ...reducers,
    [api.constants.NAME]: api.reducer,
  }),
  applyMiddleware(thunk, apiMiddleware)
);
```

## Example

A simple `ExampleApp` component that invokes API endpoint on mount with `TTL_SUCCESS`
cache strategy of 10 minutes. This means that if items were fetched in the past
10 minutes successfully, the cached value will be returned, otherwise new fetch
request will happen.

```js
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from 'redux-cached-api-middleware';
import Items from './Items';
import Error from './Error';

class ExampleApp extends React.Component {
  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    const { result } = this.props;
    if (!result) return null;
    if (result.fetching) return <div>Loading...</div>;
    if (result.error) return <Error data={result.payload} />;
    if (result.payload) return <Items data={result.payload} />;
    return <div>No items</div>;
  }
}

ExampleApp.propTypes = {
  fetchData: PropTypes.func.isRequired,
  result: PropTypes.shape({}),
};

const enhance = connect(
  state => ({
    result: api.selectors.getResult(state, 'GET/my-api.com/items'),
  }),
  dispatch => ({
    fetchData() {
      return dispatch(
        api.actions.invoke({
          method: 'GET',
          headers: { Accept: 'application/json' },
          endpoint: 'https://my-api.com/items/',
          cache: {
            key: 'GET/my-api.com/items',
            strategy: api.cache
              .get(api.constants.CACHE_TYPES.TTL_SUCCESS)
              .buildStrategy({ ttl: 10 * 60 * 1000 }), // 10 minutes
          },
        })
      );
    },
  })
);

export default enhance(ExampleApp);
```

## API

### API Config

#### `DEFAULT_INVOKE_OPTIONS`

The default [redux-api-middleware RSAA options][redux-api-middleware-options] object
that later will be merged when calling every [`invoke`](#invoke) action - e.g.:

```js
api.config.DEFAULT_INVOKE_OPTIONS = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}
```

\* Options get merged using `Object.assign({}, DEFAULT_INVOKE_OPTIONS, invokeOptions)`
in `invoke` action.

#### `DEFAULT_CACHE_STRATEGY`

The default [caching strategy](#caching-strategies) that will be used when
calling every [`invoke`](#invoke) action - e.g.:

```js
api.config.DEFAULT_CACHE_STRATEGY = api.cache
  .get(api.constants.CACHE_TYPES.TTL_SUCCESS)
  .buildStrategy({ ttl: 600000 });
```

### Redux Actions

#### `invoke()`

Call API endpoints anywhere and retrieve data with redux selectors.

```js
dispatch(api.actions.invoke(
  options: InvokeOptions,
));
```

The `invoke` action response will be `undefined` if there was a valid cached
value in redux state, otherwise `invoke` will return `redux-api-middleware` response.

`InvokeOptions` is an extended version of [redux-api-middleware options][redux-api-middleware-options].
You can use `invoke` like an `RSAA` action wrapper without any caching.
To start using caching possibilities you need pass `cache` object. You have to
provide unique `key` value and either a caching `strategy` or `shouldFetch` function.

- Cache `strategy` - use one of pre-defined [caching strategies](#caching-strategies)
  to defined at what state resource is valid or not:

```js
api.actions.invoke({
  method: 'GET',
  headers: { Accept: 'application/json' },
  endpoint: 'https://my-api.com/items/',
  cache: {
    key: 'GET/my-api.com/items',
    strategy: api.cache
      .get(api.constants.CACHE_TYPES.TTL_SUCCESS)
      .buildStrategy({ ttl: 600000 }), // 10 minutes
  },
})
```

- `shouldFetch` function - a custom function to defined when resource valid:

```js
api.actions.invoke({
  method: 'GET',
  headers: { Accept: 'application/json' },
  endpoint: 'https://my-api.com/items/',
  cache: {
    key: 'GET/my-api.com/items',
    shouldFetch({ state: CachedApiState }) {
      // Define your logic when the resource should be re-fetched
      return true;
    }
  },
})
```

\* Check [`getResult` selector docs](#getresult) for `CachedApiState` structure.

#### `invalidateCache()`

If you're restoring redux state from offline storage, there might be some interrupted
fetch requests - which can restore your app in a broken state. You can
invalidate all the cached redux state, or selectively with `cacheKey`.

```js
dispatch(api.actions.invalidateCache(
  cacheKey: ?string // unique cache key
));
```

#### `clearCache()`

Clear all the cached redux state, or selectively with `cacheKey`.

```js
dispatch(api.actions.clearCache(
  cacheKey: ?string // unique cache key
));
```

### Redux Selectors

#### `getResult()`

Select all information about API request.

```js
const response: ?CachedApiState = api.selectors.getResult(
  state: Object, // redux state
  cacheKey: string // unique cache key
);
```

The selected `CachedApiState` object has a structure of:

```js
{
  fetching: boolean, // is fetching in progress
  fetched: boolean, // was any fetch completed
  error: boolean, // was last response an error
  timestamp: ?number, // last response timestamp
  successPayload: ?any, // last success response payload
  errorPayload: ?any, // last error response payload
}
```

\* If `getResult` response is `undefined` it means the API request wasn't
initialized yet.

### Caching Strategies

- `SIMPLE_SUCCESS` - uses previous successful fetch result

```js
const strategy = api.cache
  .get(api.constants.CACHE_TYPES.SIMPLE_SUCCESS)
  .buildStrategy();
```

- `SIMPLE` - uses any previous payload fetch result

```js
const strategy = api.cache
  .get(api.constants.CACHE_TYPES.SIMPLE)
  .buildStrategy();
```

- `TTL_SUCCESS` - uses previous successful fetch result if time to live (TTL)
  was not reached

```js
const strategy = api.cache
  .get(api.constants.CACHE_TYPES.TTL_SUCCESS)
  .buildStrategy({ttl: 1000});
```

- `TTL` - uses any previous fetch result if TTL was not reached

```js
const strategy = api.cache
  .get(api.constants.CACHE_TYPES.TTL)
  .buildStrategy({ttl: 1000});
```

## Demos

- [Crypto prices][crypto-demo] ([source code][crypto-demo-src]) - cached
  API requests that sync with localStorage
- [Demos monorepo][rcam-demos] - various demos using `create-react-app` etc.

## Other Solutions

There are other solutions if `redux-cached-api-middleware` doesn't fit your needs:

- [`redux-cache`](https://github.com/JumboInteractiveLimited/redux-cache)

## References

- [`redux`](https://redux.js.org)
- [`redux-thunk`][redux-thunk]
- [`redux-api-middleware`][redux-api-middleware]
- [`redux-persist`][redux-persist] - sync redux store
  with local (or any other) storage

## License

MIT

[version-badge]: https://badge.fury.io/js/redux-cached-api-middleware.svg
[version]: https://www.npmjs.com/package/redux-cached-api-middleware
[build-badge]: https://travis-ci.org/buz-zard/redux-cached-api-middleware.svg?branch=master
[build]: https://travis-ci.org/buz-zard/redux-cached-api-middleware
[coverage-badge]: https://codecov.io/gh/buz-zard/redux-cached-api-middleware/branch/master/graph/badge.svg
[coverage]: https://codecov.io/gh/buz-zard/redux-cached-api-middleware
[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg
[license]: https://opensource.org/licenses/MIT
[greenkeeper-badge]: https://badges.greenkeeper.io/buz-zard/redux-cached-api-middleware.svg
[greenkeeper]: https://greenkeeper.io/
[code-style-badge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg
[code-style]: https://github.com/prettier/prettier
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/redux-cached-api-middleware/lib/index.js?compression=gzip&label=gzip%20size
[size-badge]: http://img.badgesize.io/https://unpkg.com/redux-cached-api-middleware/lib/index.js?label=size
[module-formats-badge]: https://img.shields.io/badge/module%20formats-cjs%2C%20es-brightgreen.svg
[unpkg-bundle]: https://unpkg.com/redux-cached-api-middleware/lib/

[crypto-demo]:https://buz-zard.github.io/redux-cached-api-middleware
[crypto-demo-src]:https://github.com/buz-zard/redux-cached-api-middleware/tree/master/demo
[rcam-demos]: https://github.com/buz-zard/rcam-demos

[redux-thunk]:https://github.com/reduxjs/redux-thunk
[redux-api-middleware]:https://www.npmjs.com/package/redux-api-middleware
[redux-api-middleware-options]:https://github.com/agraboso/redux-api-middleware#defining-the-api-call
[redux-persist]:https://www.npmjs.com/package/redux-persist
