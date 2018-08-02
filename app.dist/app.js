'use strict';

var isMobile = navigator.userAgent.toLowerCase().includes('mobile');

var fetchConfig = function fetchConfig() {
  var _location = location,
      pathname = _location.pathname;

  var configPath = pathname + 'index.json';
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

    return fetchConfig().then(function (_ref) {
      var name = _ref.name,
          avatar = _ref.avatar,
          description = _ref.description,
          _ref$links = _ref.links,
          links = _ref$links === undefined ? [] : _ref$links;

      _this.name = name;
      _this.avatar = avatar;
      _this.description = description;
      _this.links = links;
    });
  }
});