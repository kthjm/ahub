# ahub

[![npm](https://img.shields.io/npm/v/ahub.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/ahub)
[![npm](https://img.shields.io/npm/dm/ahub.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/ahub)
[![Build Status](https://img.shields.io/circleci/project/github/kthjm/ahub.svg?logo=circleci&longCache=true&style=flat-square)](https://circleci.com/gh/kthjm/ahub)
[![Coverage Status](https://img.shields.io/codecov/c/github/kthjm/ahub.svg?longCache=true&style=flat-square)](https://codecov.io/github/kthjm/ahub)

Generate site that is not blog, but a hub.

```shell
yarn add -D ahub
yarn ahub init [src] [dest]
yarn ahub serve
```

## Page.json
```js
{
  inherit: boolean,
  lang: '',
  head: {},
  body: {}
}
```

#### head
- `title: string`
- `og: boolean`
- `ga: string`
- [`tags: []`](https://github.com/jonschlinkert/html-tag)

#### body
- `background`
- `color`
- `header`
  - `image`
  - `title`
  - `description`
- `links: []`
  - `title`
  - `href`
  - `image`
  - `hub`

## _config.json
```js
{
  src: '',
  dest: '',
  ignored: [],
  sitemap: {},
  favicons: {},
  chokidar: {},
  browsersync: {}
}
```

#### common
- `src`
- `dest`
- [`ignored`](https://github.com/jergason/recursive-readdir)

#### command: `serve`
- [`chokidar`](https://github.com/paulmillr/chokidar)
- [`browsersync`](https://browsersync.io/docs/options)

#### command: `build`
- [`sitemap`](https://github.com/ekalinin/sitemap.js)
- [`favicons`](https://github.com/itgalaxy/favicons)
  - Because [#226](https://github.com/itgalaxy/favicons/pull/226), it needs `yarn add -D core-js` temporarily.


## CLI
```shell
  Usage: ahub [options] [command]

  Options:

    -v, --version                 output the version number
    -h, --help                    output usage information

  Commands:

    init [src] [dest]
    create [options] <page...>
    serve [options] [src] [dest]
    build [options] [src] [dest]
```

## License
MIT (http://opensource.org/licenses/MIT)
