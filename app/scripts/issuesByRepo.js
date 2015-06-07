'use strict';
var React = require('react'),
    moment = require('moment'),
    IssuesByWeek = require('./issuesByWeek');
var IssuesByRepo = React.createClass({
  render: function() {
    var issuesByWeek = {};
    var weeks = $.unique(this.props.issues.map(function(issue) {
      var dateStr = issue.closed_at;
      var weekStart = moment(dateStr).startOf('week');
      var weekEnd = moment(dateStr).endOf('week');
      var curMonth = moment(dateStr).toDate().getMonth();
      var weekEndMonth = weekEnd.toDate().getMonth();
      var weekStartMonth = weekStart.toDate().getMonth();
      if (weekEndMonth > weekStartMonth) {
        if (curMonth < weekEndMonth) {
          weekEnd = moment(dateStr).endOf('month');
        } else if (weekStartMonth < curMonth) {
          weekStart = moment(dateStr).startOf('month');
        }
      }
      var weekStartStr = weekStart.format('M/D/YYYY');
      var weekEndStr = weekEnd.format('M/D/YYYY');
      var week = weekStartStr + ' - ' + weekEndStr;
      if (typeof issuesByWeek[week] === 'undefined') {
        issuesByWeek[week] = [];
      }
      issuesByWeek[week].push(issue);
      return week;
    }.bind(this)));
    weeks.sort(function(a, b) {
      var aWeekStart = a.split(' - ')[0];
      var bWeekStart = b.split(' - ')[0];
      var aDate = moment(aWeekStart, 'M/D/YYYY').toDate();
      var bDate = moment(bWeekStart, 'M/D/YYYY').toDate();
      return aDate - bDate;
    });
    var issueListItemsByWeek = weeks.map(function(week) {
      var key = 'issue-week-' + week;
      return <IssuesByWeek key={key} issues={issuesByWeek[week]} week={week} />;
    });
    var issueCount = this.props.issues.length;
    var issueCountLabel = 'issue';
    if (issueCount !== 1) {
      issueCountLabel += 's';
    }
    return (
      <li className="issues-by-repo-list-item">
        <span className="repo-full-name">
          <span className="octicon octicon-repo"></span>
          {this.props.fullName}
          <span className="badge repo-issue-count">
            {issueCount} {issueCountLabel}
          </span>
        </span>
        <ul className="issues-by-week-list">
          {issueListItemsByWeek}
        </ul>
      </li>
    );
  }
});
module.exports = IssuesByRepo;
