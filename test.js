import assert from 'assert'
import { join } from 'path'
import ahub from './src'
import Html from './src/Html'
import { createTemplate } from './src/bin.action.js'
const put = '.put'
const out = '.out'
it('ahub', () =>
  ahub(
    put,
    out,
    createTemplate(Html, join(put, 'index.json')),
    {
      verbose: true,
      favicons: {},
      sitemap: { hostname: 'http://domain.com' },
      watch: false,
      ignored: []
    }
  )
)