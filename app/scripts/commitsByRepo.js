'use strict';
var React = require('react'),
    moment = require('moment'),
    CommitsByWeek = require('./commitsByWeek');
var CommitsByRepo = React.createClass({
  getClosestPreviousSunday: function(startDate) {
    var d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    d.setDate(d.getDate() - d.getDay());
    return d;
  },
  render: function() {
    var commitsByWeek = {};
    var weeks = $.unique(this.props.commits.map(function(commit) {
      var momentDate = moment(commit.commit.author.date);
      var date = momentDate.toDate();
      var month = date.getMonth() + 1;
      var week;
      if (date.getDate() === 1) {
        week = momentDate.format('M/D/YYYY');
      } else {
        var sundayDate = this.getClosestPreviousSunday(date);
        var sundayMonth = sundayDate.getMonth() + 1;
        if (sundayMonth < month) {
          week = month + '/1/' + date.getFullYear();
        } else {
          week = sundayMonth + '/' + sundayDate.getDate() + '/' +
                 sundayDate.getFullYear();
        }
      }
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
        <ul className="commits-list">
          {commitListItemsByWeek}
        </ul>
      </li>
    );
  }
});
module.exports = CommitsByRepo;
