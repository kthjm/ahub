import assert from 'assert'
import mock from 'mock-fs'
import { join, format } from 'path'

const put = 'dir/put'
const out = 'dir/out'

const node_modules = mock.symlink({ path: 'node_modules' })

const indexJson = {
  hostname: '',
  meta: {},
  who: {},
  links: []
}

const name1Json = {
  
}

const name2Json = {
  
}

const tree = {
  node_modules,
  [put]: {
    'index.json': JSON.stringify(indexJson),
    'name1.json': JSON.stringify(name1Json),
    'name2.json': JSON.stringify(name2Json)
  }
}

beforeEach(() => mock(tree))
afterEach(() => mock.restore())

describe('action', () => {
  
  const action = require('../src/action.js').default
  
  it('', () => {
    console.log(tree)
    return action({ put }).catch(console.error)
  })
})