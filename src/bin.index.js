import program from 'commander'
import { cross } from 'figures'
import { red } from 'chalk'
import ahub from '..'
import component from '../component'
import { init, create, serve, build } from './bin.action.js'
import { SRC, DEST, CONFIG } from './variables.js'

const FAIL_PRE = red(cross)

const errorHandler = (err) => {
  console.error(FAIL_PRE, err)
  process.exit(1)
}

program
.on('--help', () => console.log(`

  https://github.com/kthjm/ahub/blob/master/README.md

`))
.version(require('../package.json').version, '-v, --version')

program
.command('init [src] [dest]')
.usage(`[src: '${SRC}'] [dest: '${DEST}']`)
.on('--help', () => console.log(``))
.action((src, dest) =>
  init(src, dest)
  .catch(errorHandler)
)

program
.command('create <page...>')
.usage(`<page...> [options]`)
.option('-i, --index', '')
.on('--help', () => console.log(``))
.action((paths, { index: isIndex }) =>
  Promise.all(
    paths
    .map(page => page.includes(',') ? page.split(',') : [page])
    .reduce((a, c) => a.concat(c), [])
    .map(page => create(page, isIndex))
  )
  .catch(errorHandler)
)

program
.command('serve [src] [dest]')
.usage(`[src: '${SRC}'] [dest: '${DEST}'] [options]`)
.option(`-c, --config <file>`, `default: '${CONFIG}'`)
.option('-q, --quiet', 'without log')
.on('--help', () => console.log(``))
.action((src, dest, { config: configPath, quiet }) =>
  serve(ahub, { src, dest, component, configPath }, !quiet)
  .catch(errorHandler)
)

program
.command('build [src] [dest]')
.usage(`[src: '${SRC}'] [dest: '${DEST}'] [options]`)
.option(`-c, --config <file>`, `default: '${CONFIG}'`)
.option('-q, --quiet', 'without log')
.on('--help', () => console.log(``))
.action((src, dest, { config: configPath, quiet }) =>
  build(ahub, { src, dest, component, configPath }, !quiet)
  .catch(errorHandler)
)

program.parse(process.argv)

program.args.length === 0 && program.help()