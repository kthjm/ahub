import { outputFile } from 'fs-extra'
import imagemin from 'chin-plugin-imagemin'
import { join as pathJoin, resolve as pathResolve, sep as pathSep } from 'path'
import buildFavicons from './buildFavicons.js'
import buildPages from './buildPages.js'
import j2h from './chin-plugin-json-to-html.js'
import { asserts } from './util.js'
import { IMAGE } from './variables.js'

const img2min = imagemin()

const processors = (json2html) => [
  [IMAGE, {
    svg: img2min,
    png: img2min,
    jpg: img2min,
    jpeg: img2min,
    gif: img2min
  }],
  ['*', {
    json: json2html
  }]
]

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
  !favicons
  ? ''
  : buildFavicons(src, dest, favicons)
)
.then(faviconsHtml => {
  const json2html = j2h((pathname, json) => template(pathname, json, faviconsHtml), { sitemap })
  return buildPages({
    put: src,
    out: dest,
    verbose,
    ignored,
    watch,
    processors: processors(json2html),
  })
  .then(watcher =>
    typeof json2html.sitemaps === 'function'
    ? buildSitemap(dest, json2html.sitemaps()).then(() => watcher)
    : watcher
  )
})

const buildSitemap = (dest, { sitemapXml, robotsTxt }) =>
  Promise.all([
    ['sitemap.xml', sitemapXml],
    ['robots.txt', robotsTxt]
  ].map(([ filename, string ]) =>
    outputFile(pathJoin(dest, filename), string)
  ))

export default ahub