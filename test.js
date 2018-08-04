import assert from 'assert'
import action from './src/index.js'
const put = '.put'
const out = '.out'
it('action', () =>
  action(put, out, {
    verbose: true,
    favicons: {},
    sitemap: {
      hostname: 'http://domain.com'
    },
    indexJson: {},
    watch: false,
    ignored: []
  })
)