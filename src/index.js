import chin from 'chin'
import { outputFile } from 'fs-extra'
import { join as pathJoin, resolve as pathResolve, sep as pathSep } from 'path'
import buildFavicons from './buildFavicons.js'
import buildPages from './buildPages.js'
import { asserts } from './util.js'

/*
const isChildDir = (src) =>
  pathResolve(src).split(pathSep).length > process.cwd().split(pathSep).length

asserts(isChildDir(src), `${src} is invalid src`)
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
  src,
  dest,
  { favicons, lang, hostname, head, watch, ignored, verbose } = {}
) =>
  Promise.resolve()
  .then(() => {
    asserts(src, `${src} is invalid as src`)
    asserts(dest, `${dest} is invalid as dest`)
  })
  .then(() =>
    favicons
    ? buildFavicons(src, dest, favicons)
    : ''
  )
  .then(faviconsHtml =>
    buildPages(
      src,
      dest,
      verbose,
      ignored,
      watch,
      { hostname, lang, head, faviconsHtml }
    )
  )
  .then(({ after, watcher }) =>
    !after
    ? watcher
    : buildSitemap(dest, after).then(() => watcher)
  )
  .then(watcher =>
    buildApps(dest, verbose).then(() => watcher)
  )

export default tuft