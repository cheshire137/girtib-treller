'use strict';
var React = require('react'),
    moment = require('moment');
var CommitGroup = React.createClass({
  render: function() {
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
      var commitListItems = commitsByRepo[repoFullName].map(function(commit) {
        return (
          <li className="commit-list-item">
            <a href={commit.html_url} target="_blank" className="commit-link">
              {commit.commit.message}
            </a>
          </li>
        );
      });
      return (
        <li>
          <span className="repo-full-name">
            <span className="octicon octicon-repo"></span>
            {repoFullName}
          </span>
          <ul className="commits-list">
            {commitListItems}
          </ul>
        </li>
      );
    });
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
    return (
      <ul className="commits-by-repo-list">
        {commitListItemsByRepo}
      </ul>
    );
  }
});
module.exports = CommitGroup;
