process.env.BABEL_ENV = 'ENV'
require('babel-register')
const ahub = require('./src').default
ahub('.put', '.out', {
  watch: true,
  verbose: true,
  indexJson: require('./.put/index.json')
})