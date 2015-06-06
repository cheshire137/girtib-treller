'use strict';
var ReposList = require('./reposList'),
    UserDetails = require('./userDetails'),
    CommitsList = require('./commitsList'),
    React = require('react');
var GithubData = React.createClass({
  getInitialState: function() {
    return {selectedRepos: [], user: {}, showWhat: 'commits'};
  },
  onUserFetch: function(user) {
    this.setState({user: user});
  },
  onReposChange: function(selectedRepos) {
    console.log(selectedRepos.length, 'repos selected');
    this.setState({selectedRepos: selectedRepos});
  },
  onShowChoiceChange: function(event) {
    this.setState({showWhat: event.target.value});
  },
  render: function() {
    var listing;
    if (this.state.showWhat === 'commits') {
      listing = <CommitsList user={this.state.user} repos={this.state.selectedRepos} />;
    } else {
      listing = '';
    }
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
            <div className="col s5 l4">
              <h2 className="repos-header">
                Repositories
                <span className="badge">
                  {this.state.selectedRepos.length} selected
                </span>
              </h2>
              <ReposList onReposChange={this.onReposChange} />
            </div>
            <div className="col s7 l8">
              <div className="show-what-choice">
                <input type="radio" value="commits" name="showWhat" id="commits-choice" checked={this.state.showWhat === 'commits'} onChange={this.onShowChoiceChange} />
                <label className="commits-choice-label" htmlFor="commits-choice">Commits</label>
                <input type="radio" value="issues" name="showWhat" id="issues-choice" checked={this.state.showWhat === 'issues'} onChange={this.onShowChoiceChange} />
                <label htmlFor="issues-choice">Issues</label>
              </div>
              <h2 className="commits-header">
                Your {this.state.showWhat}
              </h2>
              {listing}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = GithubData;
