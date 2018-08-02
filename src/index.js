import * as chin from 'chin'
import { readJson, outputFile } from 'fs-extra'
import { join as pathJoin, resolve as pathResolve, sep as pathSep } from 'path'
import buildFavicons from './favicons.js'
import plugin from './plugin.js'
import { asserts } from './util.js'

const cwd = process.cwd()

const tuft = (
  put,
  out,
  { favicons, lang, hostname, head, watch, ignored, verbose } = {}
) =>
  Promise.resolve()
  .then(() => {
    asserts(put, `${put} is invalid source`)
    asserts(pathResolve(put).split(pathSep).length > process.cwd().split(pathSep).length, `${put} is invalid source`)
    asserts(out, `${out} is invalid dest`)
  })
  .then(() =>
    favicons
    ? buildFavicons(put, out, favicons)
    : ''
  )
  .then(faviconsHtml =>
    buildPages(
      put,
      out,
      verbose,
      ignored,
      watch,
      { hostname, lang, head, faviconsHtml }
    )
  )
  .then(results =>
    results &&
    buildSitemap(out, results)
  )
  .then(() =>
    buildApps(out, verbose)
  )

const buildPages = (put, out, verbose, ignored, watch, options) => {

  const json = plugin(options)
  
  const build = watch ? chin.watch : chin.chin

  ignored = [
    'node_modules/**',
    'favicons.*'
  ].concat(
    Array.isArray(ignored) ? ignored : []
  )

  watch = Object.assign({}, { ignored, ignoreInitial: true }, watch)

  return build({
    put,
    out,
    verbose,
    watch,
    ignored,
    processors: { json }
  })
  .then(watcher => {})
  .then(() => json.after())
}

const buildSitemap = (out, { sitemapXml, robotsTxt }) =>
  Promise.all([
    ['sitemap.xml', sitemapXml],
    ['robots.txt', robotsTxt]
  ].map(([ filename, string ]) =>
    outputFile(pathJoin(out, filename), string)
  ))

const buildApps = (out, verbose) =>
  chin.chin({
    put: pathJoin(__dirname, '../app.dist'),
    out,
    verbose
  })

export default tuft