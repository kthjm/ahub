import React from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { pathExists, readJson, remove, outputFile } from 'fs-extra'
import { require as rooquire } from 'app-root-path'
import bs from 'browser-sync'
import { join, parse, extname, normalize, sep } from 'path'
import { throws } from './util.js'
import { createConfig, createPage } from './_json.js'
import { SRC, DEST, CONFIG } from './variables.js'

const rooquireP = (path) =>
  Promise.resolve().then(() => rooquire(path))

const getConfig = (configPath) =>
  typeof configPath === 'string'
  ? rooquireP(configPath)
  : rooquireP(CONFIG).catch(() => ({}))

const normalizeConfig = ({ src, dest, Html, configPath, isProduct, isWatch }) =>
  Promise.resolve()
  .then(() => getConfig(configPath))
  .then(config => ({
    src:         src  || config.src  || SRC,
    dest:        dest || config.dest || DEST,
    template:    undefined,
    ignored:     config.ignored,
    sitemap:     isProduct ? config.sitemap          : undefined,
    favicons:    isProduct ? config.favicons || true : undefined,
    chokidar:    isWatch   ? config.chokidar || true : undefined,
    browsersync: isWatch   ? config.browsersync      : undefined
  }))
  .then(config => {
    const indexJsonPath = join(config.src, 'index.json')
    return pathExists(indexJsonPath).then(isExist =>
      !isExist
      ? throws(`[src]/index.json is required`)
      : Object.assign(config, { template: createTemplate(Html, indexJsonPath) })
    )
  })

export const createTemplate = (Html, indexJsonPath) =>
  (props, pathname, faviconsHtml) =>
    readJson(indexJsonPath).then(indexJson =>
      render(<Html {...props} {...{ pathname, indexJson, faviconsHtml }} />))

export const build = (ahub, options, verbose) =>
normalizeConfig(Object.assign({}, options, { isProduct: true }))
.then(({ src, dest, template, sitemap, favicons, ignored }) =>
  remove(dest)
  .then(() =>
    ahub(src, dest, template, {
      favicons,
      sitemap,
      verbose,
      ignored
    })
  )
)

export const serve = (ahub, options, verbose) =>
normalizeConfig(Object.assign({}, options, { isWatch: true }))
.then(({ src, dest, template, sitemap, favicons, ignored, chokidar, browsersync }) =>
  remove(dest)
  .then(() =>
    ahub(src, dest, template, {
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
        Object.assign(
          { notify: false },
          browsersync,
          { server: dest, watch: true }
        ),
        () => resolve(instance)
      )
    )
  })
)

export const create = (path, isIndex) => {
  path = extname(path) !== '.json' ? `${path}.json` : path
  return outputFile(
    normalize(path),
    jtringify(createPage(isIndex, { title: filename(path) }))
  )
}

export const init = (src = SRC, dest = DEST) => Promise.all(
  [
    [CONFIG, createConfig(src, dest)],
    [join(src, 'index.json'), jtringify(createPage(true, { title: 'index', hub: '/page' }))],
    [join(src, 'page.json'), jtringify(createPage(false, { title: 'page' }))]
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