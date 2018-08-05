'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var fsExtra = require('fs-extra')
var path = require('path')
var url = require('url')
require('browser-sync')
var chin = require('chin')
var sitemap = require('sitemap')
var pretty = _interopDefault(require('pretty'))
var React = require('react')
var React__default = _interopDefault(React)
var Atra = _interopDefault(require('atra'))
var h2r = _interopDefault(require('react-html-parser'))
var createTag = _interopDefault(require('html-tag'))
var server = require('react-dom/server')

const throws = err => {
  throw typeof err === 'string' ? new Error(err) : err
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

/*

{
  inherit: boolean,
  lang: '',
  head: {
    title: '',
    og: boolean,
    ga: '',
    tags: [
      ['tag', attribs, 'text']
    ]
  },
  body: {
    background: '',
    color: '',
    header: {
      image: '',
      title: '',
      description: ''
    },
    links: [
      {
        title: '',
        href: '',
        image: '',
        hub: ''
      }
    ]
  }
}

*/

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
  const build$$1 = chin[chokidarOpts ? 'watch' : 'chin']

  const ignored = [].concat(
    defaultIgnored,
    isBelong(out, put) ? [out] : [],
    Array.isArray(userIgnored) ? userIgnored : []
  )

  const watch = Object.assign({ ignored, ignoreInitial: true }, chokidarOpts)

  return build$$1({ put, out, verbose, processors, ignored, watch })
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

const ogPrefix =
  'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#'

const Ga = ({ id }) => React__default.createElement('script', null)

var Head = ({ title, og, ga, embed }) =>
  React__default.createElement(
    'head',
    { prefix: !og ? undefined : ogPrefix },
    title && React__default.createElement('title', null, title),
    embed,
    ga && React__default.createElement(Ga, { id: ga })
  )

const icon = '</>'

var ToRoot = () =>
  React__default.createElement(
    'div',
    a('FIXED'),
    React__default.createElement('a', a('HREF'), icon)
  )

const a = Atra({
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
      color: 'inherit',
      display: 'block',
      fontSize: '3em',
      lineHeight: 1.2,
      fontWeight: 'bold',
      padding: '6px 12px',
      textDecoration: 'none'
    }
  }
})

var Header = ({ image, title, description }) =>
  React__default.createElement(
    'header',
    a$1('HEADER'),
    image &&
      React__default.createElement(
        'div',
        null,
        React__default.createElement(
          'div',
          a$1('IMAGE', { style: { backgroundImage: `url(${image})` } })
        )
      ),
    title && React__default.createElement('h1', null, title),
    description && React__default.createElement('p', null, description)
  )

