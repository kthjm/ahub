const isMobile = navigator.userAgent.toLowerCase().includes('mobile')

const fetchConfig = () => {
  const { pathname } = location
  const configPath = `${pathname === '/' ? '' : pathname}/index.json`
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
    return fetchConfig().then(config => {
      const { who: { name, avatar, description } = {}, links = [] } = config
      this.name = name
      this.avatar = avatar
      this.description = description
      this.links = links
    })
  }
})