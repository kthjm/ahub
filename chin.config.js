const stylus = require('stylus')
const babel = require('babel-core')
const { format } = require('path')

const js2babel = (options) => ({
  isStream: false,
  options: { encoding: 'utf8' },
  processor: (code) =>
    babel.transform(code, options).code
})

const styl2css = (options) => ({
  isStream: false,
  options: { encoding: 'utf8' },
  processor: (code, { out }) => [
    format(Object.assign({}, out, { ext: '.css' })),
    stylus.render(code, options)
  ]
})

module.exports = {
  put: 'src/browser',
  out: 'app',
  clean: true,
  processors: {
    js: js2babel({ babelrc: false, presets: ['env'] }),
    styl: styl2css({})
  }
}