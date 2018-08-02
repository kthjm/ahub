const { render: stylusRender } = require('stylus')
const { transform: babelTransform } = require('babel-core')
const { format } = require('path')
const bs = require('browser-sync')
const tuft = require('.')

const stylus = (options) => ({
  isStream: false,
  options: { encoding: 'utf8' },
  processor: (code, { out }) => [
    format(Object.assign({}, out, { ext: '.css' })),
    stylusRender(code, options)
  ]
})

const babel = (options) => ({
  isStream: false,
  options: { encoding: 'utf8' },
  processor: (code) =>
    babelTransform(code, options).code
})

const put = 'app.src'
const processors = {
  styl: stylus({}),
  js: babel({ babelrc: false, presets: ['env'] })
}

const configs = {
  'start': {
    put,
    processors,
    out: '.out',
    clean: true,
    watch: {},
    after: () =>
      tuft(
        '.put',
        '.out',
        { watch: { ignoreInitial: true }, verbose: true }
      ).then(() =>
        bs.create().init({ server: '.out', watch: true })
      )
  },
  'build:chin': {
    put,
    processors,
    out: 'app.dist',
    clean: true
  }
}

const { npm_lifecycle_event: command } = process.env
module.exports = configs[command]