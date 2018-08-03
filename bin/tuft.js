#!/usr/bin/env node
'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var fsExtra = require('fs-extra')
var path = require('path')
var tuft = _interopDefault(require('..'))
var program = _interopDefault(require('commander'))

const throws = message => {
  throw new Error(message)
}

const SRC = '.'
const DEST = '.site'
const CONFIG = 'tuft.json'

const normalizeConfig = (src, dest, configPath, isPro, isWatch) =>
  Promise.resolve()
    .then(
      () =>
        typeof configPath === 'string'
          ? fsExtra.readJson(configPath)
          : fsExtra
              .readJson(CONFIG)
              .catch(() =>
                fsExtra
                  .readJson('package.json')
                  .then(userPackageJson => userPackageJson.tuft || {})
              )
    )
    .then(config => ({
      src: src || config.src || SRC,
      dest: dest || config.dest || DEST,
      lang: config.lang,
      hostname: isPro ? config.hostname : undefined,
      favicons: isPro ? config.favicons || true : undefined,
      watch: isWatch ? config.watch || true : undefined,
      ignored: config.ignored,
      head: undefined
    }))
    .then(config =>
      fsExtra
        .readJson(path.join(config.src, 'index.json'))
        .then(({ head = {} }) => Object.assign({}, config, { head }))
        .catch(() => throws(`[src]/index.json is required`))
    )

var action = (src, dest, configPath, isPro, isWatch, quiet) =>
  normalizeConfig(src, dest, configPath, isPro, isWatch).then(
    ({ src, dest, lang, hostname, head, watch, favicons, ignored }) =>
      fsExtra.remove(dest).then(() =>
        tuft(src, dest, {
          lang,
          hostname,
          head,
          watch,
          favicons,
          ignored,
          verbose: !quiet
        })
      )
  )

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
  .option(
    `-c, --config <jsonfile>`,
    `default: '${CONFIG}' || packagejson['tuft']`
  )
  .option('-p, --product', 'build as production')
  .option('-q, --quiet', 'without log')
  .option('-w, --watch', 'watch')
  .on('--help', () =>
    console.log(`

  https://github.com/kthjm/tuft/blob/master/README.md

`)
  )
  .version(require('../package.json').version, '-v, --version')
  .action((src, dest, { config, product, watch, quiet }) =>
    action(src, dest, config, product, watch, quiet).catch(err => {
      console.error(err)
      process.exit(1)
    })
  )
  .parse(process.argv)

program.args.length === 0 && program.emit(`command:*`, program.args)
// program.help()
