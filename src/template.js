
export default (lang, headOpts) => `
<!DOCTYPE html>
<html${!lang ? '' : ` lang="${lang}" `}>
  ${head(headOpts)}
  <body>
    <div id="mounted"></div>
  </body>
</html>
`

{/* <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script> */}

const ogPrefix = 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#'

const head = ({ title, og, ga, headHtml }) => `
${!og ? `<head>` : `<head prefix="${ogPrefix}" >`}
  ${!title ? '' : `<title>${title}</title>`}
  ${headHtml || ''}
  <script defer src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script defer src="/app.js"></script>
  <link rel="stylesheet" type="text/css" href="/app.css">
  ${!ga ? '' : `<script></script>`}
</head>
`