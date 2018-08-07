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
  <h1 {...a('TITLE')}>
    <a {...a('TITLE_HREF', href && { href, target: '_blank' })}>
      {title || href}
    </a>
  </h1>}

  {description &&
  <div>
    {h2r(description)}
  </div>}

</header>

const a = Atra({
  HEADER: {
    style: {
      // margin: '30px 0px',
      margin: '2.5em 0px 1em',
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
      // width: 110,
      // height: 110,
      width: '6em',
      height: '6em',
      borderRadius: 3,
      backgroundImage: undefined,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  },
  TITLE: {
    style: {
      lineHeight: 1.4
    }
  },
  TITLE_HREF: {
    style: {
      textDecoration: 'none',
      color: 'inherit'
    }
  }
})