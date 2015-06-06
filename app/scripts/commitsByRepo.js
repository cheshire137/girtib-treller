'use strict';
var React = require('react'),
    moment = require('moment'),
    CommitsByWeek = require('./commitsByWeek');
var CommitsByRepo = React.createClass({
  render: function() {
    var commitsByWeek = {};
    var weeks = $.unique(this.props.commits.map(function(commit) {
      var dateStr = commit.commit.author.date
      var weekStart = moment(dateStr).startOf('week').format('M/D/YYYY');
      var weekEnd = moment(dateStr).endOf('week').format('M/D/YYYY');
      var week = weekStart + ' - ' + weekEnd;
      if (typeof commitsByWeek[week] === 'undefined') {
        commitsByWeek[week] = [];
      }
      commitsByWeek[week].push(commit);
      return week;
    }.bind(this)));
    weeks.sort(function(a, b) {
      var aDate = moment(a, 'M/D/YYYY').toDate();
      var bDate = moment(b, 'M/D/YYYY').toDate();
      return aDate - bDate;
    });
    console.log(weeks);
    var commitListItemsByWeek = weeks.map(function(week) {
      var key = 'week-' + week;
      return <CommitsByWeek key={key} commits={commitsByWeek[week]} week={week} />;
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
        <ul className="commits-by-week-list">
          {commitListItemsByWeek}
        </ul>
      </li>
    );
  }
});
module.exports = CommitsByRepo;
