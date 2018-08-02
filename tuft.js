#!/usr/bin/env node

/*
program
.command('init')
.description('description')
.on('--help', blanklog)
.action((source) => console.log('init: [WIP]', source))

program
.command('serve <source> <destination>')
.description('description')
.on('--help', blanklog)
.action((source, destination) => {
  console.log('serve: [WIP]', source, destination)
})

program
.command('build <source> <destination>')
.description('description')
.on('--help', blanklog)
.action((source, destination, {}) => {
  console.log('build', source, destination, {})
})

program.parse(process.argv)

program.emit('command:build', args)
*/

const program = require('commander')
const { remove } = require('fs-extra')
const tuft = require('.')

const blanklog = () => console.log(``)
const DESTINATION = '.site'

program
.arguments('<source> [dest]')
.usage(`<source> [dest: '${DESTINATION}'] [options]`)
.option('-l, --light', 'without favicons and sitemap')
.option('-q, --quiet', 'without log')
// .option('-w, --watch', 'watch')
.on('--help', () => console.log(`
  https://github.com/kthjm/tuft/blob/master/README.md
`))
.version(require('./package.json').version, '-v, --version')
.action((source, dest = DESTINATION, { light, quiet, watch }) =>
  Promise.resolve()
  .then(() => remove(dest))
  .then(() => tuft(source, dest, { light, watch, verbose: !quiet }))
  .catch(console.error)
)
.parse(process.argv)

program.args.length === 0 &&
program.help()