import React from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { outputFile } from 'fs-extra'
import { join as pathJoin, resolve as pathResolve, sep as pathSep } from 'path'
import buildFavicons from './buildFavicons.js'
import buildPages from './buildPages.js'
import j2h from './chin-plugin-json-to-html.js'
import Html from './Html/index.js'
import { asserts } from './util.js'

const ahub = (
  src,
  dest,
  { favicons, verbose, sitemap, indexJson, watch: chokidarOpts, ignored: userIgnored } = {}
) =>
Promise.resolve()
.then(() => {
  asserts(src, `${src} is invalid as src`)
  asserts(dest, `${dest} is invalid as dest`)
})
.then(() =>
  !favicons
  ? ''
  : buildFavicons(src, dest, favicons)
)
.then(faviconsHtml => {

  const template = typeof indexJson === 'function'
  ? (props, pathname) => indexJson().then(indexJson =>
    render(<Html {...props} {...{ pathname, indexJson, faviconsHtml }} />))
  : (props, pathname) =>
    render(<Html {...props} {...{ pathname, indexJson, faviconsHtml }} />)

  const json2html = j2h(template, { sitemap })

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