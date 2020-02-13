import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import { name } from './package.json';

const createPlugins = ({ format }) => [
  replace({
    __DEV__: format === 'umd' ? false : 'process.env.NODE_ENV !== "production"',
  }),
  resolve({
    extensions: ['.js', '.ts'],
  }),
  babel({
    exclude: 'node_modules/**',
    extensions: ['.js', '.ts'],
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
    plugins: createPlugins({ format: 'es' }),
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: createPlugins({ format: 'cjs' }),
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/umd/index.js',
      format: 'umd',
      sourcemap: true,
      name,
    },
    plugins: createPlugins({ format: 'umd' }),
  },
];
