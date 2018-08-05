import React from 'react'
import Atra from 'atra'
import ToRoot from './ToRoot.js'
import Header from './Header.js'
import Links from './Links.js'

const Body = ({
  pathname,
  background,
  color,
  header = {},
  links = []
}) =>
<body {...a('BODY', { style: { background, color } })}>
  {pathname !== '/' && <ToRoot />}
  <main {...a('WIDTH')}>
    <Header {...header} />
    <Links {...{ links }} />
  </main>
  {/* <footer></footer> */}
</body>

const a = Atra({
  BODY: {
    style: {
      margin: 0,
      fontFamily: 'Cousine,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
      letterSpacing: 0.44,
      lineHeight: 1.76,
      height: 'auto'
    }
  },
  WIDTH: {
    style: {
      maxWidth: 870,
      padding: '0px 40px',
      margin: '0px auto 80px'
    }
  },
  LINKS: {
    style: {}
  }
})

export default Body