import flow from 'rollup-plugin-flow'
import babel from 'rollup-plugin-babel'
import autoExternal from 'rollup-plugin-auto-external'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import prettier from 'rollup-plugin-prettier'
import path from 'path'

const shebang = '#!/usr/bin/env node'

const plugins = [
  flow({
    pretty: true
  }),
  babel({
    exclude: 'node_modules/**'
  }),
  resolve({
    jsnext: true,
    main: true
  }),
  commonjs(),
  autoExternal({
    builtins: true,
    dependencies: true
  }),
  prettier({
    tabWidth: 2,
    semi: false,
    singleQuote: true
  })
]

export default [
  {
    plugins,
    input: 'src/index.js',
    output: { format: 'cjs', file: 'dist/index.js' }
  },
  {
    plugins,
    input: 'src/Html/index.js',
    output: { format: 'cjs', file: 'component/index.js' }
  },
  {
    plugins,
    input: 'src/bin.index.js',
    output: { format: 'cjs', file: 'bin/ahub.js', banner: shebang },
    external: [
      '..',
      path.resolve('component/index.js'),
      'react-dom/server'
    ]
  }
]