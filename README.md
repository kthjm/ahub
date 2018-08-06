# ahub

[![npm](https://img.shields.io/npm/v/ahub.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/ahub)
[![npm](https://img.shields.io/npm/dm/ahub.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/ahub)
[![Build Status](https://img.shields.io/travis/kthjm/ahub.svg?longCache=true&style=flat-square)](https://travis-ci.org/kthjm/ahub)
[![Coverage Status](https://img.shields.io/codecov/c/github/kthjm/ahub.svg?longCache=true&style=flat-square)](https://codecov.io/github/kthjm/ahub)

Generate site that is not blog, but a hub.

```shell
yarn add -D ahub
yarn ahub init <src> [dest]
yarn ahub serve
```

`page.json`:
```js
{
  inherit: boolean,
  lang: '',
  head: {
    title: '',
    og: boolean,
    ga: '',
    tags: []
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
```
- [`tags`](https://github.com/jonschlinkert/html-tag)

#### inherited
- `lang`
- `head`
- `body.background`
- `body.color`

`_config.json`:
```js
{
  src: '',
  dest: '',
  sitemap: {},
  favicons: {},
  chokidar: {},
  browsersync: {},
  ignored: []
}
```
- [`sitemap`](https://github.com/ekalinin/sitemap.js)
- [`favicons`](https://github.com/itgalaxy/favicons)
- [`chokidar`](https://github.com/paulmillr/chokidar)
- [`browsersync`](https://browsersync.io/docs/options)
- [`ignored`](https://github.com/jergason/recursive-readdir)

```shell

  Usage: ahub [options] [command]

  Options:

    -v, --version                 output the version number
    -h, --help                    output usage information

  Commands:

    init <src> [dest]
    create [options] <page...>
    serve [options] [src] [dest]
    build [options] [src] [dest]
```

## License
MIT (http://opensource.org/licenses/MIT)