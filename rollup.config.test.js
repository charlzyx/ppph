import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import serve from 'rollup-plugin-serve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';

export default [
  // browser-friendly UMD build
  {
    input: 'test/index.js',
    output: {
      name: 'bundle',
      file: 'dist/bundle.js',
      format: 'umd',
      sourcemap: 'inline',
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      resolve(),
      babel({
        exclude: 'node_modules/**',
      }),
      commonjs({
        include: ['node_modules/**'],
        exclude: ['node_modules/process-es6/**'],
        namedExports: {
          'node_modules/react/index.js': [
            'Children',
            'Component',
            'PureComponent',
            'createElement',
            'createRef',
            'forwardRef',
          ],
        },
      }),
      serve({
        open: true,
        contentBase: ['dist', 'test', 'src'],
        historyApiFallback: true,
      }),
    ],
  },
];
