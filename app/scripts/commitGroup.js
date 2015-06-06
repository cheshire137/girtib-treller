'use strict';
var React = require('react'),
    moment = require('moment'),
    CommitsByRepo = require('./commitsByRepo');
var CommitGroup = React.createClass({
  render: function() {
    if (this.props.commits.length < 1 && this.props.monthStr !== '' &&
        this.props.repos.length > 0) {
      var monthLabel = moment(this.props.monthStr + '-01').format('MMMM YYYY');
      return (
        <p>You made no commits to the selected repositories in {monthLabel}.</p>
      );
    }
    if (this.props.monthStr === '' || this.props.repos.length < 1) {
      return (
        <p>Choose a month and select some repositories to see your commit history.</p>
      );
    }
    var commitsByRepo = {};
    var repoFullNames = $.unique(this.props.commits.map(function(commit) {
      if (typeof commitsByRepo[commit.full_name] === 'undefined') {
        commitsByRepo[commit.full_name] = [];
      }
      commitsByRepo[commit.full_name].push(commit);
      return commit.full_name;
    }));
    repoFullNames.sort(function(a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    var commitListItemsByRepo = repoFullNames.map(function(repoFullName) {
      return <CommitsByRepo fullName={repoFullName} commits={commitsByRepo[repoFullName]} />;
    });
    return (
      <ul className="commits-by-repo-list">
        {commitListItemsByRepo}
      </ul>
    );
  }
});
module.exports = CommitGroup;
