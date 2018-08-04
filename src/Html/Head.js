import React from 'react'

const ogPrefix = 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#'

const Ga = ({ id }) => <script></script>

export default ({ title, og, ga, embed }) =>
<head prefix={!og ? '' : ogPrefix}>
  {title && <title>{title}</title>}
  {embed}
  {ga && <Ga id={ga} />}
</head>