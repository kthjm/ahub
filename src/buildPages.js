import * as chin from 'chin'
import { relative as pathRelative, sep as pathSep } from 'path'
import plugin from './plugin.js'

const defaultIgnored = [
  'node_modules**',
  '.git**',
  'README.md',
  'LICENSE',
  'favicons.*',
  'package.json',
  'yarn.lock',
  'yarn-error.log',
]

const isBelong = (child, parent) =>
  pathRelative(child, parent)
  .split(pathSep)
  .every(splited => splited === '..')

export default (put, out, verbose, ignored, watch, options) => {
  
  ignored = [].concat(
    defaultIgnored,
    isBelong(out, put) ? [ out ] : [],
    Array.isArray(ignored) ? ignored : []
  )

  const json = plugin(options)

  const config = { put, out, verbose, ignored, processors: { json } }

  return !watch
  ? chin
    .chin(config)
    .then(() => ({ after: json.after() }))
  : chin
    .watch(Object.assign(config, { watch: Object.assign({ ignored, ignoreInitial: true }, watch) }))
    .then(watcher => ({ watcher, after: json.after() }))
}