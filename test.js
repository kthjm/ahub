import assert from 'assert'
import mock from 'mock-fs'
import { join } from 'path'
import ahub from './src'
import component from './src/component'
import { createTemplate, init, create, serve, build } from './src/bin.action.js'

const src = '.put'
const dest = '.out'

describe('flow', () => {
  
  before(() => mock({
    'node_modules': mock.symlink({ path: 'node_modules' }),
    'assets': {
      '_ahub.css': 'body { margin:0; }'
    }
  }))

  after(() => mock.restore())

  it('init => create => build', () =>
    init(src, dest)
    .then(() => create(`${src}/created.json`))
    .then(() => build(ahub, { src, dest, component }))
  )

  it('ahub', () =>
    ahub(src, dest, createTemplate(component, join(src, 'index.json')), {
      favicons: {},
      sitemap: false,
      ignored: [],
      watch: false
    })
  )
})

/*

import { outputFile, remove } from 'fs-extra'

describe('bin.action.js', () => {

  it('serve', () =>
    serve(ahub, { src, dest, component, configPath })
    .then(bs => bs.exit())
  )
})

*/