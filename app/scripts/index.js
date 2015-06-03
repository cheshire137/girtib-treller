var Router = require('react-router'),
    Config = require('./config.json'),
    LocalStorage = require('./localStorage').LocalStorage;
exports.Index = React.createClass({
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
