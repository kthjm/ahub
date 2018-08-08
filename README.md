# ahub

[![npm](https://img.shields.io/npm/v/ahub.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/ahub)
[![npm](https://img.shields.io/npm/dm/ahub.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/ahub)
[![Build Status](https://img.shields.io/circleci/project/github/kthjm/ahub.svg?logo=circleci&longCache=true&style=flat-square)](https://circleci.com/gh/kthjm/ahub)
[![Coverage Status](https://img.shields.io/codecov/c/github/kthjm/ahub.svg?longCache=true&style=flat-square)](https://codecov.io/github/kthjm/ahub)

Generate site that is not blog but a hub.

```shell
yarn add -D ahub
yarn ahub init [src] [dest]
yarn ahub serve
```

## Directory Structure

    _site // dest
    ├─ index.html
    ├─ page1/index.html
    ├─ _favicons/**
    └─ _image/**
    site // src
    ├─ index.json
    ├─ page1.json
    ├─ _favicons.[svg|png|jpg]
    └─ _image/**
    ahub.config.js
    package.json

### [page].json
Transformed to `html`.

### _favicons.[ext]
Passed to [`favicons`](https://github.com/itgalaxy/favicons) as source.

### _image/
Optimized.
- `png`
- `jpg`
- `svg`
- `gif`

## [page].json
```json
{
  "inherit": false,
  "lang": "",
  "head": {},
  "body": {}
}
```

### head
#### `title`
text for `<title>{title}</title>`.

#### `og`
Whether to add prefix to `<head>`.

#### `ga`
GA_TRACKING_ID for [gtagjs](https://developers.google.com/analytics/devguides/collection/gtagjs/).

#### `tags`
Array to contain tuple for [`html-tag`](https://github.com/jonschlinkert/html-tag) params.

### body
```js
{
  "background": "",
  "color": "",
  "icon": "",
  "title": "",
  "href": "",
  "description": "" // able to use html.
  "links": {
    "background": "",
    "color": "",
    "rowLength": 2,
    "contents": [
      {
        "title": "",
        "image": "",
        "href": "", // target="_blank"
        "hub": ""   // target="_self"
      }
    ]
  }
}
```

### inherit
Indicate whether to inherit the following properties from `index.json`.
- `lang`
- `head`
- `body.background`
- `body.color`
- `body.links.background`
- `body.links.color`
- `body.links.rowLength`

## ahub.config.js
```js
module.exports = {
  src: '',
  dest: '',
  ignored: [],
  sitemap: {},
  favicons: {},
  chokidar: {},
  browsersync: {}
}
```

### common
- `src`
- `dest`
- [`ignored`](https://github.com/jergason/recursive-readdir)

### command: `build`
- [`sitemap`](https://github.com/ekalinin/sitemap.js)
- [`favicons`](https://github.com/itgalaxy/favicons)
  - Because [#226](https://github.com/itgalaxy/favicons/pull/226), it may need `yarn add -D core-js` temporarily.

### command: `serve`
- [`chokidar`](https://github.com/paulmillr/chokidar)
- [`browsersync`](https://browsersync.io/docs/options)

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
