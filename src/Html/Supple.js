import React from 'react'
import Atra from 'atra'

export default ({ height, margin, flexLength, blankLength }) =>
<div {...{
  style: {
    height,
    width: `${1 / flexLength * 100 * blankLength}%`,
    padding: `20px ${20 * blankLength}px`,
    // margin: `0px ${margin * blankLength}px ${margin}px 0px`
    margin: `0px ${margin * blankLength}px ${margin}px ${margin * blankLength}px`
  }
}} />