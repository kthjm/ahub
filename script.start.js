process.env.BABEL_ENV = 'ENV';require('babel-register')

const ahub = require('./src').default
const component = require('./src/component').default
const { createTemplate } = require('./src/bin.action.js')

ahub(
  '.put',
  '.out',
  createTemplate(component, './.put/index.json'),
  {
    watch: true,
    verbose: true
  }
)