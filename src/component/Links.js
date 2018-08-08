import React from 'react'
import { Hidden, arr2nesty } from './util.js'

const LENGTH       = 2
const BLOCK_MARGIN = 4
const COLOR        = '#b7b7b7'

export default ({ links, rowLength }) =>
<Links {...{
  links,
  rowLength: typeof rowLength === 'number' && rowLength > 0 ? rowLength : LENGTH
}} />

const Links = ({ links, rowLength }) =>
<div {...{ style: { color: COLOR } }}>
  {arr2nesty(links, rowLength).map((rowLinks, rowLinksIndex) =>
  <div key={rowLinksIndex} className={'links_container'}>

    {rowLinks.map((link, linkIndex) =>
    <LinkBlock
      key={linkIndex}
      width={1 / rowLength * 100 + '%'}
      {...link}
    />)}

    {rowLength - rowLinks.length > 0 &&
    <SuppleBlock {...{
      margin: BLOCK_MARGIN,
      flexLength: rowLength,
      blankLength: rowLength - rowLinks.length
    }} />}

  </div>)}
</div>

const LinkBlock = ({ width, title, image, href, hub }) =>
<div className={'link_block'} {...{ style: { width } }}>

  <div className={'link_title'}>
    {!title ? <Hidden type={'span'} /> : <span>{title}</span>}
  </div>

  <a className={'link_href'} {...(href && { href, target: '_blank' })}>
    <div {...{ style: { backgroundImage: `url(${image})` } }} />
  </a>

  {hub &&
  <div className={'link_hub'}>
    <a {...{ href: hub }}>
      {`<${hub}>`}
    </a>
  </div>}

</div>

const SuppleBlock = ({ margin, flexLength, blankLength }) =>
<div {...{
  style: {
    width: `${1 / flexLength * 100 * blankLength}%`,
    padding: `20px ${20 * blankLength}px`,
    margin: `0px ${margin * blankLength}px ${margin}px ${margin * blankLength}px`
  }
}} />

/*

<Link key={linkIndex} {...{ width: 1 / rowLength * 100 + '%' }}>
  <Title {...{ title }}  />
  <HrefImage {...{ href, image }} />
  {hub && <HrefHub {...{ href: hub }} />}
</Link>

const Link = ({ width, children }) =>
<div className={'link_block'} {...{ style: { width } }}>
  {children}
</div>

const Title = ({ title }) =>
<div className={'link_title'}>
  {!title ? <Hidden type={'span'} /> : <span>{title}</span>}
</div>

const HrefImage = ({ href, image }) =>
<a className={'link_href'} {...(href && { href, target: '_blank' })}>
  <div {...{ style: { backgroundImage: `url(${image})` } }} />
</a>

const HrefHub = ({ href }) =>
<div className={'link_hub'}>
  <a {...{ href }}>
    {`<${href}>`}
  </a>
</div>

*/