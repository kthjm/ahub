import assert from 'assert'
import action from './src/hrehub.js'
const put = 'example'
const out = 'example.out'
it('action', () => action(put, out))