import React from 'react'
import Atra from 'atra'

export default ({ image, title, description }) =>
<header {...a('HEADER')}>
  {image && <div><div {...a('IMAGE', { style: { backgroundImage: `url(${image})` } })} /></div>}
  {title && <h1>{title}</h1>}
  {description && <p>{description}</p>}
</header>

const a = Atra({
  HEADER: {
    style: {
      padding: '30px 0px',
      textAlign: 'center'
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
  }
})