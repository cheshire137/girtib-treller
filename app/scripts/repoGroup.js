'use strict';
var RepoListItem = require('./repoListItem'),
    React = require('react');
var RepoGroup = React.createClass({
  getInitialState: function() {
    return {checked: false, selectedRepos: []};
  },
  handleChange: function(event) {
    this.setState({checked: !this.state.checked});
    var newSelectedRepos;
    if (this.state.checked) {
      console.log('disabling all in', this.props.orgName);
      newSelectedRepos = [];
    } else {
      console.log('enabling all in', this.props.orgName);
      newSelectedRepos = this.props.repos.slice();
    }
    this.setState({selectedRepos: newSelectedRepos});
    this.props.onReposChange(this.props.orgName, newSelectedRepos);
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
      var listItem = <RepoListItem key={key} index={i} orgIndex={this.props.index} repo={repo} checked={this.state.checked} onSelected={this.onRepoSelected} onDeselected={this.onRepoDeselected} />;
      listItems.push(listItem)
    }
    var checkboxId = 'org-' + this.props.index;
    return (
      <li className="org-list-item">
        <input type="checkbox" checked={this.state.checked} className="filled-in" id={checkboxId} onChange={this.handleChange} />
        <label htmlFor={checkboxId} className="org-name">
          <span className="octicon octicon-organization"></span>
          {this.props.orgName}
        </label>
        <ul className="org-repos-list">{listItems}</ul>
      </li>
    );
  }
});
module.exports = RepoGroup;
