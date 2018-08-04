import React from 'react'
import Atra from 'atra'

export default (a =>

({ width, height, margin, children }) =>
<div {...a('BLOCK', { style: { width, height, margin } })}>
  {children}
</div>

)(Atra({
  BLOCK: {
    style: {
      borderRadius: 3,
      padding: 20,
      // backgroundColor: '#F1F3F1'
      backgroundColor: '#f7f7f7'
    }
  }
}))

export const HrefImage = (a =>

({ href, src }) =>
<a {...a('HREF', { href })}>
  <div {...a('IMAGE', { style: { backgroundImage: `url(${src})` } })} />
</a>

)(Atra({
  HREF: {
    target: '_blank',
    style: {
      display: 'block',
      maxWidth: 120,
      height: '70%',
      margin: '7px auto 22px'
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

export const HrefHub = (a =>

({ href, color }) =>
<div {...a('WRAP')}>
  <a {...a('HREF', { href, style: { color } })}>
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
      color: '#a9a9a9',
      // color: '#424242',
      fontWeight: 'bold'
    }
  }
}))