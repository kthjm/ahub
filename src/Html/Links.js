import React from 'react'
import Atra from 'atra'
import { Hidden, arr2nesty } from './util.js'

const LENGTH = 2
const BLOCK_MARGIN = 4

export default ({ links, rowLength }) =>
<Links {...{
  links,
  rowLength: typeof rowLength === 'number' && rowLength > 0 ? rowLength : LENGTH
}} />

const Links = ({ links, rowLength }) =>
<div {...{ style: { color: '#b7b7b7' } }}>
  {arr2nesty(links, rowLength).map((rowLinks, rowLinksIndex) =>
  <div key={rowLinksIndex} style={{ display: 'flex' }}>

    {rowLinks.map(({ href, image, title, hub }, linkIndex) =>
    <Link key={linkIndex} {...{ width: 1 / rowLength * 100 + '%', margin: BLOCK_MARGIN }}>
      <Title {...{ title }}  />
      <HrefImage {...{ href, image }} />
      <HrefHub {...{ href: hub }} />
    </Link>)}

    {rowLength - rowLinks.length > 0 && <Supple {...{
      margin: BLOCK_MARGIN,
      flexLength: rowLength,
      blankLength: rowLength - rowLinks.length
    }} />}

  </div>)}
</div>

const Link = (a =>

({ width, margin, children }) =>
<div {...a('LINK', {
  style: { width, margin },
  children
})} />

)(Atra({
  LINK: {
    style: {
      borderRadius: 3,
      padding: '5px 20px 10px',
      height: 'auto',
      backgroundColor: '#f7f7f7'
    }
  }
}))

const Title = (a =>

({ title }) =>
<div {...a('BLOCK')}>
  {!title
    ? <Hidden type={'span'} attributes={a('INLINE')} />
    : <span {...a('INLINE')}>{title}</span>}
</div>

)(Atra({
  BLOCK: {
    style: {
      textAlign: 'center',
      fontSize: '0.85em',
      fontWeight: 100,
      letterSpacing: 1
    }
  },
  INLINE: {
    style: {
      borderBottom: 'solid 1px',
      padding: '0px 4px'
    }
  }
}))

const HrefImage = (a =>

({ href, image }) =>
<a {...a('HREF', href && { href, target: '_blank' })}>
  <div {...a('IMAGE', { style: { backgroundImage: `url(${image})` } })} />
</a>

)(Atra({
  HREF: {
    style: {
      display: 'block',
      maxWidth: 120,
      height: 120,
      margin: '12px auto 10px'
    }
  },
  IMAGE: {
    style: {
      height: '100%',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  }
}))

const HrefHub = (a =>

({ href }) =>
!href
?
<Hidden type={'div'} />
:
<div {...a('WRAP')}>
  <a {...a('HREF', { href })}>
    {'< hub >'}
  </a>
</div>

)(Atra({
  WRAP: {
    style: {
      textAlign: 'center'
    }
  },
  HREF: {
    style: {
      textDecoration: 'none',
      color: 'inherit',
      fontWeight: 'bold'
    }
  }
}))

const Supple = ({ margin, flexLength, blankLength }) =>
<div {...{
  style: {
    width: `${1 / flexLength * 100 * blankLength}%`,
    padding: `20px ${20 * blankLength}px`,
    margin: `0px ${margin * blankLength}px ${margin}px ${margin * blankLength}px`
  }
}} />