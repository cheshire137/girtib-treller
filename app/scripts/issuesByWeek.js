'use strict';
var React = require('react'),
    moment = require('moment'),
    IssueListItem = require('./issueListItem');
var IssuesByWeek = React.createClass({
  render: function() {
    var issueCount = 0, prCount = 0;
    var issueListItems = this.props.issues.map(function(issue) {
      if (issue.pull_request) {
        prCount++;
      } else {
        issueCount++;
      }
      var key = 'issue-' + issue.id;
      return <IssueListItem key={key} issue={issue} />;
    });
    var issueCountLabel = 'issue';
    if (issueCount !== 1) {
      issueCountLabel += 's';
    }
    var prCountLabel = 'pull request';
    if (prCount !== 1) {
      prCountLabel += 's';
    }
    return (
      <li className="issues-by-week-list-item">
        <span className="week">
          {this.props.week}
          <span className="badge week-issue-count">
            <span className="issue-count">{issueCount} {issueCountLabel}</span>
            <span className="pr-count">{prCount} {prCountLabel}</span>
          </span>
        </span>
        <ul className="issues-list">
          {issueListItems}
        </ul>
      </li>
    );
  }
});
module.exports = IssuesByWeek;