const a$1 = Atra({
  HEADER: {
    style: {
      padding: '30px 0px',
      textAlign: 'center'
    }
  },
  IMAGE: {
    style: {
      display: 'inline-block',
      width: 110,
      height: 110,
      borderRadius: 3,
      backgroundImage: undefined,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  }
})

const Hidden = ({ type, attributes = {} }) =>
  React.createElement(
    type || 'div',
    Object.assign({}, attributes, {
      style: Object.assign({}, attributes.style, {
        visibility: 'hidden'
      })
    }),
    '.'
  )

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
const BLOCK_MARGIN = 4

const Links = ({ links }) =>
  React__default.createElement(
    'div',
    { style: { color: '#b7b7b7' } },
    arr2nesty(links, LENGTH).map((rowLinks, rowLinksIndex) =>
      React__default.createElement(
        'div',
        { key: rowLinksIndex, style: { display: 'flex' } },
        rowLinks.map(({ href, image, title, hub }, linkIndex) =>
          React__default.createElement(
            Link,
            _extends(
              { key: linkIndex },
              { width: (1 / LENGTH) * 100 + '%', margin: BLOCK_MARGIN }
            ),
            React__default.createElement(Title, { title }),
            React__default.createElement(HrefImage, { href, image }),
            React__default.createElement(HrefHub, { href: hub })
          )
        ),
        LENGTH - rowLinks.length > 0 &&
          React__default.createElement(Supple, {
            margin: BLOCK_MARGIN,
            flexLength: LENGTH,
            blankLength: LENGTH - rowLinks.length
          })
      )
    )
  )

const Link = (a => ({ width, margin, children }) =>
  React__default.createElement(
    'div',
    a('LINK', {
      style: { width, margin },
      children
    })
  ))(
  Atra({
    LINK: {
      style: {
        borderRadius: 3,
        padding: '5px 20px 10px',
        height: 'auto',
        backgroundColor: '#f7f7f7'
      }
    }
  })
)

const Title = (a => ({ title }) =>
  React__default.createElement(
    'div',
    a('BLOCK'),
    !title
      ? React__default.createElement(Hidden, {
          type: 'span',
          attributes: a('INLINE')
        })
      : React__default.createElement('span', a('INLINE'), title)
  ))(
  Atra({
    BLOCK: {
      style: {
        textAlign: 'center',
        fontSize: '0.85em',
        fontWeight: 100,
        letterSpacing: 1
      }
    },
    INLINE: {
      style: {
        borderBottom: 'solid 1px',
        padding: '0px 4px'
      }
    }
  })
)

const HrefImage = (a => ({ href, image }) =>
  React__default.createElement(
    'a',
    a('HREF', href && { href, target: '_blank' }),
    React__default.createElement(
      'div',
      a('IMAGE', { style: { backgroundImage: `url(${image})` } })
    )
  ))(
  Atra({
    HREF: {
      style: {
        display: 'block',
        maxWidth: 120,
        height: 120,
        margin: '12px auto 10px'
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

const HrefHub = (a => ({ href }) =>
  !href
    ? React__default.createElement(Hidden, { type: 'div' })
    : React__default.createElement(
        'div',
        a('WRAP'),
        React__default.createElement('a', a('HREF', { href }), '< hub >')
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
        color: 'inherit',
        fontWeight: 'bold'
      }
    }
  })
)

const Supple = ({ margin, flexLength, blankLength }) =>
  React__default.createElement('div', {
    style: {
      width: `${(1 / flexLength) * 100 * blankLength}%`,
      padding: `20px ${20 * blankLength}px`,
      margin: `0px ${margin * blankLength}px ${margin}px ${margin *
        blankLength}px`
    }
  })

const Body = ({ pathname, background, color, header = {}, links = [] }) =>
  React__default.createElement(
    'body',
    a$2('BODY', { style: { background, color } }),
    pathname !== '/' && React__default.createElement(ToRoot, null),
    React__default.createElement(
      'main',
      a$2('WIDTH'),
      React__default.createElement(Header, header),
      React__default.createElement(Links, { links })
    )
  )

const a$2 = Atra({
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

var Html = props => React__default.createElement(Html$1, normalizeProps(props))

const Html$1 = ({ pathname, lang, head, body }) =>
  React__default.createElement(
    'html',
    { lang: !lang ? undefined : lang },
    React__default.createElement(Head, head),
    React__default.createElement(Body, _extends({}, body, { pathname }))
  )

const normalizeProps = ({
  inherit,
  lang,
  head,
  body,
  pathname,
  indexJson = {},
  faviconsHtml = ''
}) => ({
  pathname,
  lang: !inherit ? lang : lang || indexJson.lang,
  head: normalizeHead(inherit, indexJson.head, head, faviconsHtml),
  body: normalizeBody(inherit, indexJson.body, body)
})

const normalizeHead = (
  inherit,
  indexHead = {},
  { title, og, ga, tags } = {},
  faviconsHtml
) =>
  !inherit
    ? {
        title,
        og,
        ga,
        embed: h2r(tags2markup(tags) + faviconsHtml)
      }
    : {
        title: title || indexHead.title,
        og: og || indexHead.og,
        ga: ga || indexHead.ga,
        embed: h2r(
          (tags2markup(tags) || tags2markup(indexHead.tags)) + faviconsHtml
        )
      }

const normalizeBody = (
  inherit,
  { background: indexBackground, color: indexColor } = {},
  { background, color, header, links } = {}
) =>
  !inherit
    ? {
        background,
        color,
        header,
        links
      }
    : {
        background: background || indexBackground,
        color: color || indexColor,
        header,
        links
      }

const tags2markup = tags =>
  !Array.isArray(tags)
    ? ''
    : tags
        .filter(Array.isArray)
        .map(arg => createTag(...arg))
        .join('')

const ahub = (
  src,
  dest,
  {
    favicons,
    verbose,
    sitemap: sitemap$$1,
    indexJson,
    watch: chokidarOpts,
    ignored: userIgnored
  } = {}
) =>
  Promise.resolve()
    .then(() => {
      asserts(src, `${src} is invalid as src`)
      asserts(dest, `${dest} is invalid as dest`)
    })
    .then(() => (!favicons ? '' : buildFavicons(src, dest, favicons)))
    .then(faviconsHtml => {
      const template =
        typeof indexJson === 'function'
          ? (props, pathname) =>
              indexJson().then(indexJson =>
                server.renderToStaticMarkup(
                  React__default.createElement(
                    Html,
                    _extends({}, props, { pathname, indexJson, faviconsHtml })
                  )
                )
              )
          : (props, pathname) =>
              server.renderToStaticMarkup(
                React__default.createElement(
                  Html,
                  _extends({}, props, { pathname, indexJson, faviconsHtml })
                )
              )

      const json2html = j2h(template, { sitemap: sitemap$$1 })

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
