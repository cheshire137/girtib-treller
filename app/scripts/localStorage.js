'use strict';
var React = require('react');
var LocalStorage = (function() {
  return {
    getJSON: function() {
      if (!window.localStorage) {
        console.error('browser does not support local storage');
        return {};
      }
      var appData = window.localStorage.getItem(window.Config.localStorageKey) || "{}";
      return JSON.parse(appData);
    },
    get: function(key) {
      var appData = this.getJSON();
      return appData[key];
    },
    set: function(key, value) {
      var appData = this.getJSON();
      appData[key] = value;
      window.localStorage.setItem(window.Config.localStorageKey, JSON.stringify(appData));
    },
    delete: function(key) {
      var appData = this.getJSON();
      delete appData[key];
      window.localStorage.setItem(window.Config.localStorageKey, JSON.stringify(appData));
    }
  };
})();
module.exports = LocalStorage;
