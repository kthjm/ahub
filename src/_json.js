import { resolve } from 'url'

export const createConfig = (src, dest = '') => ({
  src,
  dest,
  sitemap: {
    hostname: 'https://foo.bar'
  },
  favicons: {
    appName: '',
    appDescription: ''
  },
  watch: {},
  ignored: []
})

export const createPage = (isIndex, embed) =>
!isIndex
? {
  inherit: true,
  body: bodyUnique(embed)
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
  body: Object.assign({ background: 'silver', color: '#ffffff' }, bodyUnique(embed))
}

const bodyUnique = ({ title, hub1, hub2 } = {}) => ({
  header: {
    image: 'https://imgplaceholder.com/420x420/f3f3f3/c0c0c0/glyphicon-user?text=ahub&font-size=200',
    title: title || '{ title }',
    description: '{ description }'
  },
  links: !hub1
  ? [ link() ]
  : [ link({ title: 'title' }), link({ hub: hub1 }), link({ title: 'title', hub: hub2 || hub1 }) ]
})

const link = ({ title = '', hub = '' } = {}) => ({
  title: title,
  href: 'https://github.com/',
  image: 'https://image.flaticon.com/icons/svg/25/25231.svg',
  hub: hub && resolve('/', hub)
})

/*

{
  inherit: boolean,
  lang: '',
  head: {
    title: '',
    og: boolean,
    ga: '',
    tags: [
      ['tag', attribs, 'text']
    ]
  },
  body: {
    background: '',
    color: '',
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
}

*/