# redux-cached-api-middleware

> A set of helpers and caching utilities on top of redux-api-middleware to make
> working with APIs a breeze.

[![npm version](https://badge.fury.io/js/redux-cached-api-middleware.svg)](https://badge.fury.io/js/redux-cached-api-middleware)
[![Build Status](https://travis-ci.org/buz-zard/redux-cached-api-middleware.svg?branch=master)](https://travis-ci.org/buz-zard/redux-cached-api-middleware)
[![codecov.io](https://codecov.io/gh/buz-zard/redux-cached-api-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/buz-zard/redux-cached-api-middleware)
[![Greenkeeper badge](https://badges.greenkeeper.io/buz-zard/redux-cached-api-middleware.svg)](https://greenkeeper.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Table of Contents

- [Why](#why)
- [Installation](#installation)
- [Usage](#usage)
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

## Usage

`TBD`

## Demos

- [Crypto prices][crypto-demo] ([source code][crypto-demo-src])

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

[crypto-demo]:https://buz-zard.github.io/redux-cached-api-middleware
[crypto-demo-src]:https://github.com/buz-zard/redux-cached-api-middleware/tree/master/demo
[redux-thunk]:https://github.com/reduxjs/redux-thunk
[redux-api-middleware]:https://www.npmjs.com/package/redux-api-middleware
[redux-persist]:https://www.npmjs.com/package/redux-persist
