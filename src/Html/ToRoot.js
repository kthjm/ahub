import React from 'react'
import Atra from 'atra'

const icon = '</>'

export default () =>
<div {...a('FIXED')}>
  <a {...a('HREF')}>
    {icon}
  </a>
</div>

const a = Atra({
  FIXED: {
    style: {
      position: 'fixed',
      top: 0,
      right: 0
    }
  },
  HREF: {
    href: '/',
    style: {
      color: 'inherit',
      display: 'block',
      fontSize: '3em',
      lineHeight: 1.2,
      fontWeight: 'bold',
      padding: '6px 12px',
      textDecoration: 'none'
    }
  }
})