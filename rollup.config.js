import path from 'path'
import ResolvePlugin from '@rollup/plugin-node-resolve'
import TypescriptPlugin from '@rollup/plugin-typescript'
import CommonjsPlugin from '@rollup/plugin-commonjs'

const __dirname = path.resolve()

//extensions

const extensions = ['.js', '.ts']

//plugins

const resolvePlugin = ResolvePlugin({
  extensions,
})

const commonjsPlugin = CommonjsPlugin()

const tsPlugin = TypescriptPlugin({
  tsconfig: path.resolve(__dirname, './tsconfig.json'),
})

const plugins = [resolvePlugin, commonjsPlugin, tsPlugin]

//base config

const baseConfig = {
  input: './src/index.ts',
  plugins,
}

//output type

const outputType = [
  {
    file: './dist/index.umd.js',
    name: 'index',
    format: 'umd',
  },
  {
    file: './dist/index.mjs',
    name: 'index',
    format: 'esm',
  },
]

//export

export default outputType.map((e) =>
  Object.assign({}, baseConfig, { output: e })
)
