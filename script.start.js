process.env.BABEL_ENV = 'ENV'
require('babel-register')
require('./src').default('.put', '.out', {
  watch: {},
  verbose: true
})