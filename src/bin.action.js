import { readJson, remove } from 'fs-extra'
import { join as pathJoin } from 'path'
import tuft from '..'

export const CONFIG_PATH = 'tuft.json'
export const DESTINATION = '.site'

const normalizeConfig = (source, dest, configPath, isPro, isWatch) =>
  Promise.resolve()
  .then(() =>
    typeof configPath === 'string'
    ? readJson(configPath)
    : readJson(CONFIG_PATH).catch(() =>
      readJson('package.json').then(userPackageJson =>
        userPackageJson.tuft || {}
      )
    )
  )
  .then(config => ({
    source:   source || config.source,
    dest:     dest || config.dest || DESTINATION,
    lang:     config.lang,
    hostname: isPro ? config.hostname : undefined,
    favicons: isPro ? config.favicons || true : undefined,
    watch:    isWatch ? config.watch || true : undefined,
    ignored:  config.ignored,
    head:     undefined
  }))
  .then(config =>
    readJson(pathJoin(config.source, 'index.json'))
    .then(({ head = {} }) => Object.assign({}, config, { head }))
  )

export default (source, dest, configPath, isPro, isWatch, quiet) =>
  normalizeConfig(source, dest, configPath, isPro, isWatch)
  .then(({ source, dest, lang, hostname, head, watch, favicons, ignored }) =>
    remove(dest).then(() =>
      tuft(source, dest, {
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