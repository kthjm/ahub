'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var favicons = _interopDefault(require('favicons'))
var fsExtra = require('fs-extra')
var path = require('path')
var chin = require('chin')
var chin__default = _interopDefault(chin)
var sitemap = require('sitemap')
var pretty = _interopDefault(require('pretty'))
var createTag = _interopDefault(require('html-tag'))
var url = require('url')

const favname = 'favicons'

const files = ['svg', 'png', 'jpg', 'jpeg'].map(ext => `${favname}.${ext}`)

var buildFavicons = (put, out, config) =>
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
                    fsExtra.outputFile(
                      path.join(out, `/${favname}/${name}`),
                      contents
                    )
                  )
              ).then(() => html.join(''))
            )
    )

var template = (lang = '', headOpts) => `
<!DOCTYPE html>
${!lang ? `<html>` : `<html lang="${lang}" >`}
  ${head(headOpts)}
  ${body}
</html>
`

// <!-- <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script> -->
const head = ({ prefix, title, ga, headHtml }) => `
${!prefix ? `<head>` : `<head prefix="${prefix}" >`}
  ${!title ? '' : `<title>${title}</title>`}
  ${headHtml || ''}
  <script defer src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script defer src="/app.js"></script>
  <link rel="stylesheet" type="text/css" href="/app.css">
  ${!ga ? '' : `<script></script>`}
</head>
`

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

const isStream = false
const options = { encoding: 'utf8' }
const { assign } = Object
const { isArray } = Array

const sortUrls = urls =>
  []
    .concat(urls)
    .sort((a, b) => (a.length < b.length ? -1 : a.length > b.length ? 1 : 0))

const createRobotsTxt = hostname => `User-agent: *
Sitemap: ${url.resolve(hostname, 'sitemap.xml')}`

const tags2html = tags =>
  !isArray(tags)
    ? ''
    : tags
        .filter(isArray)
        .map(arg => createTag(...arg))
        .join('')

const createSitemapImg = ({ avatar, links }) =>
  []
    .concat([avatar], links.map(({ icon } = {}) => icon))
    .filter(url$$1 => url$$1 && !url$$1.includes('http'))
    .map(url$$1 => ({ url: url$$1 }))

const plugin = ({
  hostname,
  template: rootTemplate = {},
  faviconsHtml = ''
}) => {
  const rootTagsHtml = tags2html(rootTemplate.tags)

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

    const {
      data,
      template: { sep, lang, title, prefix, ga, tags } = {}
    } = JSON.parse(jsonstring)

    if (hostname && isArray(_urls)) {
      const url$$1 = url.resolve(
        '',
        out.dir.split(process.env.CHIN_OUT)[1] || '/'
      )
      const img = createSitemapImg(data)
      _urls.push({ url: url$$1, img })
    }

    const templateArg = sep
      ? [
          lang,
          {
            title,
            prefix,
            ga,
            headHtml: tags2html(tags) + faviconsHtml
          }
        ]
      : [
          lang || rootTemplate.lang,
          {
            title: title || rootTemplate.title,
            prefix: prefix || rootTemplate.prefix,
            ga: ga || rootTemplate.ga,
            headHtml: (tags2html(tags) || rootTagsHtml) + faviconsHtml
          }
        ]

    return [
      [path.format(out), JSON.stringify(data, null, '\t')],
      [
        path.format(assign({}, out, { ext: '.html' })),
        pretty(template(...templateArg), { ocd: true })
      ]
    ]
  }

  return { isStream, options, after, processor }
}

var buildPages = (put, out, verbose, watch, options) => {
  const json = plugin(options)
  const build = typeof watch === 'object' ? chin.watch : chin.chin
  return build({
    put,
    out,
    verbose,
    watch,
    processors: { json },
    ignored: ['favicons.*']
  })
    .then(watcher => {})
    .then(() => json.after())
}

const throws = message => {
  throw new Error(message)
}
const asserts = (condition, message) => !condition && throws(message)

const cwd = process.cwd()

const requireIndexJson = (put = '') =>
  fsExtra.readJson(path.join(put, 'index.json'))
// readJson(pathJoin(cwd, put, 'index.json'))

var tuft = (put, out, { light, verbose, watch: isWatch } = {}) =>
  Promise.resolve()
    .then(() =>
      asserts(
        path.resolve(put).split(path.sep).length > cwd.split(path.sep).length,
        `${put} is invalid src.`
      )
    )
    .then(() => requireIndexJson(put))
    .then(({ hostname, watch, favicons: favicons$$1, template }) =>
      Promise.resolve()
        .then(
          () =>
            !light && typeof favicons$$1 === 'object'
              ? buildFavicons(put, out, favicons$$1)
              : ''
        )
        .then(faviconsHtml =>
          buildPages(put, out, verbose, isWatch && (watch || {}), {
            hostname,
            template,
            faviconsHtml
          })
        )
        .then(results => !light && results && buildSitemap(out, results))
        .then(() => buildApps(out, verbose))
    )

const buildSitemap = (out, { sitemapXml, robotsTxt }) =>
  Promise.all(
    [['sitemap.xml', sitemapXml], ['robots.txt', robotsTxt]].map(
      ([filename, string]) =>
        fsExtra.outputFile(path.join(out, filename), string)
    )
  )

const buildApps = (out, verbose) =>
  chin__default({
    put: path.join(__dirname, '../app.dist'),
    out,
    verbose
  })

module.exports = tuft
