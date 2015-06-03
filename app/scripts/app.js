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

var Index = React.createClass({
  mixins : [Router.Navigation],
  componentWillMount: function() {
    var token = LocalStorage.get('token');
    if (token) {
      this.transitionTo('commits');
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
  mixins : [Router.Navigation],
  contextTypes: {
    router: React.PropTypes.func
  },
  render: function() {
    var router = this.context.router;
    var token = this.context.router.getCurrentParams().token;
    LocalStorage.set('token', token);
    this.transitionTo('commits');
    return <p></p>;
  }
});

var Commits = React.createClass({
  render: function () {
    return (
      <p>ur commits here</p>
    );
  }
});

var NotFound = React.createClass({
  render: function () {
    return <h1>404 Not Found</h1>;
  }
});

var routes = (
  <Route handler={GirtibTrellerApp} path="/">
    <DefaultRoute handler={Index} />
    <Route name="authFailure" path="failed-auth" handler={AuthFailure}/>
    <Route name="auth" path="auth/:token" handler={Auth}/>
    <Route name="commits" path="commits" handler={Commits}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler/>, mountNode);
});
