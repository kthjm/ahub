import React from 'react'
import h2r from 'react-html-parser'
import createTag from 'html-tag'
import Head from './Head.js'
import Body from './Body.js'

export default (props) => <Html {...normalizeProps(props)} />

const Html = ({ pathname, lang, head, body }) =>
<html lang={!lang ? undefined : lang}>
  <Head {...head} />
  <Body {...body} {...{ pathname }} />
</html>

const normalizeProps = ({
  inherit,
  lang,
  head,
  body,
  pathname,
  indexJson = {},
  faviconsHtml = ''
}) => ({
  pathname,
  lang: !inherit ? lang : lang || indexJson.lang,
  head: normalizeHead(inherit, indexJson.head, head, faviconsHtml),
  body: normalizeBody(inherit, indexJson.body, body)
})

const normalizeHead = (
  inherit,
  indexHead = {},
  { title, og, ga, tags } = {},
  faviconsHtml
) =>
!inherit
? {
  title,
  og,
  ga,
  embed: h2r(tags2markup(tags) + faviconsHtml)
}
: {
  title: title || indexHead.title,
  og:    og    || indexHead.og,
  ga:    ga    || indexHead.ga,
  embed: h2r((tags2markup(tags) || tags2markup(indexHead.tags)) + faviconsHtml)
}

const normalizeBody = (
  inherit,
  { background: indexBackground, color: indexColor } = {},
  { background, color, header, links } = {}
) =>
!inherit
? {
  background,
  color,
  header,
  links
}
: {
  background: background || indexBackground,
  color:      color      || indexColor,
  header,
  links
}

const tags2markup = (tags) =>
  !Array.isArray(tags)
  ? ''
  : tags.filter(Array.isArray).map(arg => createTag(...arg)).join('')