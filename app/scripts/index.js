'use strict';
var Router = require('react-router'),
    Config = require('./config.json'),
    LocalStorage = require('./localStorage'),
    React = require('react');
var Index = React.createClass({
  mixins: [Router.Navigation],
  componentWillMount: function() {
    var token = LocalStorage.get('token');
    if (token) {
      this.transitionTo('github');
    }
  },
  getInitialState: function() {
    console.log('config', Config);
    return {
      authUrl: Config.apiUrl + '/auth/github'
    };
  },
  render: function() {
    return (
      <div>
        <nav className="blue darken-4">
          <div className="nav-wrapper">
            <a href="/#/" className="brand-logo center blue-text text-lighten-5">
              Girtib Treller
            </a>
          </div>
        </nav>
        <div className="container">
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
        </div>
      </div>
    );
  }
});
module.exports = Index;
