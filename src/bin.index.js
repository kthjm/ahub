import program from 'commander'
import action, { DESTINATION, CONFIG_PATH } from './bin.action.js'

program
.arguments('[source] [dest]')
.usage(`[source] [dest: '${DESTINATION}'] [options]`)
.option(`-c, --config <jsonfile>`, `default: '${CONFIG_PATH}' || packagejson.tuft`)
.option('-p, --product', 'build as production')
.option('-q, --quiet', 'without log')
// .option('-w, --watch', 'watch')
.on('--help', () => console.log(`
  https://github.com/kthjm/tuft/blob/master/README.md
`))
.version(require('../package.json').version, '-v, --version')
.action((source, dest, { config, product, watch, quiet }) =>
  action(
    source,
    dest,
    config,
    product,
    watch,
    quiet
  )
  .catch(console.error)
)
.parse(process.argv)

program.args.length === 0 &&
program.emit(`command:*`, program.args)
// program.help()
