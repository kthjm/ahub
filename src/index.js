import { outputFile } from 'fs-extra'
import { join as pathJoin, resolve as pathResolve, sep as pathSep } from 'path'
import buildFavicons from './buildFavicons.js'
import buildPages from './buildPages.js'
import j2h from './chin-plugin-json-to-html.js'
import { asserts } from './util.js'

const ahub = (
  src,
  dest,
  template,
  { favicons, sitemap, verbose, ignored: userIgnored, watch: chokidarOpts } = {}
) =>
Promise.resolve()
.then(() => {
  asserts(src && typeof src === 'string', `src is required`)
  asserts(dest && typeof dest === 'string', `dest is required`)
  asserts(typeof template === 'function', `template is required as function`)
})
.then(() =>
  !favicons
  ? ''
  : buildFavicons(src, dest, favicons)
)
.then(faviconsHtml => {
  const json2html = j2h((props, pathname) => template(props, pathname, faviconsHtml), { sitemap })
  return buildPages({
    put: src,
    out: dest,
    verbose,
    processors: { json: json2html },
    userIgnored,
    chokidarOpts
  })
  .then(watcher => ({ watcher, sitemaps: json2html.sitemaps() }))
})
.then(({ watcher, sitemaps }) =>
  !sitemaps
  ? watcher
  : buildSitemap(dest, sitemaps).then(() => watcher)
)

const buildSitemap = (dest, { sitemapXml, robotsTxt }) =>
  Promise.all([
    ['sitemap.xml', sitemapXml],
    ['robots.txt', robotsTxt]
  ].map(([ filename, string ]) =>
    outputFile(pathJoin(dest, filename), string)
  ))

export default ahub