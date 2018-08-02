const isMobile = navigator.userAgent.toLowerCase().includes('mobile')

const fetchConfig = () => {
  const { pathname } = location
  const configPath = `${pathname}index.json`
  return fetch(configPath).then(res => res.json())
}

new Vue({
  el: '#mounted',
  data: {
    name: undefined,
    avatar: undefined,
    description: undefined,
    links: []
  },
  watch: {},
  methods: {},
  created() {
    return fetchConfig()
    .then(({ name, avatar, description, links = [] }) => {
      this.name = name
      this.avatar = avatar
      this.description = description
      this.links = links
    })
  },
  template: `
  <div>
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
  `
})