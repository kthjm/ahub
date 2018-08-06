import { pathExists, outputFile } from 'fs-extra'
import { join as pathJoin } from 'path'
import { throws } from './util.js'
import { FAVICONS } from './variables.js'

const files = [
  'svg',
  'png',
  'jpg',
  'jpeg'
].map(ext => `${FAVICONS}.${ext}`)

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
      Object.assign({}, config, { path: `/${FAVICONS}` })
    )
    .then(({ html, images, files }) =>
      Promise
      .all(
        []
        .concat(images, files)
        .map(({ name, contents }) =>
          outputFile(pathJoin(out, FAVICONS, name), contents)
        )
      )
      .then(() =>
        html.join('')
      )
    )
  )