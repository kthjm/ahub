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
  inherited = {},
  headEmbedHtml
}) => ({
  pathname,
  lang: !inherit ? lang : lang || inherited.lang,
  head: normalizeHead(inherit, head, inherited.head, typeof headEmbedHtml === 'string' ? headEmbedHtml : ''),
  body: normalizeBody(inherit, body, inherited.body)
})

const normalizeHead = (
  inherit,
  { title, og, ga, tags } = {},
  inheritedHead = {},
  headEmbedHtml
) =>
!inherit
? {
  title,
  og,
  ga,
  embed: h2r(tags2markup(tags) + headEmbedHtml)
}
: {
  title: title || inheritedHead.title,
  og:    og    || inheritedHead.og,
  ga:    ga    || inheritedHead.ga,
  embed: h2r((tags2markup(tags) || tags2markup(inheritedHead.tags)) + headEmbedHtml)
}

const normalizeBody = (
  inherit,
  { background, color, icon, title, href, description, links } = {},
  inheritedBody = {}
) =>
!inherit
? {
  background,
  color,
  header: {
    icon,
    title,
    href,
    description,
  },
  links
}
: {
  background: background || inheritedBody.background,
  color:      color      || inheritedBody.color,
  header: {
    icon,
    title,
    href,
    description,
  },
  links: normalizeLinks(inherit, links, inheritedBody.links)
}

const normalizeLinks = (
  inherit,
  { background, color, rowLength, contents } = {},
  inheritedLinks = {}
) =>
!inherit
? {
  background,
  color,
  rowLength,
  contents
}
: {
  background: background || inheritedLinks.background,
  color:      color      || inheritedLinks.color,
  rowLength:  rowLength  || inheritedLinks.rowLength,
  contents
}

const tags2markup = (tags) =>
  !Array.isArray(tags)
  ? ''
  : tags.filter(Array.isArray).map(arg => createTag(...arg)).join('')

export default Ahub