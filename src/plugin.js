import { createSitemap } from 'sitemap'
import template from './template.js'

const isStream = false
const options = { encoding: 'utf8' }

const createSitemapImg = ({ who, urls }, rootConfig) =>
  []
  .concat(
    [who.avatar || who.inherit && rootConfig.who.avatar],
    urls.map(({ icon }) => icon)
  )
  .filter(url => url && !url.includes('http'))
  .map(url => ({ url }))

export default (rootConfig, favicons) => {
  
  const { hostname, metas } = rootConfig
  const urls = []
  const sitemap = () => createSitemap({ hostname, urls }).toString()
  
  const processor = (data, { out, msg }) => {
    
    out = out.name === 'index'
    ? out
    : assign({}, out, { dir: join(out.dir, out.name), name: 'index' })
    
    const outpath = format(out)
    
    urls.push({
      url: outpath.split(process.env.CHIN_OUT)[1],
      img: createSitemapImg(JSON.parse(data), rootConfig)
    })
    
    return [
      [outpath, data],
      [format(assign({}, out, { ext: '.html' })), template({ heads: rootConfig.metas + favicons })]
    ]
  }
  
  return { isStream, options, sitemap, processor }
}