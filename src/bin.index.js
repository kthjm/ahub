import program from 'commander'
import ahub from '..'
import create from './bin.create.js'
import serve from './bin.serve.js'
import build from './bin.build.js'
import { SRC, DEST, CONFIG } from './util.js'

const errorHandler = (err) => {
  console.error(err)
  process.exit(1)
}

program
.on('--help', () => console.log(`

  https://github.com/kthjm/ahub/blob/master/README.md

`))
.version(require('../package.json').version, '-v, --version')

program
.command('create [name...]')
.usage(`[name...] [options]`)
.on('--help', () => console.log(``))
.action((names, {  }) =>
  create(names.length ? names : ['index.json'])
  .catch(errorHandler)
)

program
.command('serve [src] [dest]')
.usage(`[src: '${SRC}'] [dest: '${DEST}'] [options]`)
.option(`-c, --config <jsonfile>`, `default: '${CONFIG}' || packagejson['ahub']`)
.option('-q, --quiet', 'without log')
.on('--help', () => console.log(``))
.action((src, dest, { config, quiet }) =>
  serve(ahub, src, dest, {
    configPath: config,
    isWatch: true,
    verbose: !quiet
  })
  .catch(errorHandler)
)

program
.command('build [src] [dest]')
.usage(`[src: '${SRC}'] [dest: '${DEST}'] [options]`)
.option(`-c, --config <jsonfile>`, `default: '${CONFIG}' || packagejson['ahub']`)
.option('-p, --product', 'build as production')
.option('-q, --quiet', 'without log')
.on('--help', () => console.log(``))
.action((src, dest, { config, product, quiet }) =>
  build(ahub, src, dest, {
    configPath: config,
    isPro: product,
    verbose: !quiet
  })
  .catch(errorHandler)
)

program.parse(process.argv)

program.args.length === 0 &&
// program.emit(`command:*`, program.args)
program.help()