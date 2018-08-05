#!/usr/bin/env node
'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var url = require('url')
var fsExtra = require('fs-extra')
var browsersync = _interopDefault(require('browser-sync'))
var path = require('path')
var program = _interopDefault(require('commander'))
var figures = require('figures')
var chalk = require('chalk')
var ahub = _interopDefault(require('..'))

const throws = err => {
  throw typeof err === 'string' ? new Error(err) : err
}

const createConfig = (src, dest = '') => ({
  src,
  dest,
  sitemap: {
    hostname: 'https://foo.bar'
  },
  favicons: {
    appName: '',
    appDescription: ''
  },
  watch: {},
  ignored: []
})

const createPage = (isIndex, embed) =>
  !isIndex
    ? {
        inherit: true,
        body: bodyUnique(embed)
      }
    : {
        lang: '',
        inherit: false,
        head: {
          title: '',
          og: false,
          ga: '',
          tags: []
        },
        body: Object.assign(
          { background: 'silver', color: '#ffffff' },
          bodyUnique(embed)
        )
      }

const bodyUnique = ({ title, hub1, hub2 } = {}) => ({
  header: {
    image:
      'https://imgplaceholder.com/420x420/f3f3f3/c0c0c0/glyphicon-user?text=ahub&font-size=200',
    title: title || '{ title }',
    description: '{ description }'
  },
  links: !hub1
    ? [link()]
    : [
        link({ title: 'title' }),
        link({ hub: hub1 }),
        link({ title: 'title', hub: hub2 || hub1 })
      ]
})

const link = ({ title = '', hub = '' } = {}) => ({
  title: title,
  href: 'https://github.com/',
  image: 'https://image.flaticon.com/icons/svg/25/25231.svg',
  hub: hub && url.resolve('/', hub)
})

/*

{
  inherit: boolean,
  lang: '',
  head: {
    title: '',
    og: boolean,
    ga: '',
    tags: [
      ['tag', attribs, 'text']
    ]
  },
  body: {
    background: '',
    color: '',
    header: {
      image: '',
      title: '',
      description: ''
    },
    links: [
      {
        title: '',
        href: '',
        image: '',
        hub: ''
      }
    ]
  }
}

*/

const SRC = '.'
const DEST = '_site'
const CONFIG = '_config.json'

const normalizeConfig = ({ src, dest, configPath, isWatch, isProduct }) =>
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
      sitemap: isProduct ? config.sitemap : undefined,
      favicons: isProduct ? config.favicons || true : undefined,
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

const build = (ahub$$1, verbose, options) =>
  normalizeConfig(options).then(
    ({ src, dest, sitemap, indexJson, watch, favicons, ignored }) =>
      fsExtra
        .remove(dest)
        .then(() =>
          ahub$$1(src, dest, {
            sitemap,
            indexJson,
            watch,
            favicons,
            ignored,
            verbose
          })
        )
  )

const serve = (ahub$$1, verbose, options) =>
  normalizeConfig(options).then(
    ({ src, dest, sitemap, indexJson, watch, favicons, ignored }) =>
      fsExtra
        .remove(dest)
        .then(() =>
          ahub$$1(src, dest, {
            sitemap,
            indexJson,
            watch,
            favicons,
            ignored,
            verbose
          })
        )
        .then(watcher =>
          browsersync
            .create()
            .init({ server: dest, watch: true, notify: false })
        )
  )

const create = (path$$1, isIndex) => {
  path$$1 = path.extname(path$$1) !== '.json' ? `${path$$1}.json` : path$$1
  return fsExtra.outputFile(
    path.normalize(path$$1),
    jtringify(createPage(isIndex, { title: filename(path$$1) }))
  )
}

const init = (src, dest) =>
  Promise.all(
    [
      [CONFIG, jtringify(createConfig(src, dest))],
      [
        path.join(src, 'index.json'),
        jtringify(
          createPage(true, {
            title: 'index.json',
            hub1: 'page1',
            hub2: 'page2'
          })
        )
      ],
      [
        path.join(src, 'page1.json'),
        jtringify(createPage(false, { title: 'page1.json', hub1: 'page2' }))
      ],
      [
        path.join(src, 'page2.json'),
        jtringify(createPage(false, { title: 'page2.json', hub1: 'page1' }))
      ]
    ].map(arg => fsExtra.outputFile(...arg))
  )

const jtringify = obj => JSON.stringify(obj, null, '\t')

const filename = path$$1 => {
  const splited = path.normalize(path$$1).split(path.sep)
  return splited[splited.length - 1]
}

const FAIL_PRE = chalk.red(figures.cross)

const errorHandler = err => {
  console.error(FAIL_PRE, err)
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
  .command('init <src> [dest]')
  .usage(`<src> [dest]`)
  .on('--help', () => console.log(``))
  .action((src, dest) => init(src, dest).catch(errorHandler))

program
  .command('create <page...>')
  .usage(`<page...> [options]`)
  .option('-i, --index', '')
  .on('--help', () => console.log(``))
  .action((paths, { index: isIndex }) =>
    Promise.all(
      paths
        .map(page => (page.includes(',') ? page.split(',') : [page]))
        .reduce((a, c) => a.concat(c), [])
        .map(page => create(page, isIndex))
    ).catch(errorHandler)
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
    serve(ahub, !quiet, {
      src,
      dest,
      configPath: config,
      isWatch: true
    }).catch(errorHandler)
  )

program
  .command('build [src] [dest]')
  .usage(`[src: '${SRC}'] [dest: '${DEST}'] [options]`)
  .option(
    `-c, --config <jsonfile>`,
    `default: '${CONFIG}' || packagejson['ahub']`
  )
  .option('-q, --quiet', 'without log')
  .on('--help', () => console.log(``))
  .action((src, dest, { config, quiet }) =>
    build(ahub, !quiet, {
      src,
      dest,
      configPath: config,
      isProduct: true
    }).catch(errorHandler)
  )

program.parse(process.argv)

program.args.length === 0 && program.help()
