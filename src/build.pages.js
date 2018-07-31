import chin from 'chin'
import { outputFile } from 'fs-extra'
import { join as pathJoin } from 'path'
import plugin from './plugin.js'

const ignored = ['favicons.*']

export default (put, out, rootConfig, favicons) => {
  const json = plugin(rootConfig, favicons)
  return chin({ put, out, ignored, processors: { json } }).then(() =>
    Promise.all(
      json
      .after()
      .map(([ filename, string ]) =>
        outputFile(pathJoin(out, filename), string)
      )
    )
  )
}