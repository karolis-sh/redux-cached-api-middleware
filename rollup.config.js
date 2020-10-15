import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    { format: 'cjs', file: pkg.main, sourcemap: true, exports: 'default' },
    {
      format: 'umd',
      file: pkg.unpkg,
      sourcemap: true,
      name: 'ReduxCachedApiMiddleware',
      globals: { 'redux-api-middleware': 'ReduxApiMiddleware' },
    },
  ],
  plugins: [
    peerDepsExternal(),
    nodeResolve(),
    babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
    process.env.NODE_ENV !== 'development' && terser(),
    filesize(),
  ],
};
