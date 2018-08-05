'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var fsExtra = require('fs-extra')
var path = require('path')
var chin = require('chin')
var sitemap = require('sitemap')
var pretty = _interopDefault(require('pretty'))
var url = require('url')

const throws = err => {
  throw typeof err === 'string' ? new Error(err) : err
}

const asserts = (condition, message) => !condition && throws(message)

const favname = 'favicons'
const favpath = `/_${favname}`

const files = ['svg', 'png', 'jpg', 'jpeg'].map(ext => `${favname}.${ext}`)

var buildFavicons = (put, out, config) =>
  Promise.all(
    files
      .map(file => path.join(put, file))
      .map(src => fsExtra.pathExists(src).then(isExist => isExist && src))
  )
    .then(sources => sources.find(src => typeof src === 'string'))
    .then(
      src =>
        !src
          ? ''
          : require('favicons')(
              src,
              Object.assign({}, config, { path: favpath })
            ).then(({ html, images, files }) =>
              Promise.all(
                []
                  .concat(images, files)
                  .map(({ name, contents }) =>
                    fsExtra.outputFile(path.join(out, favpath, name), contents)
                  )
              ).then(() => html.join(''))
            )
    )

const CONFIG = '_config.json'

const defaultIgnored = [
  CONFIG,
  'node_modules**',
  '.git**',
  'README.md',
  'LICENSE',
  'favicons.*',
  'package.json',
  'yarn.lock',
  'yarn-error.log'
]

const isBelong = (child, parent) =>
  path
    .relative(child, parent)
    .split(path.sep)
    .every(splited => splited === '..')

var buildPages = ({
  put,
  out,
  verbose,
  processors,
  userIgnored,
  chokidarOpts
}) => {
  const build = chin[chokidarOpts ? 'watch' : 'chin']

  const ignored = [].concat(
    defaultIgnored,
    isBelong(out, put) ? [out] : [],
    Array.isArray(userIgnored) ? userIgnored : []
  )

  const watch = Object.assign({ ignored, ignoreInitial: true }, chokidarOpts)

  return build({ put, out, verbose, processors, ignored, watch })
}

const isStream = false

var j2h = (template, options) => {
  const { sitemap: sitemapOpts } = options

  let sitemapCreated = false
  const sitemapUrls = []
  const sitemaps = () => {
    sitemapCreated = true
    const urls = sortUrls(sitemapUrls)
    return !urls.length
      ? undefined
      : {
          robotsTxt: createRobotsTxt(sitemapOpts.hostname),
          sitemapXml: pretty(
            sitemap
              .createSitemap(Object.assign({}, sitemapOpts, { urls }))
              .toString()
          )
        }
  }

  const processor = (jsonstring, { out }) => {
    const props = JSON.parse(jsonstring)
    const reout = Object.assign(
      out,
      { ext: '.html' },
      out.name !== 'index' && {
        dir: path.join(out.dir, out.name),
        name: 'index'
      }
    )
    const pathname = url.resolve(
      '',
      reout.dir.split(process.env.CHIN_OUT)[1] || '/'
    )

    if (sitemapOpts && !sitemapCreated)
      sitemapUrls.push({ url: pathname, img: createSitemapImg(props) })

    return Promise.resolve()
      .then(() => template(props, pathname))
      .then(html => [
        path.format(reout),
        // '<!DOCTYPE html>' + html
        pretty('<!DOCTYPE html>' + html, { ocd: true })
      ])
  }

  return { isStream, options, sitemaps, processor }
}

const sortUrls = urls =>
  []
    .concat(urls)
    .sort(
      (a, b) =>
        a.url.length < b.url.length ? -1 : a.url.length > b.url.length ? 1 : 0
    )

const createRobotsTxt = hostname => `User-agent: *
Sitemap: ${url.resolve(hostname, 'sitemap.xml')}`

const createSitemapImg = ({ body: { avatar, links = [] } = {} } = {}) =>
  []
    .concat([avatar], links.map(({ icon } = {}) => icon))
    .filter(url$$1 => url$$1 && !url$$1.includes('http'))
    .map(url$$1 => ({ url: url$$1 }))

const ahub = (
  src,
  dest,
  template,
  {
    favicons,
    verbose,
    sitemap: sitemap$$1,
    watch: chokidarOpts,
    ignored: userIgnored
  } = {}
) =>
  Promise.resolve()
    .then(() => {
      asserts(src, `${src} is invalid as src`)
      asserts(dest, `${dest} is invalid as dest`)
      asserts(
        typeof template === 'function',
        `template is required as function`
      )
    })
    .then(() => (!favicons ? '' : buildFavicons(src, dest, favicons)))
    .then(faviconsHtml => {
      const json2html = j2h(
        (props, pathname) => template(props, pathname, faviconsHtml),
        { sitemap: sitemap$$1 }
      )
      return buildPages({
        put: src,
        out: dest,
        verbose,
        processors: { json: json2html },
        userIgnored,
        chokidarOpts
      }).then(watcher => ({ watcher, sitemaps: json2html.sitemaps() }))
    })
    .then(
      ({ watcher, sitemaps }) =>
        !sitemaps ? watcher : buildSitemap(dest, sitemaps).then(() => watcher)
    )

const buildSitemap = (dest, { sitemapXml, robotsTxt }) =>
  Promise.all(
    [['sitemap.xml', sitemapXml], ['robots.txt', robotsTxt]].map(
      ([filename, string]) =>
        fsExtra.outputFile(path.join(dest, filename), string)
    )
  )

module.exports = ahub
