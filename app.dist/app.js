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
  },

  template: '\n  <div>\n    <div id="who">\n      <div id="who_flex">\n        <div id="avatar_wrap">\n          <img id="avatar" :src="avatar" />\n        </div>\n        <div id="info_wrap">\n          <h2>{{ name }}</h2>\n          <p>{{ description }}</p>\n        </div>\n      </div>\n    </div>\n    <div id="links">\n      <div v-for="link in links" class="link">\n        <div>\n          <a :href="link.href" target="_blank">\n            <img :src="link.icon" class="link_icon" />\n          </a>\n        </div>\n        <div class="link_foot">\n        </div>\n      </div>\n    </div>\n  </div>\n  '
});