import flow from 'rollup-plugin-flow'
import babel from 'rollup-plugin-babel'
import autoExternal from 'rollup-plugin-auto-external'
import commonjs from 'rollup-plugin-commonjs'
import prettier from 'rollup-plugin-prettier'

const shebang = '#!/usr/bin/env node'

const plugins = [
  flow({ pretty: true }),
  babel({ exclude: 'node_modules/**' }),
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
    input: 'src/index.js',
    output: { format: 'cjs', file: 'dist/index.js' },
    plugins
  },
  {
    input: 'src/Html/index.js',
    output: { format: 'cjs', file: 'component/index.js' },
    plugins
  },
  {
    input: 'src/bin.index.js',
    output: { format: 'cjs', file: 'bin/ahub.js', banner: shebang },
    external: ['..', 'react-dom/server'],
    plugins
  }
]