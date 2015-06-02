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

var Index = React.createClass({
  getGuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },
  getInitialState: function() {
    var clientId = Config.github.clientId;
    var scopes = 'repo:status';
    var state = this.getGuid();
    // TODO: store state in localstorage
    var currentLocation = window.location;
    var redirectUri = currentLocation.protocol + '//' + currentLocation.host +
                      '/#/auth';
    var url = 'https://github.com/login/oauth/authorize?client_id=' + clientId +
              '&redirect_uri=' + redirectUri + '&scope=' + scopes + '&state=' +
              state;
    return {githubAuthUrl: url};
  },
  render: function() {
    return (
      <div>
        <h1>Girtib Treller</h1>
        <p><a href={this.state.githubAuthUrl}>Sign in with Github</a></p>
      </div>
    );
  }
});

var Auth = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  render: function() {
    var router = this.context.router;
    var state = this.context.router.getCurrentParams().state;
    var code = window.location.search.split('?code=')[1];
    console.log(code, state);
    // TODO: make sure state matches, POST to get an access token, store in localstorage
    return (
      <div>
        aw yea
      </div>
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
    <Route name="auth" path="auth&scope=:scope&state=:state" handler={Auth}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler/>, mountNode);
});
