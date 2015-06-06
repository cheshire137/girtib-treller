'use strict';
var Github = require('./github'),
    React = require('react'),
    RepoListItem = require('./repoListItem');
var ReposList = React.createClass({
  getInitialState: function() {
    return {repos: [], selectedRepos: []};
  },
  onRepoSelected: function(repo) {
    for (var i=0; i<this.state.selectedRepos.length; i++) {
      if (this.state.selectedRepos[i].full_name === repo.full_name) {
        return;
      }
    }
    var newSelectedRepos = this.state.selectedRepos.concat([repo]);
    this.setState({selectedRepos: newSelectedRepos});
    this.props.onReposChange(newSelectedRepos);
  },
  onRepoDeselected: function(repo) {
    var index = -1;
    for (var i=0; i<this.state.selectedRepos.length; i++) {
      if (this.state.selectedRepos[i].full_name === repo.full_name) {
        index = i;
        break;
      }
    }
    if (index < 0) {
      return;
    }
    var newSelectedRepos = this.state.selectedRepos.slice(0, index).
        concat(this.state.selectedRepos.slice(index + 1,
                                              this.state.selectedRepos.length));
    this.setState({selectedRepos: newSelectedRepos});
    this.props.onReposChange(newSelectedRepos);
  },
  componentDidMount: function() {
    Github.getUserRepos().then(function(repos) {
      console.log(repos.length, 'repositories');
      this.setState({repos: repos});
    }.bind(this), function() {
      console.error('failed to fetch all repositories');
    });
  },
  render: function() {
    var listItems = [];
    for (var i=0; i<this.state.repos.length; i++) {
      var repo = this.state.repos[i];
      var key = 'repo-' + i;
      listItems.push(<RepoListItem key={key} index={i} repo={repo} onSelected={this.onRepoSelected} onDeselected={this.onRepoDeselected} />);
    }
    return (
      <ul className="repos-list">
        {listItems}
      </ul>
    );
  }
});
module.exports = ReposList;
