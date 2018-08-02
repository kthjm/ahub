import chin from 'chin'
import { readJson, outputFile } from 'fs-extra'
import { join as pathJoin, resolve as pathResolve, sep as pathSep } from 'path'
import buildFavicons from './build.favicons.js'
import buildPages from './build.pages.js'
import { asserts } from './util.js'

const cwd = process.cwd()

const requireIndexJson = (put = '') =>
  readJson(pathJoin(put, 'index.json'))
  // readJson(pathJoin(cwd, put, 'index.json'))

export default (put, out, { light, verbose, watch: isWatch } = {}) =>
  Promise.resolve()
  .then(() =>
    asserts(pathResolve(put).split(pathSep).length > cwd.split(pathSep).length, `${put} is invalid src.`)
  )
  .then(() =>
    requireIndexJson(put)
  )
  .then(({ hostname, watch, favicons, template }) =>
    Promise.resolve()
    .then(() =>
      !light && typeof favicons === 'object'
      ? buildFavicons(put, out, favicons)
      : ''
    )
    .then(faviconsHtml =>
      buildPages(
        put,
        out,
        verbose,
        isWatch && (watch || {}),
        { hostname, template, faviconsHtml }
      )
    )
    .then(results =>
      !light &&
      results &&
      buildSitemap(out, results)
    )
    .then(() =>
      buildApps(out, verbose)
    )
  )

const buildSitemap = (out, { sitemapXml, robotsTxt }) =>
  Promise.all([
    ['sitemap.xml', sitemapXml],
    ['robots.txt', robotsTxt]
  ].map(([ filename, string ]) =>
    outputFile(pathJoin(out, filename), string)
  ))

const buildApps = (out, verbose) =>
  chin({
    put: pathJoin(__dirname, '../app.dist'),
    out,
    verbose
  })