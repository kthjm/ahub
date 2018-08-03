import program from 'commander'
import action from './bin.action.js'
import { SRC, DEST, CONFIG } from './util.js'

program
.arguments('[src] [dest]')
.usage(`[src] [dest] [options]`)
.description(
`
  Default:
    src:  '${SRC}'
    dest: '${DEST}'
`
)
.option(`-c, --config <jsonfile>`, `default: '${CONFIG}' || packagejson['tuft']`)
.option('-p, --product', 'build as production')
.option('-q, --quiet', 'without log')
.option('-w, --watch', 'watch')
.on('--help', () => console.log(`

  https://github.com/kthjm/tuft/blob/master/README.md

`))
.version(require('../package.json').version, '-v, --version')
.action((src, dest, { config, product, watch, quiet }) =>
  action(
    src,
    dest,
    config,
    product,
    watch,
    quiet
  )
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
)
.parse(process.argv)

program.args.length === 0 &&
program.emit(`command:*`, program.args)
// program.help()
