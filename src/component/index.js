import React from 'react'
import h2r from 'react-html-parser'
import createTag from 'html-tag'
import Head from './Head.js'
import Body from './Body.js'

const Ahub = (props = {}) => <Html {...normalizeProps(props)} />

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
  head: normalizeHead(inherit, head, indexJson.head, faviconsHtml),
  body: normalizeBody(inherit, body, indexJson.body)
})

const normalizeHead = (
  inherit,
  { title, og, ga, tags } = {},
  indexHead = {},
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
  { background, color, linksRowLength, header, links } = {},
  { background: indexBackground, color: indexColor, linksRowLength: indexLinksRowLength } = {},
) =>
!inherit
? {
  background,
  color,
  linksRowLength,
  header,
  links
}
: {
  background:     background     || indexBackground,
  color:          color          || indexColor,
  linksRowLength: linksRowLength || indexLinksRowLength,
  header,
  links
}

const tags2markup = (tags) =>
  !Array.isArray(tags)
  ? ''
  : tags.filter(Array.isArray).map(arg => createTag(...arg)).join('')

export default Ahub