'use strict';
var React = window.React = require('react'),
    mountNode = document.getElementById('app'),
    Router = require('react-router'),
    Index = require('./index'),
    AuthFailure = require('./authFailure'),
    Auth = require('./auth'),
    GithubData = require('./githubData'),
    Logout = require('./logout'),
    NotFound = require('./notFound');
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
  var onConfigLoaded = function() {
    if (window.Config.https && window.location.protocol !== 'https:') {
      console.log('forcing https');
      window.location.href = 'https:' + window.location.href.
          substring(window.location.protocol.length);
      return;
    }
    React.render(<Handler/>, mountNode);
  };
  if (window.Config) {
    onConfigLoaded();
  } else {
    $.get('scripts/config.json', function(Config) {
      window.Config = Config;
      console.log('loaded config', window.Config);
      onConfigLoaded();
    });
  }
});
