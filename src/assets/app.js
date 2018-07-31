const isMobile = navigator.userAgent.toLowerCase().includes('mobile')

const fetchConfig = ({ pathname }) =>
  fetch(`${pathname === '/' ? '' : pathname}/index.json`)
  .then(res => res.json())

window.mount = (location) => new Vue({
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
    return fetchConfig(location).then(config => {
      const { who: { name, avatar, description } = {}, links = [] } = config
      this.name = name
      this.avatar = avatar
      this.description = description
      this.links = links
    })
  }
})