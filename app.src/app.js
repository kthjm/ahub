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
  }
})