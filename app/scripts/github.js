'use strict';
var LocalStorage = require('./localStorage'),
    React = require('react');
var Github = (function() {
  return {
    apiUrl: 'https://api.github.com',
    getHeaders: function() {
      return {
        'Authorization': 'token ' + LocalStorage.get('token')
      };
    },
    getJSON: function(path) {
      return $.ajax({
        dataType: 'json',
        url: this.apiUrl + path,
        headers: this.getHeaders()
      })
    },
    getUser: function() {
      return this.getJSON('/user');
    },
    getOrgs: function() {
      return this.getJSON('/user/orgs');
    },
    getOrgNames: function() {
      return $.Deferred(function(defer) {
        var orgNames = LocalStorage.get('orgNames');
        if (orgNames) {
          defer.resolve(orgNames);
        } else {
          orgNames = [];
          this.getOrgs().success(function(orgs) {
            for (var i=0; i<orgs.length; i++) {
              orgNames.push(orgs[i].login);
            }
            LocalStorage.set('orgNames', orgNames);
            defer.resolve(orgNames);
          }).error(defer.reject);
        }
      }.bind(this)).promise();
    },
    getUserRepos: function() {
      return this.getJSON('/user/repos');
    },
    getOrgRepos: function(orgName) {
      return this.getJSON('/orgs/' + orgName + '/repos');
    },
    resolveIfNecessary: function(statuses, callback) {
      var finished = true;
      for (var key in statuses) {
        var status = statuses[key];
        if (status === 'pending') {
          finished = false;
          break;
        }
      }
      if (finished) {
        callback();
      }
    },
    getAllOrgRepos: function(orgNames) {
      return $.Deferred(function(defer) {
        var statuses = {};
        var allRepos = [];
        var callback = function() { defer.resolve(allRepos); };
        orgNames.forEach(function(name) {
          statuses[name] = 'pending';
          this.getOrgRepos(name).success(function(orgRepos) {
            allRepos = allRepos.concat(orgRepos);
            statuses[name] = 'success'
            this.resolveIfNecessary(statuses, callback);
          }.bind(this)).error(function() {
            statuses[name] = 'failure';
            this.resolveIfNecessary(statuses, callback);
          }.bind(this));
        }.bind(this));
      }.bind(this)).promise();
    },
    getRepos: function() {
      return $.Deferred(function(defer) {
        this.getUserRepos().then(function(userRepos) {
          this.getOrgNames().then(function(orgNames) {
            console.log(orgNames.length, 'organizations:', orgNames);
            this.getAllOrgRepos(orgNames).then(function(orgRepos) {
              defer.resolve(userRepos.concat(orgRepos));
            }, defer.reject);
          }.bind(this), defer.reject);
        }.bind(this), defer.reject);
      }.bind(this)).promise();
    },
    getCommits: function(fullName, author, sinceDate, untilDate) {
      var sinceStr = sinceDate.toISOString();
      var untilStr = untilDate.toISOString();
      var url = '/repos/' + fullName + '/commits?author=' +
                encodeURIComponent(author) + '&since=' + sinceStr +
                '&until=' + untilStr;
      return this.getJSON(url);
    },
    getCommitsFromRepos: function(repos, author, sinceDate, untilDate) {
      return $.Deferred(function(defer) {
        var statuses = {};
        var allCommits = [];
        var callback = function() { defer.resolve(allCommits); };
        var fullNames = [];
        for (var i=0; i<repos.length; i++) {
          fullNames.push(repos[i].full_name);
        }
        console.log('fetching commits for', fullNames);
        fullNames.forEach(function(fullName) {
          statuses[fullName] = 'pending';
          this.getCommits(fullName, author, sinceDate, untilDate).
               success(function(repoCommits) {
                 for (var i=0; i<repoCommits.length; i++) {
                   repoCommits[i].full_name = fullName;
                 }
                 allCommits = allCommits.concat(repoCommits);
                 statuses[fullName] = 'success';
                 this.resolveIfNecessary(statuses, callback);
               }.bind(this)).error(function() {
                 statuses[fullName] = 'failure';
                 this.resolveIfNecessary(statuses, callback);
               }.bind(this));
        }.bind(this));
      }.bind(this)).promise();
    }
  };
})();
module.exports = Github;
