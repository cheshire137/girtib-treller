'use strict';
var React = require('react'),
    moment = require('moment'),
    IssueListItem = require('./issueListItem');
var IssuesByWeek = React.createClass({
  render: function() {
    var issueListItems = this.props.issues.map(function(issue) {
      var key = 'issue-' + issue.id;
      return <IssueListItem key={key} issue={issue} />;
    });
    var issueCount = this.props.issues.length;
    var issuesLabel = 'issue';
    if (issueCount !== 1) {
      issuesLabel += 's';
    }
    return (
      <li className="issues-by-week-list-item">
        <span className="week">
          {this.props.week}
          <span className="badge">
            {issueCount} {issuesLabel}
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
