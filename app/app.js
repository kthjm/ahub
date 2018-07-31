'use strict';

var isMobile = navigator.userAgent.toLowerCase().includes('mobile');

var fetchConfig = function fetchConfig() {
  var _location = location,
      pathname = _location.pathname;

  var configPath = (pathname === '/' ? '' : pathname) + '/index.json';
  return fetch(configPath).then(function (res) {
    return res.json();
  });
};

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
  created: function created() {
    var _this = this;

    return fetchConfig().then(function (config) {
      var _config$who = config.who;
      _config$who = _config$who === undefined ? {} : _config$who;
      var name = _config$who.name,
          avatar = _config$who.avatar,
          description = _config$who.description,
          _config$links = config.links,
          links = _config$links === undefined ? [] : _config$links;

      _this.name = name;
      _this.avatar = avatar;
      _this.description = description;
      _this.links = links;
    });
  }
});