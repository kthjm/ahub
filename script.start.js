process.env.BABEL_ENV = 'ENV'
require('babel-register')

const ahub = require('./src').default
const Html = require('./src/Html').default
const { createTemplate } = require('./src/bin.action.js')

ahub(
  '.put',
  '.out',
  createTemplate(Html, './.put/index.json'),
  {
    watch: true,
    verbose: true
  }
)