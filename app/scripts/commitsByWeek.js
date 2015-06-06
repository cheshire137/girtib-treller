'use strict';
var React = require('react'),
    moment = require('moment'),
    CommitListItem = require('./commitListItem');
var CommitsByWeek = React.createClass({
  render: function() {
    var commitListItems = this.props.commits.map(function(commit) {
      var key = 'commit-' + commit.sha;
      return <CommitListItem key={key} commit={commit} />;
    });
    var commitCount = this.props.commits.length;
    var commitsLabel = 'commit';
    if (commitCount !== 1) {
      commitsLabel += 's';
    }
    return (
      <li className="commits-by-week-list-item">
        <span className="week">
          {this.props.week}
          <span className="badge">
            {commitCount} {commitsLabel}
          </span>
        </span>
        <ul className="commits-list">
          {commitListItems}
        </ul>
      </li>
    );
  }
});
module.exports = CommitsByWeek;
