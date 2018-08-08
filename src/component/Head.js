import React, { Fragment } from 'react'

const OG_PREFIX = 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#'

const Head = ({ og, ga, title, embed }) =>
<head prefix={!og ? undefined : OG_PREFIX}>
  {ga && <Fragment>
  <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}></script>
  <script dangerouslySetInnerHTML={{ __html: gtag(ga) }} />
  </Fragment>}
  {title && <title>{title}</title>}
  <link {...{ type: 'text/css', rel: 'stylesheet', href: '/_ahub.css' }} />
  <script dangerouslySetInnerHTML={{ __html: `(${setBodyFontSize.toString()})()` }} />
  {embed}
</head>

/* https://developers.google.com/analytics/devguides/collection/gtagjs/ */
const gtag = (id) => `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`

const setBodyFontSize = () => {
  const sheet = document.createElement('style')
  sheet.innerHTML = navigator.userAgent.toLowerCase().includes('mobile')
  ? `
  body {
    font-size: 2em;
  }
  `
  : `
  body {
    font-size: 1em;
  }
  main {
    max-width: 840px;
  }
  `
  document.head.appendChild(sheet);
}

export default Head