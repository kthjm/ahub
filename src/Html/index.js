import React from 'react'
import h2r from 'react-html-parser'
import createTag from 'html-tag'
import Head from './Head.js'
import Body from './Body.js'

export default (props) => <Html {...normalizeProps(props)} />

const Html = ({ pathname, lang, head, body }) =>
<html {...{ lang }}>
  <Head {...head} />
  <Body {...body} {...{ pathname }} />
</html>

const normalizeProps = ({
  lang,
  head: { inherit, title, og, ga, tags } = {},
  body = {},
  pathname,
  indexJson = {},
  faviconsHtml = ''
}) => ({
  pathname,
  lang: lang || indexJson.lang,
  head: !inherit
  ? {
    title,
    og,
    ga,
    embed: h2r(tags2markup(tags) + faviconsHtml)
  }
  : {
    title: title || indexJson.head.title,
    og:    og    || indexJson.head.og,
    ga:    ga    || indexJson.head.ga,
    embed: h2r((tags2markup(tags) || tags2markup(indexJson.head.tags)) + faviconsHtml)
  },
  body
})

const tags2markup = (tags) =>
  !Array.isArray(tags)
  ? ''
  : tags.filter(Array.isArray).map(arg => createTag(...arg)).join('')