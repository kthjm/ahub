import * as chin from 'chin'
import { createSitemap } from 'sitemap'
import pretty from 'pretty'
import createTag from 'html-tag'
import { format as pathFormat, join as pathJoin } from 'path'
import { resolve as urlResolve } from 'url'
import template from './template.js'

const isStream = false
const options = { encoding: 'utf8' }
const { assign } = Object
const { isArray } = Array

const sortUrls = (urls) =>
  []
  .concat(urls)
  .sort((a, b) =>
    a.length < b.length ? -1 :
    a.length > b.length ? 1 :
    0
  )

const createRobotsTxt = (hostname) =>
`User-agent: *
Sitemap: ${urlResolve(hostname, 'sitemap.xml')}`

const tags2html = (tags) =>
  !isArray(tags)
  ? ''
  : tags.filter(isArray).map(arg => createTag(...arg)).join('')

const createSitemapImg = ({ avatar, links }) =>
  []
  .concat(
    [avatar],
    links.map(({ icon } = {}) => icon)
  )
  .filter(url => url && !url.includes('http'))
  .map(url => ({ url }))

const plugin = ({ hostname, template: rootTemplate = {}, faviconsHtml = '' }) => {

  const rootTagsHtml = tags2html(rootTemplate.tags)

  let _urls = []
  const after = () => {
    const urls = sortUrls(_urls)
    _urls = null
    return !urls.length ? undefined : {
      robotsTxt: createRobotsTxt(hostname),
      sitemapXml: pretty(createSitemap({ hostname, urls }).toString())
    }
  }

  const processor = (jsonstring, { out }) => {

    out = out.name === 'index'
    ? out
    : assign({}, out, { name: 'index', dir: pathJoin(out.dir, out.name) })

    const { data, template: { sep, lang, title, prefix, ga, tags } = {} } = JSON.parse(jsonstring)

    if (hostname && isArray(_urls)) {
      const url = urlResolve('', out.dir.split(process.env.CHIN_OUT)[1] || '/')
      const img = createSitemapImg(data)
      _urls.push({ url, img })
    }

    const templateArg = sep
    ? [lang, {
      title,
      prefix,
      ga,
      headHtml: tags2html(tags) + faviconsHtml
    }]
    : [lang || rootTemplate.lang, {
      title: title || rootTemplate.title,
      prefix: prefix || rootTemplate.prefix,
      ga: ga || rootTemplate.ga,
      headHtml: (tags2html(tags) || rootTagsHtml) + faviconsHtml
    }]

    return [
      [
        pathFormat(out),
        JSON.stringify(data, null, '\t')
      ],
      [
        pathFormat(assign({}, out, { ext: '.html' })),
        pretty(template(...templateArg), { ocd: true })
      ]
    ]
  }

  return { isStream, options, after, processor }
}

export default (put, out, verbose, watch, options) => {
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