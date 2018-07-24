import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify-es';

export default {
    input: './src/index.ts',

    output: [
      {
        file: './lib/plugin.js',
        format: 'cjs',
      },
      {
        file: './lib/plugin.es.js',
        format: 'es',
      },
    ],

    plugins: [
        typescript({
          tsconfig: './src/tsconfig.json',
        }),
        uglify(),
    ]
}