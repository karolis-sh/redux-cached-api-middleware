import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    { format: 'cjs', file: pkg.main, sourcemap: true },
    { format: 'es', file: pkg.module, sourcemap: true },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    babel({ exclude: 'node_modules/**', plugins: ['external-helpers'] }),
    process.env.NODE_ENV !== 'development' && terser(),
    filesize(),
  ],
};
