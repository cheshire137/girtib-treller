var Config = require('./config.json');
exports.LocalStorage = (function() {
  return {
    getJSON: function() {
      if (!window.localStorage) {
        console.error('browser does not support local storage');
        return {};
      }
      var appData = window.localStorage.getItem(Config.localStorageKey) || "{}";
      return JSON.parse(appData);
    },
    get: function(key) {
      var appData = this.getJSON();
      return appData[key];
    },
    set: function(key, value) {
      var appData = this.getJSON();
      appData[key] = value;
      window.localStorage.setItem(Config.localStorageKey, JSON.stringify(appData));
    },
    delete: function(key) {
      var appData = this.getJSON();
      delete appData[key];
      window.localStorage.setItem(Config.localStorageKey, JSON.stringify(appData));
    }
  };
})();
