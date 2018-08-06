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

export const arr2nesty = (array, length) => array.reduce((a, c) =>
  (a[a.length - 1].length === length ? a.push([c]) : a[a.length - 1].push(c)) && a,
  [[]]
)