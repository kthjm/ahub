const isMobile = navigator.userAgent.toLowerCase().includes('mobile')

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
    const { pathname } = location
    const prefix = pathname === '/' ? '.' : pathname
    const configPath = `${prefix}/index.json`
    return fetch(configPath).then(res => res.json()).then(config => {
      const { who: { name, avatar, description } = {}, links = [] } = config
      this.name = name
      this.avatar = avatar
      this.description = description
      this.links = links
    })
  }
})