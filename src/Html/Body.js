import React from 'react'
import Atra from 'atra'
import Header from './Header.js'
import Block, { HrefImage, HrefHub } from './Block.js'
import Supple from './Supple.js'
import ToRoot from './ToRoot.js'
import { num2arr, arr2nesty } from '../util.js'

const LENGTH = 3
const BLOCK_HEIGHT = 190
const BLOCK_MARGIN = 4

export default (a =>

({ pathname, background, header = {}, links = [] }) =>
<body {...a('BODY', { style: { background } })}>
  {
    pathname !== '/' &&
    <ToRoot color={header.color || 'inherit'} />
  }
  <main {...a('WIDTH')}>
    <Header {...header} />
    {arr2nesty(links, LENGTH).map((rowLinks, rowLinksIndex) =>
      <div key={rowLinksIndex} style={{ display: 'flex' }}>
        {rowLinks.map(({ href, src, hub }, linkIndex) =>
          <Block key={linkIndex} {...{
            width: 1 / LENGTH * 100 + '%',
            height: BLOCK_HEIGHT,
            margin: BLOCK_MARGIN
          }}>
            <HrefImage {...{ href, src }} />
            {hub && <HrefHub href={hub} color={background} />}
          </Block>
        )}
        {
          LENGTH - rowLinks.length > 0 &&
          <Supple {...{
            height: BLOCK_HEIGHT,
            margin: BLOCK_MARGIN,
            flexLength: LENGTH,
            blankLength: LENGTH - rowLinks.length
          }} />
        }
      </div>
    )}
  </main>
</body>

)(Atra({
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
}))

/*

const BLOCK_HEIGHT = 280
const BLOCK_HEIGHT = 240
const BLOCK_MARGIN = 8

{
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
  keepUnprefixed: true
}
const bs = 'dotted'
const bs = 'double'
const bs = 'solid'
const bw = 12

const relativeBorderStyle = (parentIndex, childIndex) =>
parentIndex === 0
? childIndex === 0
  ? bs
  : `${bs} ${bs} ${bs} none`
: childIndex === 0
  ? `none ${bs} ${bs} ${bs}`
  : `none ${bs} ${bs} none`

const relativeMargin = (parentIndex, childIndex, value) =>
  parentIndex === 0
  ? childIndex === 0
    ? value
    : `${value}px ${value}px ${value}px 0px`
  : childIndex === 0
    ? `0px ${value}px ${value}px ${value}px`
    : `0px ${value}px ${value}px 0px`

margin: relativeMargin(rowLinksIndex, linkIndex, BLOCK_MARGIN)

*/