import assert from 'assert'
import mock from 'mock-fs'
import { join } from 'path'
import ahub from './src'
import Html from './src/Html'
import { createTemplate, init, create, serve, build } from './src/bin.action.js'

const src = '.put'
const dest = '.out'

describe('with mock tree', () => {

  it('ahub', () =>
    ahub(src, dest, createTemplate(Html, join(src, 'index.json')), {
      favicons: {},
      sitemap: false,
      ignored: [],
      watch: false
    })
  )

  it('bin.init', () => init(src, dest))
  it('bin.create', () => create(`${src}/created.json`))
  it('bin.build', () => build(ahub, { src, dest, Html }))

  beforeEach(() => mock(tree))
  afterEach(() => mock.restore())

  const tree = {
    'node_modules': mock.symlink({ path: 'node_modules' }),
    '_config.json': JSON.stringify({
      src,
      dest,
      ignored: [],
      sitemap: { hostname: 'http://hoge.com' },
      favicons: {},
      chokidar: {},
      browsersync: {}
    }),
    [src]: {
      'index.json': JSON.stringify({
        inherit: false,
        head: {
          title: 'title',
          og: true,
          ga: 'GA_TRACKING_ID',
          tags: [
            ['meta', { charSet: 'utf8' }]
          ]
        },
        body: {
          background: 'silver',
          color: '#ffffff',
          header: {
            image: '',
            title: '',
            description: ''
          },
          links: [
            {
              title: '',
              href: '',
              image: '',
              hub: ''
            }
          ]
        }
      }),
      'page1.json': JSON.stringify({
        inherit: true,
        body: {
          header: {
            image: '',
            title: '',
            description: ''
          },
          links: [
            {
              title: '',
              href: '',
              image: '',
              hub: ''
            }
          ]
        }
      })
    }
  }
})

/*

import { writeJson, remove } from 'fs-extra'

describe('bin.action.js', () => {

  const configPath = '_config.test.json'
  const config = {
    browsersync: {
      open: false,
      logLevel: 'debug'
    }
  }

  beforeEach(() => writeJson(configPath, config))
  afterEach(() => remove(configPath))

  it('serve', () =>
    serve(ahub, { src, dest, Html, configPath })
    .then(bs => bs.exit())
  )
})

*/