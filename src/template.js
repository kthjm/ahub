export default (lang = '', headOpts) => `
<!DOCTYPE html>
${!lang ? `<html>` : `<html lang="${lang}" >`}
  ${head(headOpts)}
  ${body}
</html>
`

// <!-- <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script> -->
const head = ({ prefix, title, ga, headHtml }) => `
${!prefix ? `<head>` : `<head prefix="${prefix}" >`}
  ${!title ? '' : `<title>${title}</title>`}
  ${headHtml || ''}
  <script defer src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script defer src="/app.js"></script>
  <link rel="stylesheet" type="text/css" href="/app.css">
  ${!ga ? '' : `<script></script>`}
</head>
`

const body = `
<body>
  <div id="mounted">

    <div id="who">
      <div id="who_flex">
        <div id="avatar_wrap">
          <img id="avatar" :src="avatar" />
        </div>
        <div id="info_wrap">
          <h2>{{ name }}</h2>
          <p>{{ description }}</p>
        </div>
      </div>
    </div>

    <div id="links">
      <div v-for="link in links" class="link">
        <div>
          <a :href="link.href" target="_blank">
            <img :src="link.icon" class="link_icon" />
          </a>
        </div>
        <div class="link_foot">
        </div>
      </div>
    </div>

  </div>
</body>
`