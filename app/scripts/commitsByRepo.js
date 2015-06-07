'use strict';
var React = require('react'),
    moment = require('moment'),
    CommitsByWeek = require('./commitsByWeek');
var CommitsByRepo = React.createClass({
  getInitialState: function() {
    return {expanded: true};
  },
  toggleExpanded: function(event) {
    event.preventDefault();
    this.setState({expanded: !this.state.expanded});
  },
  render: function() {
    var commitsByWeek = {};
    var weeks = $.unique(this.props.commits.map(function(commit) {
      var dateStr = commit.commit.committer.date;
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
      if (typeof commitsByWeek[week] === 'undefined') {
        commitsByWeek[week] = [];
      }
      commitsByWeek[week].push(commit);
      return week;
    }.bind(this)));
    weeks.sort(function(a, b) {
      var aWeekStart = a.split(' - ')[0];
      var bWeekStart = b.split(' - ')[0];
      var aDate = moment(aWeekStart, 'M/D/YYYY').toDate();
      var bDate = moment(bWeekStart, 'M/D/YYYY').toDate();
      return aDate - bDate;
    });
    var commitListItemsByWeek = weeks.map(function(week) {
      var key = 'week-' + week;
      return <CommitsByWeek key={key} commits={commitsByWeek[week]} week={week} />;
    });
    var commitCount = this.props.commits.length;
    var commitCountLabel = 'commit';
    if (commitCount !== 1) {
      commitCountLabel += 's';
    }
    var listStyle = {display: this.state.expanded ? 'block' : 'none'};
    var expandIcon = this.state.expanded ? (
      <span className="mdi-hardware-keyboard-arrow-down"></span>
    ) : (
      <span className="mdi-hardware-keyboard-arrow-right"></span>
    );
    return (
      <li className="commits-by-repo-list-item">
        <span className="repo-full-name">
          <a className="toggle-list-visibility" href="#" onClick={this.toggleExpanded}>
            {expandIcon}
            <span className="octicon octicon-repo"></span>
            {this.props.fullName}
          </a>
          <span className="badge repo-commit-count">
            {commitCount} {commitCountLabel}
          </span>
        </span>
        <ul className="commits-by-week-list" style={listStyle}>
          {commitListItemsByWeek}
        </ul>
      </li>
    );
  }
});
module.exports = CommitsByRepo;
