import { pathExists, outputFile } from 'fs-extra'
import { join as pathJoin } from 'path'
import { throws } from './util.js'

const favname = 'favicons'
const favpath = `/_${favname}`

const files = [
  'svg',
  'png',
  'jpg',
  'jpeg'
].map(ext => `${favname}.${ext}`)

export default (put, out, config) =>
  Promise.all(
    files
    .map(file => pathJoin(put, file))
    .map(src => pathExists(src).then(isExist => isExist && src))
  )
  .then(sources =>
    sources
    .find(src => typeof src === 'string')
  )
  .then(src => !src ? '' : require('favicons')(
      src,
      Object.assign({}, config, { path: favpath })
    )
    .then(({ html, images, files }) =>
      Promise
      .all(
        []
        .concat(images, files)
        .map(({ name, contents }) =>
          outputFile(pathJoin(out, favpath, name), contents)
        )
      )
      .then(() =>
        html.join('')
      )
    )
  )