import favicons from 'favicons'
import { pathExists, outputFile } from 'fs-extra'
import { join as pathJoin } from 'path'

const favname = 'favicons'

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
  .then(src =>
    !src
    ? ''
    : favicons(src, Object.assign({}, config, { path: `/${favname}` }))
    .then(({ html, images, files }) =>
      Promise
      .all(
        []
        .concat(images, files)
        .map(({ name, contents }) =>
          outputFile(pathJoin(out, `/${favname}/${name}`), contents)
        )
      )
      .then(() =>
        html.join('')
      )
    )
  )