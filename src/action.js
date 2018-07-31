import chin from 'chin'
import { require as rooquire } from 'app-root-path'
import plugin from './plugin.js'

export default ({ put }) => Promise.resolve().then(() => {
  console.log(put)
  const rootConfig = requireRootConfig(put)
  console.log(rootConfig)
  // const favicons = await buildFavicons(rootConfig)
  // return buildPages(rootConfig, favicons)
})

const requireRootConfig = (put) => {
  let rootConfig
  try {
    rootConfig = rooquire(`${put}/index.json`)
  }
  catch (err) {
    throw err
  }
  return rootConfig
}

const outputFiles = (files) => Promise.all(files.map(arg => outputFile(...arg)))
const arrjoin = (arr) => arr.join()

const buildFavicons = (rootConfig) => {
  const { processor, after } = favicons(rootConfig.favicons)
  return Promise
  .all([
    readFile('favicons.png'),
    { out: process.env.CHIN_OUT + 'favicons.png', msg: () => {}, on: () => {} }
  ])
  .then(processor)
  .then(outputFiles)
  .then(after)
  .then(arrjoin)
}

const buildPages = (rootConfig, favicons) => {
  const json = plugin(rootConfig, favicons)
  return requireIgnored()
  .then(ignored =>
    chin({
      put,
      out,
      ignored,
      verbose: true,
      processors: { json }
    })
  )
  .then(() =>
    outputFile(
      process.env.CHIN_OUT + '/sitemap.xml',
      json.sitemap()
    )
  )
}