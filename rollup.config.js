import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.js',
    external: ['react'],

    output: [{
      name: 'index',
      file: pkg.main,
      format: 'umd',
      globals: {
        react: 'React',
      },
    }, {
      name: 'index',
      file: pkg.esnext,
      format: 'es',
    }],
    plugins: [
      resolve(), // so Rollup can find `ms`
      babel({
        exclude: 'node_modules/**',
      }),
      commonjs(), // so Rollup can convert `ms` to an ES module
    ],
  },
];
