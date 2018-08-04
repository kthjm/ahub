import { readJson } from 'fs-extra'
import { join as pathJoin } from 'path'
import { throws, SRC, DEST, CONFIG } from './util.js'

export default (src, dest, configPath, isWatch, isPro) =>
  Promise.resolve()
  .then(() =>
    typeof configPath === 'string'
    ?
    readJson(configPath)
    :
    readJson(CONFIG).catch(() =>
      readJson('package.json').then(userPackageJson =>
        userPackageJson.ahub ||
        {}
      )
    )
  )
  .then(config => ({
    src:       src  || config.src  || SRC,
    dest:      dest || config.dest || DEST,
    sitemap:   isPro ? config.sitemap : undefined,
    // hostname:  isPro ? config.hostname : undefined,
    favicons:  isPro ? config.favicons || true : undefined,
    watch:     isWatch ? config.watch || true : undefined,
    ignored:   config.ignored,
    indexJson: undefined
  }))
  .then(config =>
    readJson(
      pathJoin(config.src, 'index.json')
    )
    .then(indexJson =>
      Object.assign({}, config, { indexJson })
    )
    .catch(() =>
      throws(`[src]/index.json is required`)
    )
  )