#!/usr/bin/env node
'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var fsExtra = require('fs-extra')
var path = require('path')
var tuft = _interopDefault(require('..'))
var program = _interopDefault(require('commander'))

const CONFIG_PATH = 'tuft.json'
const DESTINATION = '.site'

const normalizeConfig = (source, dest, configPath, isPro, isWatch) =>
  Promise.resolve()
    .then(
      () =>
        typeof configPath === 'string'
          ? fsExtra.readJson(configPath)
          : fsExtra
              .readJson(CONFIG_PATH)
              .catch(() =>
                fsExtra
                  .readJson('package.json')
                  .then(userPackageJson => userPackageJson.tuft || {})
              )
    )
    .then(config => ({
      source: source || config.source,
      dest: dest || config.dest || DESTINATION,
      lang: config.lang,
      hostname: isPro ? config.hostname : undefined,
      favicons: isPro ? config.favicons || true : undefined,
      watch: isWatch ? config.watch || true : undefined,
      ignored: config.ignored,
      head: undefined
    }))
    .then(config =>
      fsExtra
        .readJson(path.join(config.source, 'index.json'))
        .then(({ head = {} }) => Object.assign({}, config, { head }))
    )

var action = (source, dest, configPath, isPro, isWatch, quiet) =>
  normalizeConfig(source, dest, configPath, isPro, isWatch).then(
    ({ source, dest, lang, hostname, head, watch, favicons, ignored }) =>
      fsExtra.remove(dest).then(() =>
        tuft(source, dest, {
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
  .arguments('[source] [dest]')
  .usage(`[source] [dest: '${DESTINATION}'] [options]`)
  .option(
    `-c, --config <jsonfile>`,
    `default: '${CONFIG_PATH}' || packagejson.tuft`
  )
  .option('-p, --product', 'build as production')
  .option('-q, --quiet', 'without log')
  // .option('-w, --watch', 'watch')
  .on('--help', () =>
    console.log(`
  https://github.com/kthjm/tuft/blob/master/README.md
`)
  )
  .version(require('../package.json').version, '-v, --version')
  .action((source, dest, { config, product, watch, quiet }) =>
    action(source, dest, config, product, watch, quiet).catch(console.error)
  )
  .parse(process.argv)

program.args.length === 0 && program.emit(`command:*`, program.args)
// program.help()
