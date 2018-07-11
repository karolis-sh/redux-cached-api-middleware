import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import filesize from 'rollup-plugin-filesize';
import babel from 'rollup-plugin-babel';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    { format: 'cjs', file: pkg.main, sourcemap: true },
    { format: 'es', file: pkg.module, sourcemap: true },
  ],
  plugins: [
    peerDepsExternal(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [['@babel/preset-env', { modules: false, loose: true }]],
    }),
    filesize(),
  ],
};
