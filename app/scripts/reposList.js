'use strict';
var Github = require('./github'),
    RepoGroup = require('./repoGroup'),
    React = require('react');
var ReposList = React.createClass({
  getInitialState: function() {
    return {repos: {}, selectedRepos: []};
  },
  onReposChange: function(orgName, selectedRepos) {
    var otherGroupRepos = [];
    for (var i=0; i<this.state.selectedRepos.length; i++) {
      var repo = this.state.selectedRepos[i];
      var repoOrgName = repo.full_name.split('/')[0];
      if (repoOrgName !== orgName) {
        otherGroupRepos.push(repo);
      }
    }
    var allSelectedRepos = otherGroupRepos.concat(selectedRepos);
    var dupes = {};
    var singles = [];
    $.each(allSelectedRepos, function(i, repo) {
      if (!dupes[repo.full_name]) {
        dupes[repo.full_name] = true;
        singles.push(repo);
      }
    });
    this.setState({selectedRepos: singles});
    this.props.onReposChange(singles);
  },
  componentDidMount: function() {
    Github.getUserRepos().then(function(repos) {
      console.log(repos.length, 'repositories');
      var orgNames = $.unique(repos.map(function(repo) {
        return repo.full_name.split('/')[0];
      }));
      var reposByOrg = {};
      for (var i=0; i<orgNames.length; i++) {
        reposByOrg[orgNames[i]] = [];
      }
      for (var i=0; i<repos.length; i++) {
        var repo = repos[i];
        var orgName = repo.full_name.split('/')[0];
        reposByOrg[orgName].push(repo);
      }
      this.setState({repos: reposByOrg});
    }.bind(this), function() {
      console.error('failed to fetch all repositories');
    });
  },
  render: function() {
    var listItems = [];
    var index = 0;
    for (var orgName in this.state.repos) {
      var key = 'org-' + index;
      listItems.push(<RepoGroup key={key} index={index} orgName={orgName} repos={this.state.repos[orgName]} onReposChange={this.onReposChange} />);
      index++;
    }
    return (
      <ul className="repos-list">
        {listItems}
      </ul>
    );
  }
});
module.exports = ReposList;
