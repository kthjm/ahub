import { readJson, remove, outputFile } from 'fs-extra'
import browsersync from 'browser-sync'
import { join, parse, extname, normalize, sep } from 'path'
import { throws } from './util.js'
import { createConfig, createPage } from './_json.js'

export const SRC    = '.'
export const DEST   = '_site'
export const CONFIG = '_config.json'

const normalizeConfig = ({ src, dest, configPath, isWatch, isProduct }) =>
  Promise.resolve()
  .then(() =>
    typeof configPath === 'string'
    ?
    readJson(configPath)
    :
    readJson(CONFIG).catch(() =>
      readJson('package.json').then(userPackageJson =>
        userPackageJson.ahub ||
        {}
      )
    )
  )
  .then(config => ({
    src:       src  || config.src  || SRC,
    dest:      dest || config.dest || DEST,
    sitemap:   isProduct ? config.sitemap          : undefined,
    favicons:  isProduct ? config.favicons || true : undefined,
    watch:     isWatch   ? config.watch    || true : undefined,
    ignored:   config.ignored,
    indexJson: undefined
  }))
  .then(config =>
    readJson(
      join(config.src, 'index.json')
    )
    .then(indexJson =>
      Object.assign({}, config, { indexJson })
    )
    .catch(() =>
      throws(`[src]/index.json is required`)
    )
  )

export const build = (ahub, verbose, options) => normalizeConfig(options)
.then(({ src, dest, sitemap, indexJson, watch, favicons, ignored }) =>
  remove(dest)
  .then(() => ahub(src, dest, { sitemap, indexJson, watch, favicons, ignored, verbose }))
)

export const serve = (ahub, verbose, options) => normalizeConfig(options)
.then(({ src, dest, sitemap, indexJson, watch, favicons, ignored }) =>
  remove(dest)
  .then(() => ahub(src, dest, { sitemap, indexJson, watch, favicons, ignored, verbose }))
  .then(watcher => browsersync.create().init({ server: dest, watch: true }))
)

export const create = (path, isIndex, hub) => {
  path = extname(path) !== '.json' ? `${path}.json` : path
  return outputFile(
    normalize(path),
    jtringify(createPage(isIndex, {
      title: filename(path),
      hub1: (
        !hub
        ? undefined :
        extname(hub) === '.json'
        ? thinext(filename(hub))
        : filename(hub)
      )
    }))
  )
}

export const init = (src, dest) => Promise.all(
  [
    [
      CONFIG,
      jtringify(createConfig(src, dest))
    ],
    [
      join(src, 'index.json'),
      jtringify(createPage(true, { title: 'index.json', hub1: 'path1', hub2: 'path2' }))
    ],
    [
      join(src, 'path1.json'),
      jtringify(createPage(false, { title: 'path1.json', hub1: 'path2' }))
    ],
    [
      join(src, 'path2.json'),
      jtringify(createPage(false, { title: 'path2.json', hub1: 'path1' }))
    ]
  ]
  .map(arg => outputFile(...arg))
)

const jtringify = (obj) => JSON.stringify(obj, null, '\t')

const filename = (path) => {
  const splited = normalize(path).split(sep)
  return splited[splited.length - 1]
}

const thinext = (filename) => {
  const splited = filename.split('.')
  splited.pop()
  return splited.join('.')
}