import { createSitemap } from 'sitemap'
import pretty from 'pretty'
import createTag from 'html-tag'
import { format as pathFormat, join as pathJoin, sep } from 'path'
import { resolve as urlResolve } from 'url'
import template from './template.js'

const isStream = false
const options = { encoding: 'utf8' }
const { assign } = Object

const createRobotsTxt = (hostname) =>
`User-agent: *
Sitemap: ${urlResolve(hostname, 'sitemap.xml')}`

const createMetaTag = (attributes) => createTag('meta', attributes)

const createSitemapImg = ({ who, links }, rootConfig) =>
  []
  .concat(
    [who.avatar || who.inherit && rootConfig.who.avatar],
    links.map(({ icon } = {}) => icon)
  )
  .filter(url => url && !url.includes('http'))
  .map(url => ({ url }))

export default (rootConfig, favicons) => {
  const {
    hostname,
    lang,
    head: { title, prefix, meta } = {}
  } = rootConfig

  const urls = []
  const after = () => !hostname ? [] : [
    ['robots.txt', createRobotsTxt(hostname)],
    ['sitemap.xml', pretty(createSitemap({ hostname, urls }).toString())],
  ]

  const metas = !Array.isArray(meta)
  ? ''
  : meta.filter(attributes => typeof attributes === 'object').map(createMetaTag).join('')

  const headTags = metas + favicons
  const headOpts = { title, prefix, headTags }

  const processor = (data, { out, msg }) => {

    out = out.name === 'index' ? out : assign({}, out, { name: 'index', dir: pathJoin(out.dir, out.name) })

    urls.push({
      url: out.dir.split(process.env.CHIN_OUT)[1].split(sep).join('/'),
      img: createSitemapImg(JSON.parse(data), rootConfig)
    })

    return [
      [
        pathFormat(out),
        data
      ],
      [
        pathFormat(assign({}, out, { ext: '.html' })),
        pretty(template(lang, headOpts), { ocd: true })
      ]
    ]
  }

  return { isStream, options, after, processor }
}