export default ({ heads } = {}) => `
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    ${heads || ''}
    <!--<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script>-->
    <script defer src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script defer src="/app.js"></script>
    <link rel="stylesheet" type="text/css" href="/app.css">
  </head>
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
</html>
`