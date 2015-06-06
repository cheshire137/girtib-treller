'use strict';
var React = require('react'),
    moment = require('moment'),
    CommitListItem = require('./commitListItem');
var CommitsByRepo = React.createClass({
  render: function() {
    var commitListItems = this.props.commits.map(function(commit) {
      return <CommitListItem commit={commit} />;
    });
    var commitCount = this.props.commits.length;
    var commitCountLabel = 'commit';
    if (commitCount !== 1) {
      commitCountLabel += 's';
    }
    return (
      <li className="commits-by-repo-list-item">
        <span className="repo-full-name">
          <span className="octicon octicon-repo"></span>
          {this.props.fullName}
          <span className="badge repo-commit-count">
            {commitCount} {commitCountLabel}
          </span>
        </span>
        <ul className="commits-list">
          {commitListItems}
        </ul>
      </li>
    );
  }
});
module.exports = CommitsByRepo;
