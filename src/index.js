import React from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { outputFile } from 'fs-extra'
import { join as pathJoin, resolve as pathResolve, sep as pathSep } from 'path'
import buildFavicons from './buildFavicons.js'
import buildPages from './buildPages.js'
import plugin from './plugin.js'
import Html from './Html/index.js'
import { asserts } from './util.js'

const buildSitemap = (dest, { sitemapXml, robotsTxt }) =>
  Promise.all([
    ['sitemap.xml', sitemapXml],
    ['robots.txt', robotsTxt]
  ].map(([ filename, string ]) =>
    outputFile(pathJoin(dest, filename), string)
  ))

const ahub = (src, dest, options = {}) => Promise.resolve().then(() => {

  asserts(src, `${src} is invalid as src`)
  asserts(dest, `${dest} is invalid as dest`)

  return Promise.resolve()
  .then(() =>
    options.favicons
    ? buildFavicons(src, dest, options.favicons)
    : ''
  )
  .then(faviconsHtml => {
    const {
      verbose,
      sitemap,
      indexJson,
      watch: chokidarOpts,
      ignored: userIgnored,
    } = options

    const template = (props, pathname) => render(
      <Html
        {...props}
        {...{ pathname, indexJson, faviconsHtml }}
      />
    )

    const json2html = plugin(template, { sitemap })

    return buildPages({
      put: src,
      out: dest,
      verbose,
      processors: { json: json2html },
      userIgnored,
      chokidarOpts
    })
    .then(watcher => ({
      watcher,
      sitemaps: json2html.sitemaps()
    }))
  })
  .then(({ sitemaps, watcher }) =>
    !sitemaps
    ? watcher
    : buildSitemap(dest, sitemaps).then(() => watcher)
  )
})

export default ahub

/*
const isChildDir = (src) =>
  pathResolve(src).split(pathSep).length > process.cwd().split(pathSep).length
asserts(isChildDir(src), `${src} is invalid src`)


.then(watcher =>
  buildApps(dest, verbose).then(() => watcher)
)
const buildApps = (dest, verbose) =>
  chin({
    put: pathJoin(__dirname, '../app.dist'),
    out: dest,
    verbose
  })
*/