'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var favicons = _interopDefault(require('favicons'))
var fsExtra = require('fs-extra')
var path = require('path')
var sitemap = require('sitemap')
var pretty = _interopDefault(require('pretty'))
var createTag = _interopDefault(require('html-tag'))
var url = require('url')
var chin = require('chin')
var chin__default = _interopDefault(chin)

const favname = 'favicons'

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
          : favicons(
              src,
              Object.assign({}, config, { path: `/${favname}` })
            ).then(({ html, images, files }) =>
              Promise.all(
                []
                  .concat(images, files)
                  .map(({ name, contents }) =>
                    fsExtra.outputFile(
                      path.join(out, `/${favname}/${name}`),
                      contents
                    )
                  )
              ).then(() => html.join(''))
            )
    )

var template = (lang, headOpts) => `
<!DOCTYPE html>
<html${!lang ? '' : ` lang="${lang}" `}>
  ${head(headOpts)}
  <body>
    <div id="mounted"></div>
  </body>
</html>
`

const ogPrefix =
  'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#'

const head = ({ title, og, ga, headHtml }) => `
${!og ? `<head>` : `<head prefix="${ogPrefix}" >`}
  ${!title ? '' : `<title>${title}</title>`}
  ${headHtml || ''}
  <script defer src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script defer src="/app.js"></script>
  <link rel="stylesheet" type="text/css" href="/app.css">
  ${!ga ? '' : `<script></script>`}
</head>
`
/*

const body = `
<body>
  <div id="mounted">

    <div id="who">
      <div id="who_flex">
        <div id="avatar_wrap">
          <img id="avatar" :src="avatar" />
        </div>
        <div id="info_wrap">
          <h2>{{ name }}</h2>
          <p>{{ description }}</p>
        </div>
      </div>
    </div>

    <div id="links">
      <div v-for="link in links" class="link">
        <div>
          <a :href="link.href" target="_blank">
            <img :src="link.icon" class="link_icon" />
          </a>
        </div>
        <div class="link_foot">
        </div>
      </div>
    </div>

  </div>
</body>
`
*/

const isStream = false
const options = { encoding: 'utf8' }
const { assign } = Object

const sortUrls = urls =>
  []
    .concat(urls)
    .sort(
      (a, b) =>
        a.url.length < b.url.length ? -1 : a.url.length > b.url.length ? 1 : 0
    )

const createRobotsTxt = hostname => `User-agent: *
Sitemap: ${url.resolve(hostname, 'sitemap.xml')}`

const tags2html = tags =>
  !Array.isArray(tags)
    ? ''
    : tags
        .filter(Array.isArray)
        .map(arg => createTag(...arg))
        .join('')

const createSitemapImg = ({ avatar, links = [] }) =>
  []
    .concat([avatar], links.map(({ icon } = {}) => icon))
    .filter(url$$1 => url$$1 && !url$$1.includes('http'))
    .map(url$$1 => ({ url: url$$1 }))

var plugin = ({ hostname, lang, head: rootHead = {}, faviconsHtml = '' }) => {
  const rootTagsHtml = tags2html(rootHead.tags)

  let _urls = []
  const after = () => {
    const urls = sortUrls(_urls)
    _urls = null
    return !urls.length
      ? undefined
      : {
          robotsTxt: createRobotsTxt(hostname),
          sitemapXml: pretty(
            sitemap.createSitemap({ hostname, urls }).toString()
          )
        }
  }

  const processor = (jsonstring, { out }) => {
    out =
      out.name === 'index'
        ? out
        : assign({}, out, { name: 'index', dir: path.join(out.dir, out.name) })

    let json
    try {
      json = JSON.parse(jsonstring)
    } catch (e) {
      json = {}
    }

    const { body = {}, head: { sep, title, og, ga, tags } = {} } = json

    if (hostname && Array.isArray(_urls)) {
      const url$$1 = url.resolve(
        '',
        out.dir.split(process.env.CHIN_OUT)[1] || '/'
      )
      const img = createSitemapImg(body)
      _urls.push({ url: url$$1, img })
    }

    const headOpts = sep
      ? {
          title,
          og,
          ga,
          headHtml: tags2html(tags) + faviconsHtml
        }
      : {
          title: title || rootHead.title,
          og: og || rootHead.og,
          ga: ga || rootHead.ga,
          headHtml: (tags2html(tags) || rootTagsHtml) + faviconsHtml
        }

    return [
      [path.format(out), JSON.stringify(body, null, '\t')],
      [
        path.format(assign({}, out, { ext: '.html' })),
        pretty(template(lang, headOpts), { ocd: true })
      ]
    ]
  }

  return { isStream, options, after, processor }
}

const defaultIgnored = [
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

var buildPages = (put, out, verbose, ignored, watch, options) => {
  ignored = [].concat(
    defaultIgnored,
    isBelong(out, put) ? [out] : [],
    Array.isArray(ignored) ? ignored : []
  )

  const json = plugin(options)

  const config = { put, out, verbose, ignored, processors: { json } }

  return !watch
    ? chin.chin(config).then(() => ({ after: json.after() }))
    : chin
        .watch(
          Object.assign(config, {
            watch: Object.assign({ ignored, ignoreInitial: true }, watch)
          })
        )
        .then(watcher => ({ watcher, after: json.after() }))
}

const throws = message => {
  throw new Error(message)
}
const asserts = (condition, message) => !condition && throws(message)

/*
const isChildDir = (src) =>
  pathResolve(src).split(pathSep).length > process.cwd().split(pathSep).length

asserts(isChildDir(src), `${src} is invalid src`)
*/

const buildSitemap = (dest, { sitemapXml, robotsTxt }) =>
  Promise.all(
    [['sitemap.xml', sitemapXml], ['robots.txt', robotsTxt]].map(
      ([filename, string]) =>
        fsExtra.outputFile(path.join(dest, filename), string)
    )
  )

const buildApps = (dest, verbose) =>
  chin__default({
    put: path.join(__dirname, '../app.dist'),
    out: dest,
    verbose
  })

const tuft = (
  src,
  dest,
  { favicons: favicons$$1, lang, hostname, head, watch, ignored, verbose } = {}
) =>
  Promise.resolve()
    .then(() => {
      asserts(src, `${src} is invalid as src`)
      asserts(dest, `${dest} is invalid as dest`)
    })
    .then(() => (favicons$$1 ? buildFavicons(src, dest, favicons$$1) : ''))
    .then(faviconsHtml =>
      buildPages(src, dest, verbose, ignored, watch, {
        hostname,
        lang,
        head,
        faviconsHtml
      })
    )
    .then(
      ({ after, watcher }) =>
        !after ? watcher : buildSitemap(dest, after).then(() => watcher)
    )
    .then(watcher => buildApps(dest, verbose).then(() => watcher))

module.exports = tuft
