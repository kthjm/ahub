#!/usr/bin/env node
'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var fsExtra = require('fs-extra')
var path = require('path')
var browsersync = _interopDefault(require('browser-sync'))
var program = _interopDefault(require('commander'))
var ahub = _interopDefault(require('..'))

const SRC = '.'
const DEST = '.site'
const CONFIG = 'ahub.json'

const throws = message => {
  throw new Error(message)
}

const space = '\t'

var create = names =>
  Promise.all(
    names.map(name => {
      const outpath = path.normalize(
        path.extname(name) === '.json' ? name : `${name}.json`
      )
      const splited = outpath.split(path.sep)
      const json =
        splited[splited.length - 1] === 'index.json' ? indexJson : inheritJson
      return fsExtra.outputFile(outpath, JSON.stringify(json, null, space))
    })
  )

const body = {
  background: '',
  header: {
    color: '',
    avatar: '',
    title: '',
    description: ''
  },
  links: [
    {
      href: '',
      src: '',
      hub: ''
    }
  ]
}

const indexJson = {
  lang: '',
  head: {
    title: '',
    og: true,
    ga: '',
    tags: []
  },
  body
}

const inheritJson = {
  lang: '',
  head: {
    inherit: true
  },
  body
}

var normalizeConfig = (src, dest, configPath, isWatch, isPro) =>
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
                  .then(userPackageJson => userPackageJson.ahub || {})
              )
    )
    .then(config => ({
      src: src || config.src || SRC,
      dest: dest || config.dest || DEST,
      sitemap: isPro ? config.sitemap : undefined,
      // hostname:  isPro ? config.hostname : undefined,
      favicons: isPro ? config.favicons || true : undefined,
      watch: isWatch ? config.watch || true : undefined,
      ignored: config.ignored,
      indexJson: undefined
    }))
    .then(config =>
      fsExtra
        .readJson(path.join(config.src, 'index.json'))
        .then(indexJson => Object.assign({}, config, { indexJson }))
        .catch(() => throws(`[src]/index.json is required`))
    )

var serve = (ahub$$1, src, dest, { configPath, isWatch, verbose }) =>
  normalizeConfig(src, dest, configPath, isWatch, false).then(
    ({ src, dest, lang, sitemap, head, watch, favicons, ignored }) =>
      fsExtra.remove(dest).then(() =>
        ahub$$1(src, dest, {
          lang,
          sitemap,
          head,
          watch,
          favicons,
          ignored,
          verbose
        }).then(watcher =>
          browsersync.create().init({
            server: dest,
            watch: true
          })
        )
      )
  )

var build = (ahub$$1, src, dest, { configPath, isPro, verbose }) =>
  normalizeConfig(src, dest, configPath, false, isPro).then(
    ({ src, dest, lang, sitemap, head, watch, favicons, ignored }) =>
      fsExtra.remove(dest).then(() =>
        ahub$$1(src, dest, {
          lang,
          sitemap,
          head,
          watch,
          favicons,
          ignored,
          verbose
        })
      )
  )

const errorHandler = err => {
  console.error(err)
  process.exit(1)
}

program
  .on('--help', () =>
    console.log(`

  https://github.com/kthjm/ahub/blob/master/README.md

`)
  )
  .version(require('../package.json').version, '-v, --version')

program
  .command('create [name...]')
  .usage(`[name...] [options]`)
  .on('--help', () => console.log(``))
  .action((names, {}) =>
    create(names.length ? names : ['index.json']).catch(errorHandler)
  )

program
  .command('serve [src] [dest]')
  .usage(`[src: '${SRC}'] [dest: '${DEST}'] [options]`)
  .option(
    `-c, --config <jsonfile>`,
    `default: '${CONFIG}' || packagejson['ahub']`
  )
  .option('-q, --quiet', 'without log')
  .on('--help', () => console.log(``))
  .action((src, dest, { config, quiet }) =>
    serve(ahub, src, dest, {
      configPath: config,
      isWatch: true,
      verbose: !quiet
    }).catch(errorHandler)
  )

program
  .command('build [src] [dest]')
  .usage(`[src: '${SRC}'] [dest: '${DEST}'] [options]`)
  .option(
    `-c, --config <jsonfile>`,
    `default: '${CONFIG}' || packagejson['ahub']`
  )
  .option('-p, --product', 'build as production')
  .option('-q, --quiet', 'without log')
  .on('--help', () => console.log(``))
  .action((src, dest, { config, product, quiet }) =>
    build(ahub, src, dest, {
      configPath: config,
      isPro: product,
      verbose: !quiet
    }).catch(errorHandler)
  )

program.parse(process.argv)

program.args.length === 0 &&
  // program.emit(`command:*`, program.args)
  program.help()
