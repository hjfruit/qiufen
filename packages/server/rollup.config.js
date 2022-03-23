import ts from 'rollup-plugin-typescript2'
import cjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import pkg from './package.json'

const input = './src/index.ts'

export default [
  {
    input,
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
    ],
  },
  {
    input,
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [dts()],
  },
]
