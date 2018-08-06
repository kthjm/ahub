import { createSitemap } from 'sitemap'
import pretty from 'pretty'
import { format as pathFormat, join as pathJoin } from 'path'
import { resolve as urlResolve } from 'url'
import { asserts } from './util.js'

const isStream = false
const options = { encoding: 'utf8' }

export default (template, options) => {

  const { sitemap: sitemapOpts } = options

  const isSitemap = typeof sitemapOpts === 'object' && !Array.isArray(sitemapOpts)

  if (isSitemap) {
    const { hostname } = sitemapOpts
    asserts(typeof hostname === 'string', `hostname is required in sitemap`)
    asserts(hostname.includes('http'), `Protocol is required in sitemap.hostname`)
  }

  let isCreated = false
  const sitemapUrls = []
  const sitemaps = () => {
    isCreated = true
    const urls = sortUrls(sitemapUrls)
    return !urls.length ? undefined : {
      robotsTxt: createRobotsTxt(sitemapOpts.hostname),
      sitemapXml: pretty(createSitemap(Object.assign({}, sitemapOpts, { urls })).toString())
    }
  }

  const processor = (jsonstring, { out }) => {
    const props = JSON.parse(jsonstring)
    const reout = Object.assign(out, { ext: '.html' }, out.name !== 'index' && { dir: pathJoin(out.dir, out.name), name: 'index' })
    const pathname = urlResolve('', reout.dir.split(process.env.CHIN_OUT)[1] || '/')

    if (isSitemap && !isCreated) sitemapUrls.push({ url: pathname, img: createSitemapImg(props) })

    return Promise.resolve()
    .then(() => template(props, pathname))
    .then(html => [
      pathFormat(reout),
      // '<!DOCTYPE html>' + html
      pretty('<!DOCTYPE html>' + html, { ocd: true })
    ])
  }

  return { isStream, options, sitemaps, processor }
}

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

const createSitemapImg = ({ body: { avatar, links = [] } = {} } = {}) =>
  []
  .concat(
    [avatar],
    links.map(({ icon } = {}) => icon)
  )
  .filter(url => url && !url.includes('http'))
  .map(url => ({ url }))