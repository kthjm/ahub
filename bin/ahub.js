#!/usr/bin/env node
'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var React = _interopDefault(require('react'))
var server = require('react-dom/server')
var fsExtra = require('fs-extra')
var bs = _interopDefault(require('browser-sync'))
var path = require('path')
var program = _interopDefault(require('commander'))
var figures = require('figures')
var chalk = require('chalk')
var ahub = _interopDefault(require('..'))
var Html = _interopDefault(require('../component/index.js'))

const throws = err => {
  throw typeof err === 'string' ? new Error(err) : err
}

const createConfig = (src = '', dest = '') => ({
  src,
  dest,
  ignored: [],
  sitemap: {
    hostname: 'https://foo.com'
  },
  favicons: {},
  chokidar: {},
  browsersync: {}
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

const bodyUnique = ({ title, hub, hub2 } = {}) => ({
  header: {
    image:
      'https://imgplaceholder.com/150x150/f3f3f3/c0c0c0/glyphicon-picture?font-size=90',
    title: title || '{ title }',
    description: '{ description }'
  },
  links: !hub
    ? [link()]
    : [
        link({ title: 'title' }),
        link({ hub: hub }),
        link({ title: 'title', hub: hub2 || hub })
      ]
})

const link = ({ title = '', hub = '' } = {}) => ({
  title: title,
  href: 'https://github.com/',
  image: 'https://image.flaticon.com/icons/svg/25/25231.svg',
  hub: hub
})

const SRC = '.'
const DEST = '_site'
const CONFIG = '_config.json'

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }

    return target
  }

const createTemplate = (Html$$1, indexJsonPath) => (
  props,
  pathname,
  faviconsHtml
) =>
  fsExtra
    .readJson(indexJsonPath)
    .then(indexJson =>
      server.renderToStaticMarkup(
        React.createElement(
          Html$$1,
          _extends({}, props, { pathname, indexJson, faviconsHtml })
        )
      )
    )

const getConfig = configPath =>
  typeof configPath === 'string'
    ? fsExtra.readJson(configPath)
    : fsExtra
        .readJson(CONFIG)
        .catch(() =>
          fsExtra
            .readJson('package.json')
            .then(userPackageJson => userPackageJson.ahub || {})
        )

const normalizeConfig = ({
  src,
  dest,
  Html: Html$$1,
  configPath,
  isProduct,
  isWatch
}) =>
  Promise.resolve()
    .then(() => getConfig(configPath))
    .then(config => ({
      src: src || config.src || SRC,
      dest: dest || config.dest || DEST,
      template: undefined,
      ignored: config.ignored,
      sitemap: isProduct ? config.sitemap : undefined,
      favicons: isProduct ? config.favicons || true : undefined,
      chokidar: isWatch ? config.chokidar || true : undefined,
      browsersync: isWatch ? config.browsersync : undefined
    }))
    .then(config => {
      const indexJsonPath = path.join(config.src, 'index.json')
      return fsExtra
        .pathExists(indexJsonPath)
        .then(
          isExist =>
            !isExist
              ? throws(`[src]/index.json is required`)
              : Object.assign(config, {
                  template: createTemplate(Html$$1, indexJsonPath)
                })
        )
    })

const build = (ahub$$1, options, verbose) =>
  normalizeConfig(Object.assign({}, options, { isProduct: true })).then(
    ({ src, dest, template, sitemap, favicons, ignored }) =>
      fsExtra.remove(dest).then(() =>
        ahub$$1(src, dest, template, {
          favicons,
          sitemap,
          verbose,
          ignored
        })
      )
  )

const serve = (ahub$$1, options, verbose) =>
  normalizeConfig(Object.assign({}, options, { isWatch: true })).then(
    ({
      src,
      dest,
      template,
      sitemap,
      favicons,
      ignored,
      chokidar,
      browsersync
    }) =>
      fsExtra
        .remove(dest)
        .then(() =>
          ahub$$1(src, dest, template, {
            favicons,
            sitemap,
            verbose,
            ignored,
            watch: chokidar
          })
        )
        .then(watcher => {
          const instance = bs.create()
          return new Promise(resolve =>
            instance.init(
              Object.assign({ notify: false }, browsersync, {
                server: dest,
                watch: true
              }),
              () => resolve(instance)
            )
          )
        })
  )

const create = (path$$1, isIndex) => {
  path$$1 = path.extname(path$$1) !== '.json' ? `${path$$1}.json` : path$$1
  return fsExtra.outputFile(
    path.normalize(path$$1),
    jtringify(createPage(isIndex, { title: filename(path$$1) }))
  )
}

const init = (src = SRC, dest = DEST) =>
  Promise.all(
    [
      [CONFIG, jtringify(createConfig(src, dest))],
      [
        path.join(src, 'index.json'),
        jtringify(
          createPage(true, { title: 'index', hub: '/page1', hub2: '/page2' })
        )
      ],
      [
        path.join(src, 'page1.json'),
        jtringify(createPage(false, { title: 'page1', hub: '/page2' }))
      ],
      [
        path.join(src, 'page2.json'),
        jtringify(createPage(false, { title: 'page2', hub: '/page1' }))
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
  .command('init [src] [dest]')
  .usage(`[src: '${SRC}'] [dest: '${DEST}']`)
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
  .action((src, dest, { config: configPath, quiet }) =>
    serve(ahub, { src, dest, Html, configPath }, !quiet).catch(errorHandler)
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
  .action((src, dest, { config: configPath, quiet }) =>
    build(ahub, { src, dest, Html, configPath }, !quiet).catch(errorHandler)
  )

program.parse(process.argv)

program.args.length === 0 && program.help()
