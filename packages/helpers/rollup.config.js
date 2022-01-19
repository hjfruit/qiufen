import ts from 'rollup-plugin-typescript2'
import cjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import del from 'rollup-plugin-delete'
import pkg from './package.json'

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    cjs(),
    nodeResolve(),
    ts({
      tsconfigOverride: {
        exclude: ['**/__tests__/**'],
      },
    }),
    del({ targets: 'dist/*', verbose: true }),
  ],
}
