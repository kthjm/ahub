import * as chin from 'chin'
import { relative as pathRelative, sep as pathSep } from 'path'
import plugin from './plugin.js'

const defaultIgnored = [
  'node_modules**',
  '.gitignore',
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

  const json = plugin(options)

  const build = watch ? chin.watch : chin.chin

  ignored = [].concat(
    defaultIgnored,
    isBelong(out, put) ? [ out ] : [],
    Array.isArray(ignored) ? ignored : []
  )

  watch = Object.assign({}, { ignored, ignoreInitial: true }, watch)

  return build({ put, out, verbose, watch, ignored, processors: { json } })
  .then(watcher => {})
  .then(() => json.after())
}