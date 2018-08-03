import { readJson, remove } from 'fs-extra'
import { join as pathJoin } from 'path'
import { throws } from './util.js'
import tuft from '..'

export const SRC = '.'
export const DEST = '.site'
export const CONFIG = 'tuft.json'

const normalizeConfig = (src, dest, configPath, isPro, isWatch) =>
  Promise.resolve()
  .then(() =>
    typeof configPath === 'string'
    ? readJson(configPath)
    : readJson(CONFIG).catch(() =>
      readJson('package.json').then(userPackageJson =>
        userPackageJson.tuft || {}
      )
    )
  )
  .then(config => ({
    src:      src  || config.src  || SRC,
    dest:     dest || config.dest || DEST,
    lang:     config.lang,
    hostname: isPro ? config.hostname : undefined,
    favicons: isPro ? config.favicons || true : undefined,
    watch:    isWatch ? config.watch || true : undefined,
    ignored:  config.ignored,
    head:     undefined
  }))
  .then(config =>
    readJson(
      pathJoin(config.src, 'index.json')
    )
    .then(({ head = {} }) =>
      Object.assign({}, config, { head })
    )
    .catch(() =>
      throws(`[src]/index.json is required`)
    )
  )

export default (src, dest, configPath, isPro, isWatch, quiet) =>
  normalizeConfig(src, dest, configPath, isPro, isWatch)
  .then(({ src, dest, lang, hostname, head, watch, favicons, ignored }) =>
    remove(dest).then(() =>
      tuft(src, dest, {
        lang,
        hostname,
        head,
        watch,
        favicons,
        ignored,
        verbose: !quiet
      })
    )
  )