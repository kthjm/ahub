import { outputFile } from 'fs-extra'
import { parse, extname, normalize, sep } from 'path'
import { throws, SRC, DEST, CONFIG } from './util.js'

const space = '\t'

export default (names) =>
Promise.all(names.map(name => {
  const outpath = normalize(extname(name) === '.json' ? name : `${name}.json`)
  const splited = outpath.split(sep)
  const json = splited[splited.length - 1] === 'index.json'
  ? indexJson
  : inheritJson
  return outputFile(outpath, JSON.stringify(json, null, space))
}))

const body = {
  background: '',
  header: {
    color: '',
    avatar: '',
    title: '',
    description: ''
  },
  links: [
    {
      href: '',
      src: '',
      hub: ''
    }
  ]
}

const indexJson = {
  lang: '',
  head: {
    title: '',
    og: true,
    ga: '',
    tags: []
  },
  body
}

const inheritJson = {
  lang: '',
  head: {
    inherit: true
  },
  body
}