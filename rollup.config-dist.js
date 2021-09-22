import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import pkg from './package.json';
import progress from 'rollup-plugin-progress';
import styles from 'rollup-plugin-styles';
import svg from 'rollup-plugin-svg';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { visualizer } from 'rollup-plugin-visualizer';

const GetLibraryName = (input) => {
  const matches = input.match(/[a-z]+/gi);
  if (matches && matches.length) {
    return matches
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
      })
      .join('');
  }
  return input;
};

const plugins = [
  progress(),
  peerDepsExternal(),
  styles({
    modules: true,
    minimize: true,
    sourceMap: true
  }),
  typescript({
    typescript: require('typescript'),
    tsconfig: 'tsconfig.build.json'
  }),
  svg()
];

const external = [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(pkg.dependencies || {})];

const config = [
  {
    input: 'src/lib/index.ts',
    output: {
      file: 'dist/index.js',
      // name: `${GetLibraryName(pkg.name)}${pkg.version.replace(/\./g, '')}`,
      name: `${GetLibraryName(pkg.name)}`,
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      ...plugins,
      terser(),
      visualizer({
        filename: 'reports/bundle.html'
      })
    ],
    external
  }
];

export default config;
