const { render: stylusRender } = require('stylus')
const path = require('path')

const stylus = (options) => ({
  isStream: false,
  options: { encoding: 'utf8' },
  processor: (code, { out }) => [
    path.format(Object.assign({}, out, { ext: '.css' })),
    stylusRender(code, options)
  ]
})

const configs = {
  'watch:ass': [
    {
      put: 'src/component/assets',
      out: 'assets',
      processors: { styl: stylus({ compress: false }) },
      watch: {},
    },
    {
      put: 'assets',
      out: '.out'
    }
  ],
  'build:chin': {
    put: 'src/component/assets',
    out: 'assets',
    processors: { styl: stylus({ compress: true }) }
  }
}

const { npm_lifecycle_event: command } = process.env
module.exports = configs[command]

/*

const { transform: babelTransform } = require('babel-core')

const babel = (options) => ({
  isStream: false,
  options: { encoding: 'utf8' },
  processor: (code) =>
    babelTransform(code, options).code
})

js: babel({ babelrc: false, presets: ['env'] })

 */