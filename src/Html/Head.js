import React, { Fragment } from 'react'

const ogPrefix = 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#'

// https://developers.google.com/analytics/devguides/collection/gtagjs/
const gtag = (id) => `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`

const Ga = ({ id }) =>
<Fragment>
  <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`}></script>
  <script dangerouslySetInnerHTML={{ __html: gtag(id) }} />
</Fragment>

export default ({ title, og, ga, embed }) =>
<head prefix={!og ? undefined : ogPrefix}>
  {ga && <Ga id={ga} />}
  {title && <title>{title}</title>}
  {embed}
</head>