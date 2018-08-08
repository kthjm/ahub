import React from 'react'
import h2r from 'react-html-parser'
import Links from './Links.js'

const Body = ({
  pathname,
  background,
  color,
  linksRowLength,
  header = {},
  links = []
}) =>
<body {...{ style: { background, color } }}>
  {pathname !== '/' && <ToRoot />}
  <main>
    <Header {...header} />
    <Links {...{ links, rowLength: linksRowLength }} />
  </main>
</body>

const ToRoot = () =>
<div id={'to_root'}>
  <a href={'/'}>
    {'</>'}
  </a>
</div>

const Header = ({ image, title, href, description }) =>
<header>
  {image &&
  <div id={'header_image'}>
    <div {...{ style: { backgroundImage: `url(${image})` } }} />
  </div>}
  {!title && !href ? false :
  <h1 id={'header_title'}>
    <a {...(href && { href, target: '_blank' })}>
      {title || href}
    </a>
  </h1>}
  {description &&
  <div id={'header_description'}>
    {h2r(description)}
  </div>}
</header>

export default Body