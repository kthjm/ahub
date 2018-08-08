import React from 'react'
import h2r from 'react-html-parser'
import Links from './Links.js'

const Body = ({
  pathname,
  background,
  color,
  header = {},
  links = {}
}) =>
<body {...{ style: { background: background || undefined, color: color || undefined } }}>
  {pathname !== '/' && <ToRoot />}
  <main>
    <Header {...header} />
    <Links {...links} />
  </main>
</body>

const ToRoot = () =>
<div id={'to_root'}>
  <a href={'/'}>
    {'</>'}
  </a>
</div>

const Header = ({ icon, title, href, description }) =>
<header>
  {icon &&
  <div id={'header_image'}>
    <div {...{ style: { backgroundImage: `url(${icon})` } }} />
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