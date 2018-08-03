import { createSitemap } from 'sitemap'
import pretty from 'pretty'
import createTag from 'html-tag'
import { format as pathFormat, join as pathJoin } from 'path'
import { resolve as urlResolve } from 'url'
import template from './template.js'

const isStream = false
const options = { encoding: 'utf8' }
const { assign } = Object

const sortUrls = (urls) =>
  []
  .concat(urls)
  .sort((a, b) =>
    a.url.length < b.url.length ? -1 :
    a.url.length > b.url.length ? 1 :
    0
  )

const createRobotsTxt = (hostname) =>
`User-agent: *
Sitemap: ${urlResolve(hostname, 'sitemap.xml')}`

const tags2html = (tags) =>
  !Array.isArray(tags)
  ? ''
  : tags.filter(Array.isArray).map(arg => createTag(...arg)).join('')

const createSitemapImg = ({ avatar, links = [] }) =>
  []
  .concat(
    [avatar],
    links.map(({ icon } = {}) => icon)
  )
  .filter(url => url && !url.includes('http'))
  .map(url => ({ url }))

export default ({
  hostname,
  lang,
  head: rootHead = {},
  faviconsHtml = ''
}) => {

  const rootTagsHtml = tags2html(rootHead.tags)

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

    let json
    try { json = JSON.parse(jsonstring) }
    catch(e) { json = {} }

    const {
      body = {},
      head: { sep, title, og, ga, tags } = {}
    } = json

    if (hostname && Array.isArray(_urls)) {
      const url = urlResolve('', out.dir.split(process.env.CHIN_OUT)[1] || '/')
      const img = createSitemapImg(body)
      _urls.push({ url, img })
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
      [
        pathFormat(out),
        JSON.stringify(body, null, '\t')
      ],
      [
        pathFormat(assign({}, out, { ext: '.html' })),
        pretty(template(lang, headOpts), { ocd: true })
      ]
    ]
  }

  return { isStream, options, after, processor }
}