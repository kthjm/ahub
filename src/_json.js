export const createConfig = (src = '', dest = '') =>
`module.exports = {
  src: '${src}',
  dest: '${dest}',
  ignored: [],
  sitemap: {
    hostname: 'https://foo.com'
  },
  favicons: {},
  chokidar: {},
  browsersync: {}
}`

export const createPage = (isIndex, embed) =>
!isIndex
? {
  inherit: true,
  body: createBody(false, embed)
}
: {
  lang: '',
  inherit: false,
  head: {
    title: '',
    og: false,
    ga: '',
    tags: []
  },
  body: Object.assign({ background: 'silver', color: '#ffffff' }, createBody(true, embed))
}

const createBody = (isIndex, { title, hub } = {}) => ({
  icon: 'https://imgplaceholder.com/150x150/f3f3f3/c0c0c0/glyphicon-picture?font-size=90',
  title: title || '{ title }',
  href: '',
  description: '{ description }',
  links: !isIndex
  ? {
    contents: createContents(hub)
  }
  : {
    background: '',
    color: '',
    rowLength: 2,
    contents: createContents(hub)
  }
})

const createContents = (hub) =>
!hub
? [ createLink() ]
: [ createLink({ title: 'title' }), createLink({ hub: hub }), createLink({ title: 'title', hub: hub }) ]

const createLink = ({ title = '', hub = '' } = {}) => ({
  title: title,
  image: 'https://image.flaticon.com/icons/svg/25/25231.svg',
  href: 'https://github.com/',
  hub: hub
})