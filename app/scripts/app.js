var React = window.React = require('react'),
    mountNode = document.getElementById('app'),
    Config = require('./config.json');

var GirtibTrellerApp = React.createClass({
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
    var url = 'https://github.com/login/oauth/authorize?client_id=' + clientId + '&redirect_uri=&scope=' + scopes + '&state=' + state;
    return {githubAuthUrl: url};
  },
  render: function() {
    return (
      <div>
        <a href={this.state.githubAuthUrl}>Sign in with Github</a>
      </div>
    );
  }
});

React.render(<GirtibTrellerApp />, mountNode);
