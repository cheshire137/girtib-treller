var LocalStorage = require('./localStorage').LocalStorage;
exports.Github = (function() {
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
    getAllOrgRepos: function(orgNames) {
      return $.Deferred(function(defer) {
        var statuses = {};
        var allRepos = [];
        var resolveIfNecessary = function() {
          var finished = true;
          for (var orgName in statuses) {
            var status = statuses[orgName];
            if (status === 'pending') {
              finished = false;
            }
          }
          if (finished) {
            defer.resolve(allRepos);
          }
        };
        orgNames.forEach(function(name) {
          statuses[name] = 'pending';
          this.getOrgRepos(name).success(function(orgRepos) {
            allRepos = allRepos.concat(orgRepos);
            statuses[name] = 'success'
            resolveIfNecessary();
          }).error(function() {
            statuses[name] = 'failure';
            resolveIfNecessary();
          });
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
    }
  };
})();
