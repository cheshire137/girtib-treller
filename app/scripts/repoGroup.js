'use strict';
var RepoListItem = require('./repoListItem'),
    React = require('react');
var RepoGroup = React.createClass({
  getInitialState: function() {
    return {selectedRepos: []};
  },
  onRepoSelected: function(repo) {
    for (var i=0; i<this.state.selectedRepos.length; i++) {
      if (this.state.selectedRepos[i].full_name === repo.full_name) {
        return;
      }
    }
    console.log('enabling', repo.full_name);
    var newSelectedRepos = this.state.selectedRepos.concat([repo]);
    console.log('selected:', newSelectedRepos.map(function(r) { return r.full_name; }));
    this.setState({selectedRepos: newSelectedRepos});
    this.props.onReposChange(this.props.orgName, newSelectedRepos);
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
    console.log('disabling', repo.full_name);
    var newSelectedRepos = this.state.selectedRepos.slice(0, index).
        concat(this.state.selectedRepos.slice(index + 1,
                                              this.state.selectedRepos.length));
    console.log('selected:', newSelectedRepos.map(function(r) { return r.full_name; }));
    this.setState({selectedRepos: newSelectedRepos});
    this.props.onReposChange(this.props.orgName, newSelectedRepos);
  },
  render: function() {
    var listItems = [];
    for (var i=0; i<this.props.repos.length; i++) {
      var repo = this.props.repos[i];
      var key = this.props.index + '-' + i;
      var listItem = <RepoListItem key={key} index={i} orgIndex={this.props.index} repo={repo} onSelected={this.onRepoSelected} onDeselected={this.onRepoDeselected} />;
      listItems.push(listItem)
    }
    return (
      <li className="org-list-item">
        <span className="org-name">
          <span className="octicon octicon-organization"></span>
          {this.props.orgName}
        </span>
        <ul className="org-repos-list">{listItems}</ul>
      </li>
    );
  }
});
module.exports = RepoGroup;
