import React from 'react'
import Atra from 'atra'

export default ({ color, avatar, name, description }) =>
<header {...a('HEADER', { style: { color } })}>
  <div {...a('')}><img {...a('AVATAR', { src: avatar })} /></div>
  <h1 {...a('')}>{name}</h1>
  <p {...a('')}>{description}</p>
</header>

const a = Atra({
  HEADER: {
    style: {
      padding: '60px 0px 30px',
      textAlign: 'center'
    }
  },
  AVATAR: {
    style: {
      width: 110,
      height: 110
    }
  }
})