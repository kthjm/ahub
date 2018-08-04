'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var favicons = _interopDefault(require('favicons'))
var fsExtra = require('fs-extra')
var path = require('path')
var chin = require('chin')
var sitemap = require('sitemap')
var pretty = _interopDefault(require('pretty'))
var url = require('url')
var React = _interopDefault(require('react'))
var Atra = _interopDefault(require('atra'))
var h2r = _interopDefault(require('react-html-parser'))
var createTag = _interopDefault(require('html-tag'))
var server = require('react-dom/server')

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

const CONFIG = 'ahub.json'

const throws = message => {
  throw new Error(message)
}
const asserts = (condition, message) => !condition && throws(message)

const arr2nesty = (array, length) =>
  array.reduce(
    (a, c) =>
      (a[a.length - 1].length === length
        ? a.push([c])
        : a[a.length - 1].push(c)) && a,
    [[]]
  )

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

var plugin = (template, options) => {
  const { sitemap: sitemapOpts } = options

  const sitemapUrls = []
  let alreadyCreated = false

  const sitemaps = () => {
    alreadyCreated = true
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

    if (sitemapOpts && !alreadyCreated)
      sitemapUrls.push({ url: pathname, img: createSitemapImg(props) })

    return [
      path.format(reout),
      pretty('<!DOCTYPE html>' + template(props, pathname), { ocd: true })
    ]
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

const ogPrefix =
  'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#'

const Ga = ({ id }) => React.createElement('script', null)

var Head = ({ title, og, ga, embed }) =>
  React.createElement(
    'head',
    { prefix: !og ? '' : ogPrefix },
    title && React.createElement('title', null, title),
    embed,
    ga && React.createElement(Ga, { id: ga })
  )

var Header = ({ color, avatar, name, description }) =>
  React.createElement(
    'header',
    a('HEADER', { style: { color } }),
    React.createElement(
      'div',
      a(''),
      React.createElement('img', a('AVATAR', { src: avatar }))
    ),
    React.createElement('h1', a(''), name),
    React.createElement('p', a(''), description)
  )

const a = Atra({
  HEADER: {
    style: {
      padding: '60px 0px 30px',
      textAlign: 'center'
    }
  },
  AVATAR: {
    style: {
      width: 110,
      height: 110
    }
  }
})

var Block = (a => ({ width, height, margin, children }) =>
  React.createElement(
    'div',
    a('BLOCK', { style: { width, height, margin } }),
    children
  ))(
  Atra({
    BLOCK: {
      style: {
        borderRadius: 3,
        padding: 20,
        // backgroundColor: '#F1F3F1'
        backgroundColor: '#f7f7f7'
      }
    }
  })
)

const HrefImage = (a => ({ href, src }) =>
  React.createElement(
    'a',
    a('HREF', { href }),
    React.createElement(
      'div',
      a('IMAGE', { style: { backgroundImage: `url(${src})` } })
    )
  ))(
  Atra({
    HREF: {
      target: '_blank',
      style: {
        display: 'block',
        maxWidth: 120,
        height: '70%',
        margin: '7px auto 22px'
      }
    },
    IMAGE: {
      style: {
        height: '100%',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    }
  })
)

const HrefHub = (a => ({ href, color }) =>
  React.createElement(
    'div',
    a('WRAP'),
    React.createElement('a', a('HREF', { href, style: { color } }), '< hub >')
  ))(
  Atra({
    WRAP: {
      style: {
        textAlign: 'center'
      }
    },
    HREF: {
      style: {
        textDecoration: 'none',
        color: '#a9a9a9',
        // color: '#424242',
        fontWeight: 'bold'
      }
    }
  })
)

var Supple = ({ height, margin, flexLength, blankLength }) =>
  React.createElement('div', {
    style: {
      height,
      width: `${(1 / flexLength) * 100 * blankLength}%`,
      padding: `20px ${20 * blankLength}px`,
      // margin: `0px ${margin * blankLength}px ${margin}px 0px`
      margin: `0px ${margin * blankLength}px ${margin}px ${margin *
        blankLength}px`
    }
  })

const icon = '</>'

var ToRoot = ({ color }) =>
  React.createElement(
    'div',
    a$1('FIXED'),
    React.createElement('a', a$1('HREF', { style: { color } }), icon)
  )

const a$1 = Atra({
  FIXED: {
    style: {
      position: 'fixed',
      top: 0,
      right: 0
    }
  },
  HREF: {
    href: '/',
    style: {
      display: 'block',
      fontSize: '3em',
      lineHeight: 1.2,
      fontWeight: 'bold',
      // padding: '0px 5px',
      padding: '6px 12px',
      textDecoration: 'none'
    }
  }
})

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }

    return target
  }

const LENGTH = 3
const BLOCK_HEIGHT = 190
const BLOCK_MARGIN = 4

var Body = (a => ({ pathname, background, header = {}, links = [] }) =>
  React.createElement(
    'body',
    a('BODY', { style: { background } }),
    pathname !== '/' &&
      React.createElement(ToRoot, { color: header.color || 'inherit' }),
    React.createElement(
      'main',
      a('WIDTH'),
      React.createElement(Header, header),
      arr2nesty(links, LENGTH).map((rowLinks, rowLinksIndex) =>
        React.createElement(
          'div',
          { key: rowLinksIndex, style: { display: 'flex' } },
          rowLinks.map(({ href, src, hub }, linkIndex) =>
            React.createElement(
              Block,
              _extends(
                { key: linkIndex },
                {
                  width: (1 / LENGTH) * 100 + '%',
                  height: BLOCK_HEIGHT,
                  margin: BLOCK_MARGIN
                }
              ),
              React.createElement(HrefImage, { href, src }),
              hub &&
                React.createElement(HrefHub, { href: hub, color: background })
            )
          ),
          LENGTH - rowLinks.length > 0 &&
            React.createElement(Supple, {
              height: BLOCK_HEIGHT,
              margin: BLOCK_MARGIN,
              flexLength: LENGTH,
              blankLength: LENGTH - rowLinks.length
            })
        )
      )
    )
  ))(
  Atra({
    BODY: {
      style: {
        margin: 0,
        fontFamily:
          'Cousine,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
        letterSpacing: 0.44,
        lineHeight: 1.76,
        height: 'auto'
      }
    },
    WIDTH: {
      style: {
        maxWidth: 870,
        padding: '0px 40px',
        margin: '0px auto 80px'
      }
    },
    LINKS: {
      style: {}
    }
  })
)

var Html = props => React.createElement(Html$1, normalizeProps(props))

const Html$1 = ({ pathname, lang, head, body }) =>
  React.createElement(
    'html',
    { lang },
    React.createElement(Head, head),
    React.createElement(Body, _extends({}, body, { pathname }))
  )

const normalizeProps = ({
  lang,
  head: { inherit, title, og, ga, tags } = {},
  body = {},
  pathname,
  indexJson = {},
  faviconsHtml = ''
}) => ({
  pathname,
  lang: lang || indexJson.lang,
  head: !inherit
    ? {
        title,
        og,
        ga,
        embed: h2r(tags2markup(tags) + faviconsHtml)
      }
    : {
        title: title || indexJson.head.title,
        og: og || indexJson.head.og,
        ga: ga || indexJson.head.ga,
        embed: h2r(
          (tags2markup(tags) || tags2markup(indexJson.head.tags)) + faviconsHtml
        )
      },
  body
})

const tags2markup = tags =>
  !Array.isArray(tags)
    ? ''
    : tags
        .filter(Array.isArray)
        .map(arg => createTag(...arg))
        .join('')

const buildSitemap = (dest, { sitemapXml, robotsTxt }) =>
  Promise.all(
    [['sitemap.xml', sitemapXml], ['robots.txt', robotsTxt]].map(
      ([filename, string]) =>
        fsExtra.outputFile(path.join(dest, filename), string)
    )
  )

const ahub = (src, dest, options = {}) =>
  Promise.resolve().then(() => {
    asserts(src, `${src} is invalid as src`)
    asserts(dest, `${dest} is invalid as dest`)

    return Promise.resolve()
      .then(
        () =>
          options.favicons ? buildFavicons(src, dest, options.favicons) : ''
      )
      .then(faviconsHtml => {
        const {
          verbose,
          sitemap: sitemap$$1,
          indexJson,
          watch: chokidarOpts,
          ignored: userIgnored
        } = options

        const template = (props, pathname) =>
          server.renderToStaticMarkup(
            React.createElement(
              Html,
              _extends({}, props, { pathname, indexJson, faviconsHtml })
            )
          )

        const json2html = plugin(template, { sitemap: sitemap$$1 })

        return buildPages({
          put: src,
          out: dest,
          verbose,
          processors: { json: json2html },
          userIgnored,
          chokidarOpts
        }).then(watcher => ({
          watcher,
          sitemaps: json2html.sitemaps()
        }))
      })
      .then(
        ({ sitemaps, watcher }) =>
          !sitemaps ? watcher : buildSitemap(dest, sitemaps).then(() => watcher)
      )
  })

module.exports = ahub
