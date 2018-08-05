import * as chin from 'chin'
import { relative as pathRelative, sep as pathSep } from 'path'
import { CONFIG } from './bin.action.js'

const defaultIgnored = [
  CONFIG,
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

export default ({
  put,
  out,
  verbose,
  processors,
  userIgnored,
  chokidarOpts,
}) => {
  const build = chin[chokidarOpts ? 'watch' : 'chin']

  const ignored = [].concat(
    defaultIgnored,
    isBelong(out, put) ? [ out ] : [],
    Array.isArray(userIgnored) ? userIgnored : []
  )

  const watch = Object.assign(
    { ignored, ignoreInitial: true },
    chokidarOpts
  )

  return build({ put, out, verbose, processors, ignored, watch })
}