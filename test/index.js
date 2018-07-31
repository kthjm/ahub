import assert from 'assert'
import mock from 'mock-fs'
// import { join, format } from 'path'
// import { Transform } from 'stream'
// import { chin, watch } from './src'

const { assign } = Object

const put = 'dir/put'
const out = 'dir/out'
const tree = {
  'node_modules': mock.symlink({ path: 'node_modules' }),
  [put]: {
    '1.txt': 'contents',
    'dir1': {
      '1.txt': 'contents',
      '2.txt': 'contents',
      '3.txt': 'contents',
      '4.txt': 'contents'
    },
    'dir2': {
      '1.txt': 'contents',
      '2.txt': 'contents',
      '3.txt': 'contents',
      '4.txt': 'contents'
    }
  }
}

// beforeEach(() => mock(tree))
// afterEach(() => mock.restore())

describe('', () => {
  it('', () => {
    const template = require('../src/template.js').default
    console.log(template())
  })
})