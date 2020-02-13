import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from '@rollup/plugin-json';
import { name } from './package.json';

const plugins = [
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }),
  json(),
  babel({
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }),
];

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/es/index.js',
      format: 'es',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/umd/index.js',
      format: 'umd',
      sourcemap: true,
      name,
    },
    plugins,
  },
];
