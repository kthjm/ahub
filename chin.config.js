const { format, sep, join, resolve } = require('path')

const out = resolve(__dirname, 'public')

const { assign } = Object

const json = {
  isStream: false,
  options: { encoding: 'utf8' },
  processor: (data, { out, msg }) => {
    
    out = out.name === 'index'
    ? out
    : assign(out, { dir: join(out.dir, out.name), name: 'index' })
    
    return [
      [format(out), data],
      [format(assign({}, out, { ext: '.html' })), '<div></div>']
    ]
  }
}

module.exports = [
  { after: () => {} },
  { put: resolve(__dirname, 'assets'), out, processors: { json } },
  { put: resolve(__dirname, '.default'), out }
]