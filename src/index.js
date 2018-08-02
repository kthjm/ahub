import chin from 'chin'
import { outputFile } from 'fs-extra'
import { join as pathJoin, resolve as pathResolve, sep as pathSep } from 'path'
import buildFavicons from './buildFavicons.js'
import buildPages from './buildPages.js'
import { asserts } from './util.js'

/*
const isChildDir = (source) =>
  pathResolve(source).split(pathSep).length > process.cwd().split(pathSep).length

asserts(isChildDir(source), `${source} is invalid source`)
*/

const buildSitemap = (dest, { sitemapXml, robotsTxt }) =>
  Promise.all([
    ['sitemap.xml', sitemapXml],
    ['robots.txt', robotsTxt]
  ].map(([ filename, string ]) =>
    outputFile(pathJoin(dest, filename), string)
  ))

const buildApps = (dest, verbose) =>
  chin({
    put: pathJoin(__dirname, '../app.dist'),
    out: dest,
    verbose
  })

const tuft = (
  source,
  dest,
  { favicons, lang, hostname, head, watch, ignored, verbose } = {}
) =>
  Promise.resolve()
  .then(() => {
    asserts(source, `${source} is invalid source`)
    asserts(dest, `${dest} is invalid dest`)
  })
  .then(() =>
    favicons
    ? buildFavicons(source, dest, favicons)
    : ''
  )
  .then(faviconsHtml =>
    buildPages(
      source,
      dest,
      verbose,
      ignored,
      watch,
      { hostname, lang, head, faviconsHtml }
    )
  )
  .then(results =>
    results &&
    buildSitemap(dest, results)
  )
  .then(() =>
    buildApps(dest, verbose)
  )

export default tuft