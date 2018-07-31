import chin from 'chin'
import { readJson } from 'fs-extra'
import { join as pathJoin } from 'path'
import buildFavicons from './build.favicons.js'
import buildPages from './build.pages.js'

const appPut = pathJoin(__dirname, '../app')

const requireRootConfig = (put = '') =>
  readJson(pathJoin(process.cwd(), put, 'index.json'))

export default (put, out) =>
  requireRootConfig(put)
  .then(rootConfig =>
    buildFavicons(put, out, rootConfig)
    .then(favicons => buildPages(put, out, rootConfig, favicons))
  )
  .then(() =>
    chin({ put: appPut, out })
  )