var React = window.React = require('react'),
    mountNode = document.getElementById('app'),
    Config = require('./config.json'),
    Router = require('react-router'),
    LocalStorage = require('./localStorage').LocalStorage,
    Github = require('./github').Github,
    Index = require('./index').Index,
    AuthFailure = require('./authFailure').AuthFailure,
    Auth = require('./auth').Auth,
    GithubData = require('./githubData').GithubData,
    Logout = require('./logout').Logout,
    NotFound = require('./notFound').NotFound;
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
  React.render(<Handler/>, mountNode);
});
