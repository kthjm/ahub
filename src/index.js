import chin from 'chin'
import { outputFile } from 'fs-extra'
import { join as pathJoin } from 'path'
import buildFavicons from './buildFavicons.js'
import buildPages from './buildPages.js'
import { asserts } from './util.js'

const buildAssets = (dest) =>
  chin({ put: pathJoin(__dirname, '../assets'), out: dest })

const ahub = (
  src,
  dest,
  template,
  { favicons, sitemap, verbose, ignored, watch } = {}
) =>
Promise.resolve()
.then(() => {
  asserts(src && typeof src === 'string', `src is required`)
  asserts(dest && typeof dest === 'string', `dest is required`)
  asserts(typeof template === 'function', `template is required as function`)
})
.then(() =>
  buildAssets(dest)
)
.then(() =>
  favicons
  ? buildFavicons(src, dest, favicons)
  : ''
)
.then(faviconsHtml =>
  buildPages(
    src,
    dest,
    (pathname, json) => template(pathname, json, faviconsHtml),
    { sitemap },
    { verbose, ignored, watch }
  )
)
.then(({ watcher, sitemaps }) =>
  sitemaps
  ? buildSitemap(dest, sitemaps).then(() => watcher)
  : watcher
)

const buildSitemap = (dest, { sitemapXml, robotsTxt }) =>
  Promise.all([
    ['sitemap.xml', sitemapXml],
    ['robots.txt', robotsTxt]
  ].map(([ filename, string ]) =>
    outputFile(pathJoin(dest, filename), string)
  ))

export default ahub