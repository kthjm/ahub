import * as chin from 'chin'
import { relative as pathRelative, sep as pathSep } from 'path'
import { CONFIG, FAVICONS } from './variables.js'

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

const isBelong = (child, parent) =>
  pathRelative(child, parent)
  .split(pathSep)
  .every(splited => splited === '..')

export default ({
  put,
  out,
  verbose,
  processors,
  ignored: userIgnored,
  watch: userWatch,
}) => {
  const build = chin[userWatch ? 'watch' : 'chin']

  const ignored = [].concat(
    defaultIgnored,
    isBelong(out, put) ? [ out ] : [],
    Array.isArray(userIgnored) ? userIgnored : []
  )

  const watch = Object.assign({ ignored, ignoreInitial: true }, userWatch)

  return build({ put, out, verbose, processors, ignored, watch })
}