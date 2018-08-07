import React from 'react'
import h2r from 'react-html-parser'
import Atra from 'atra'

export default ({ image, title, href, description }) =>
<header {...a('HEADER')}>

  {image &&
  <div {...a('IMAGE_WRAP')}>
    <div {...a('IMAGE', { style: { backgroundImage: `url(${image})` } })} />
  </div>}

  {!title && !href ? false :
  <a {...a('TITLE_HREF', href && { href, target: '_blank' })}>
    <h1>{title || href}</h1>
  </a>}

  {description &&
  <div>
    {h2r(description)}
  </div>}

</header>

const a = Atra({
  HEADER: {
    style: {
      margin: '30px 0px',
      textAlign: 'center'
    }
  },
  IMAGE_WRAP: {
    style: {
      marginBottom: '1.34em'
    }
  },
  IMAGE: {
    style: {
      display: 'inline-block',
      width: 110,
      height: 110,
      borderRadius: 3,
      backgroundImage: undefined,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  },
  TITLE_HREF: {
    style: {
      textDecoration: 'none',
      color: 'inherit',
      lineHeight: 1.4
    }
  }
})