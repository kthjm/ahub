import { createSitemap } from 'sitemap'
import pretty from 'pretty'
import { format as pathFormat, join as pathJoin } from 'path'
import { resolve as urlResolve } from 'url'
import { asserts } from './util.js'

const isStream = false
const options = { encoding: 'utf8' }

export default (template, options) => {

  const { sitemap: sitemapOpts } = options
  let sitemaps, isCreated = false
  const sitemapUrls = []
  if (typeof sitemapOpts === 'object' && !Array.isArray(sitemapOpts)) {
    const { hostname } = sitemapOpts
    asserts(typeof hostname === 'string', `hostname is required in sitemap`)
    asserts(hostname.includes('http'), `Protocol is required in sitemap.hostname`)
    sitemaps = () => {
      isCreated = true
      return {
        robotsTxt: createRobotsTxt(hostname),
        sitemapXml: pretty(createSitemap(Object.assign({}, sitemapOpts, { urls: sortUrls(sitemapUrls) })).toString())
      }
    }
  }

  const processor = (jsonstring, { out }) => {
    const props = JSON.parse(jsonstring)
    const reout = Object.assign(out, { ext: '.html' }, out.name !== 'index' && { dir: pathJoin(out.dir, out.name), name: 'index' })
    const pathname = urlResolve('', reout.dir.split(process.env.CHIN_OUT)[1] || '/')

    if (sitemaps && !isCreated) sitemapUrls.push({ url: pathname, img: createSitemapImg(props) })

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