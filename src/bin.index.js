import program from 'commander'
import ahub from '..'
import { init, create, serve, build, SRC, DEST, CONFIG } from './bin.action.js'

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
.command('init <src> [dest]')
.usage(`<src> [dest]`)
.on('--help', () => console.log(``))
.action((src, dest) =>
  init(src, dest)
  .catch(errorHandler)
)

program
.command('create <path...>')
.usage(`<path...> [options]`)
.option('-i, --index', '')
.on('--help', () => console.log(``))
.action((paths, { index: isIndex }) =>
  Promise.all(
    paths
    .map(path => path.includes(',') ? path.split(',') : [path])
    .reduce((a, c) => a.concat(c), [])
    .map((path, index, paths) =>
      !isIndex && paths.length > 1
      ? create(path, false, paths[index + 1] || paths[0])
      : create(path, isIndex)
    )
  )
  .catch(errorHandler)
)

program
.command('serve [src] [dest]')
.usage(`[src: '${SRC}'] [dest: '${DEST}'] [options]`)
.option(`-c, --config <jsonfile>`, `default: '${CONFIG}' || packagejson['ahub']`)
.option('-q, --quiet', 'without log')
.on('--help', () => console.log(``))
.action((src, dest, { config, quiet }) =>
  serve(ahub, !quiet, {
    src,
    dest,
    configPath: config,
    isWatch: true
  })
  .catch(errorHandler)
)

program
.command('build [src] [dest]')
.usage(`[src: '${SRC}'] [dest: '${DEST}'] [options]`)
.option(`-c, --config <jsonfile>`, `default: '${CONFIG}' || packagejson['ahub']`)
.option('-q, --quiet', 'without log')
.on('--help', () => console.log(``))
.action((src, dest, { config, quiet }) =>
  build(ahub, !quiet, {
    src,
    dest,
    configPath: config,
    isProduct: true
  })
  .catch(errorHandler)
)

program.parse(process.argv)

program.args.length === 0 && program.help()