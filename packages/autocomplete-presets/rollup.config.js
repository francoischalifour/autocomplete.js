import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from '@rollup/plugin-json';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/es/index.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve({
        extensions: ['.js', '.ts', '.json'],
      }),
      json(),
      babel({
        exclude: 'node_modules/**',
        extensions: ['.js', '.ts', '.json'],
      }),
    ],
  },
];
