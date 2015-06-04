'use strict';
var ReposList = require('./reposList'),
    UserDetails = require('./userDetails'),
    CommitsList = require('./commitsList'),
    React = require('react');
var GithubData = React.createClass({
  getInitialState: function() {
    return {selectedRepos: [], user: false, year: false, month: false,
            lastDay: false};
  },
  onUserFetch: function(user) {
    console.log('user fetched', user.login);
    this.setState({user: user});
  },
  onReposChange: function(selectedRepos) {
    console.log(selectedRepos.length, 'repos selected');
    this.setState({selectedRepos: selectedRepos});
  },
  render: function() {
    return (
      <div className="github-data">
        <nav className="blue darken-4">
          <div className="nav-wrapper">
            <a href="/#/" className="brand-logo center blue-text text-lighten-5">
              Girtib Treller
            </a>
            <UserDetails onUserFetch={this.onUserFetch} />
          </div>
        </nav>
        <div className="container">
          <div className="row">
            <div className="col s5">
              <h2 className="repos-header">Repositories</h2>
              <ReposList onReposChange={this.onReposChange} />
            </div>
            <div className="col s7">
              <h2 className="commits-header">Commits</h2>
              <CommitsList user={this.state.user} repos={this.state.selectedRepos} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = GithubData;
