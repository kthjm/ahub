import { createElement } from 'react'

export const Hidden = ({ type, attributes = {} }) => createElement(
  type || 'div',
  Object.assign({}, attributes, {
    style: Object.assign({}, attributes.style, {
      visibility: 'hidden'
    })
  }),
  '.'
)