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
      <div className="row">
        <div className="col s6">
          <p>
            Browse your Github commits per month per repository, grouped by week.
            Determine what you did and when, plus how many issues were closed.
          </p>
        </div>
        <div className="col s6">
          <p className="center">
            <a className="waves-effect blue waves-light btn-large" href={this.state.authUrl}>
              Sign in with Github
            </a>
          </p>
        </div>
      </div>
    );
  }
});
