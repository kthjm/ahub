import * as chin from 'chin'
import imagemin from 'chin-plugin-imagemin'
import { relative as pathRelative, sep as pathSep } from 'path'
import json2html from './chin-plugin-json-to-html.js'
import { CONFIG, FAVICONS, IMAGE } from './variables.js'

const defaultIgnored = [
  CONFIG,
  `${FAVICONS}.*`,
  'node_modules**',
  '.git**',
  'README.md',
  'LICENSE',
  'package.json',
  'yarn.lock',
  'yarn-error.log',
]

const img2min = imagemin()

const createProcessors = (json) => [
  [IMAGE, {
    svg: img2min,
    png: img2min,
    jpg: img2min,
    jpeg: img2min,
    gif: img2min
  }],
  ['*', {
    json
  }]
]

const isBelong = (child, parent) =>
  pathRelative(child, parent)
  .split(pathSep)
  .every(splited => splited === '..')

export default (
  put,
  out,
  template,
  pluginOpts,
  { verbose, ignored: userIgnored, watch: userWatch, }
) => {
  const build = chin[userWatch ? 'watch' : 'chin']
  const json = json2html(template, pluginOpts)
  const ignored = [].concat(
    defaultIgnored,
    isBelong(out, put) ? [ out ] : [],
    Array.isArray(userIgnored) ? userIgnored : []
  )

  return build({
    put,
    out,
    verbose,
    ignored,
    processors: createProcessors(json),
    watch: Object.assign({ ignored, ignoreInitial: true }, userWatch)
  })
  .then(watcher => ({
    watcher,
    sitemaps: typeof json.sitemaps === 'function' ? json.sitemaps() : undefined
  }))
}