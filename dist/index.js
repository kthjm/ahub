'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var favicons = _interopDefault(require('favicons'))
var fsExtra = require('fs-extra')
var path = require('path')
var sitemap = require('sitemap')
var pretty = _interopDefault(require('pretty'))
var url = require('url')
var chin = _interopDefault(require('chin'))

const favname = 'favicons'

const files = ['svg', 'png', 'jpg', 'jpeg'].map(ext => `${favname}.${ext}`)

var buildFavicons = (put, out, { favicons: config }) =>
  Promise.all(
    files
      .map(file => path.join(put, file))
      .map(source =>
        fsExtra.pathExists(source).then(isExist => isExist && source)
      )
  )
    .then(sources => sources.find(source => typeof source === 'string'))
    .then(
      source =>
        !source
          ? ''
          : favicons(
              source,
              Object.assign({}, config, { path: `/${favname}` })
            ).then(({ html, images, files }) =>
              Promise.all(
                []
                  .concat(images, files)
                  .map(({ name, contents }) =>
                    fsExtra.outputFile(path.join(out, favname, name), contents)
                  )
              ).then(() => html.join(''))
            )
    )
// .catch(() => '')

var template = ({ heads } = {}) => `<!DOCTYPE html>
<html>${head(heads)}${body}
</html>`

// <!-- <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script> -->
const head = (heads = '') => `
<head>
  <title></title>
  ${heads}
  <script defer src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script defer src="/app.js"></script>
  <link rel="stylesheet" type="text/css" href="/app.css">
</head>`

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
</body>`

const isStream = false
const options = { encoding: 'utf8' }
const { assign } = Object

const createRobotsTxt = hostname => `User-agent: *
Sitemap: ${url.resolve(hostname, 'sitemap.xml')}`

const createSitemapImg = ({ who, links }, rootConfig) =>
  []
    .concat(
      [who.avatar || (who.inherit && rootConfig.who.avatar)],
      links.map(({ icon } = {}) => icon)
    )
    .filter(url$$1 => url$$1 && !url$$1.includes('http'))
    .map(url$$1 => ({ url: url$$1 }))

var plugin = (rootConfig, favicons$$1 = '') => {
  const { hostname, metas } = rootConfig

  const urls = []

  const after = () =>
    !hostname
      ? []
      : [
          ['robots.txt', createRobotsTxt(hostname)],
          [
            'sitemap.xml',
            pretty(sitemap.createSitemap({ hostname, urls }).toString())
          ]
        ]

  const processor = (data, { out, msg }) => {
    out =
      out.name === 'index'
        ? out
        : assign({}, out, { name: 'index', dir: path.join(out.dir, out.name) })

    urls.push({
      url: out.dir
        .split(process.env.CHIN_OUT)[1]
        .split(path.sep)
        .join('/'),
      img: createSitemapImg(JSON.parse(data), rootConfig)
    })

    return [
      [path.format(out), data],
      [
        path.format(assign({}, out, { ext: '.html' })),
        pretty(template({ heads: favicons$$1 }), { ocd: true })
      ]
      // [pathFormat(assign({}, out, { ext: '.html' })), template({ heads: rootConfig.metas + favicons })]
    ]
  }

  return { isStream, options, after, processor }
}

const ignored = ['favicons.*']

var buildPages = (put, out, rootConfig, favicons$$1) => {
  const json = plugin(rootConfig, favicons$$1)
  return chin({ put, out, ignored, processors: { json } }).then(() =>
    Promise.all(
      json
        .after()
        .map(([filename, string]) =>
          fsExtra.outputFile(path.join(out, filename), string)
        )
    )
  )
}

const appPut = path.join(__dirname, '../app')

const requireRootConfig = (put = '') =>
  fsExtra.readJson(path.join(process.cwd(), put, 'index.json'))

var hrehub = (put, out) =>
  requireRootConfig(put)
    .then(rootConfig =>
      buildFavicons(put, out, rootConfig).then(favicons$$1 =>
        buildPages(put, out, rootConfig, favicons$$1)
      )
    )
    .then(() => chin({ put: appPut, out }))

module.exports = hrehub
