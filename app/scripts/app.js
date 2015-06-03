var React = window.React = require('react'),
    mountNode = document.getElementById('app'),
    Config = require('./config.json'),
    Router = require('react-router');
var {
  Route,
  DefaultRoute,
  NotFoundRoute,
  RouteHandler,
  Link
} = Router;

var GirtibTrellerApp = React.createClass({
  render: function() {
    return (
      <div>
        <RouteHandler/>
      </div>
    );
  }
});

var LocalStorage = (function() {
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

var Index = React.createClass({
  mixins: [Router.Navigation],
  componentWillMount: function() {
    var token = LocalStorage.get('token');
    if (token) {
      this.transitionTo('github');
    }
  },
  getInitialState: function() {
    return {
      authUrl: Config.apiUrl + '/auth/github'
    };
  },
  render: function() {
    return (
      <div>
        <h1>Girtib Treller</h1>
        <p><a href={this.state.authUrl}>Sign in with Github</a></p>
      </div>
    );
  }
});

var AuthFailure = React.createClass({
  render: function() {
    return (
      <p>
        Something went wrong with your Github authentication. Please
        <a href="/#/">try again</a>.
      </p>
    );
  }
});

var Auth = React.createClass({
  mixins: [Router.Navigation],
  contextTypes: {
    router: React.PropTypes.func
  },
  render: function() {
    var router = this.context.router;
    var token = this.context.router.getCurrentParams().token;
    LocalStorage.set('token', token);
    this.transitionTo('github');
    return <p></p>;
  }
});

var RepoListItem = React.createClass({
  render: function() {
    var icon = this.props.repo.private ? (
      <span className="private-indicator mdi-action-lock"></span>
    ) : (
      <span className="public-indicator"></span>
    );
    return (
      <li className="repo-list-item">
        <a className="repo-link" href={this.props.repo.html_url} target="_blank">
          {this.props.repo.full_name}
        </a>
        {icon}
      </li>
    );
  }
});

var ReposList = React.createClass({
  getInitialState: function() {
    return {repos: []};
  },
  componentDidMount: function() {
    Github.getRepos().then(function(repos) {
      console.log(repos.length, 'repositories');
      this.setState({repos: repos});
    }.bind(this), function() {
      console.error('failed to fetch all repositories');
    });
  },
  render: function() {
    var listItems = [];
    for (var i=0; i<this.state.repos.length; i++) {
      var repo = this.state.repos[i];
      listItems.push(<RepoListItem repo={repo} />);
    }
    return (
      <ul className="repos-list">{listItems}</ul>
    );
  }
});

var UserDetails = React.createClass({
  getInitialState: function() {
    return {user: {}};
  },
  componentDidMount: function() {
    Github.getUser().then(function(user) {
      console.log(user);
      this.setState({user: user});
    }.bind(this), function() {
      console.error('failed to fetch Github user details');
    });
  },
  render: function() {
    return (
      <div className="github-user clearfix">
        <a href={this.state.user.html_url} className="name-and-avatar" target="_blank">
          <img src={this.state.user.avatar_url} alt={this.state.user.login} className="avatar"/>
          <span className="name">{this.state.user.name}</span>
        </a>
        &mdash;
        <a href="/#/logout" className="logout-link">Log Out</a>
      </div>
    );
  }
});

var GithubData = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Girtib Treller</h1>
        <div className="user-details"><UserDetails /></div>
        <div className="repos">
          <h2>Repositories</h2>
          <ReposList />
        </div>
      </div>
    );
  }
});

var Logout = React.createClass({
  mixins: [Router.Navigation],
  render: function() {
    LocalStorage.delete('token');
    this.transitionTo('/');
    return <p></p>;
  }
});

var NotFound = React.createClass({
  render: function() {
    return <h1>404 Not Found</h1>;
  }
});

var routes = (
  <Route handler={GirtibTrellerApp} path="/">
    <DefaultRoute handler={Index} />
    <Route name="authFailure" path="failed-auth" handler={AuthFailure}/>
    <Route name="auth" path="auth/:token" handler={Auth}/>
    <Route name="github" path="github" handler={GithubData}/>
    <Route name="logout" path="logout" handler={Logout}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler/>, mountNode);
});
