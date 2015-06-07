'use strict';
var moment = require('moment'),
    React = require('react'),
    Github = require('./github');
var IssuesList = React.createClass({
  getInitialState: function() {
    return {issues: []};
  },
  filterIssues: function(allIssues, year, month) {
    var lastDayStr = moment(this.props.monthStr + '-01', 'YYYY-MM-DD').
        endOf('month').format('D');
    var lastDay = parseInt(lastDayStr, 10);
    var untilDate = new Date(year, month - 1, lastDay);
    var issues = [];
    allIssues.forEach(function(issue) {
      var closedDate = moment(issue.closed_at).toDate();
      if (closedDate < untilDate) {
        issues.push(issue);
      } else {
        console.log(issue.closed_at, 'after cutoff date', untilDate);
      }
    });
    console.log('after filtering issues, have', issues.length);
    this.setState({issues: issues});
  },
  fetchIssues: function() {
    if (!this.props.monthStr || this.props.repos.length < 1) {
      return;
    }
    var bits = this.props.monthStr.split('-');
    var year = parseInt(bits[0], 10);
    var month = parseInt(bits[1], 10);
    var sinceDate = new Date(year, month - 1, 1);
    var fullNames = this.props.repos.map(function(repo) {
      return repo.full_name;
    });
    console.log('fetching issues for', fullNames.length, 'repos',
                this.props.monthStr);
    Github.getAllRepoIssues(fullNames, sinceDate).
           then(function(issues) {
             console.log('got', issues.length, 'issues');
             this.filterIssues(issues, year, month);
           }.bind(this), function() {
             console.error('failed to fetch issues');
           });
  },
  areSameRepos: function(prevRepos) {
    var repoFullNameMapper = function(repo) { return repo.full_name; };
    var prevRepoFullNames = prevRepos.map(repoFullNameMapper);
    var curRepoFullNames = this.props.repos.map(repoFullNameMapper);
    return $(prevRepoFullNames).not(curRepoFullNames).length === 0 &&
           $(curRepoFullNames).not(prevRepoFullNames).length === 0;
  },
  isSameMonth: function(prevMonthStr) {
    return prevMonthStr === this.props.monthStr;
  },
  componentDidUpdate: function(prevProps, prevState) {
    var sameRepos = this.areSameRepos(prevProps.repos);
    var sameMonth = this.isSameMonth(prevProps.monthStr);
    if (sameRepos && sameMonth) {
      return;
    }
    this.fetchIssues();
  },
  render: function() {
    var listItems = this.state.issues.map(function(issue) {
      var icon = issue.pull_request ? (
        <span className="octicon octicon-git-pull-request"></span>
      ) : (
        <span className="octicon octicon-issue-closed"></span>
      );
      var date = issue.closed_at;
      var timestamp = moment(date).format('ddd D MMM');
      var labelListItems = issue.labels.map(function(label) {
        var style = {backgroundColor: '#' + label.color};
        return (
          <li className="label-list-item">
            <span className="label-name" style={style}>
              {label.name}
            </span>
          </li>
        );
      });
      var labelsListStyle = {
        display: labelListItems.length > 0 ? 'inline-block' : 'none'
      };
      return (
        <li className="issue-list-item">
          {icon}
          <a className="issue-link" href={issue.html_url}>
            <span className="issue-number">#{issue.number}</span>
            <span className="issue-title">{issue.title}</span>
          </a>
          <div className="issue-metadata">
            <a className="issue-user-link" href={issue.user.html_url}>
              <img src={issue.user.avatar_url} alt={issue.user.login} className="issue-user-avatar" />
              <span className="issue-user-name">{issue.user.login}</span>
            </a>
            <ul className="issue-labels-list" style={labelsListStyle}>
              {labelListItems}
            </ul>
            <time className="issue-date">
              {timestamp}
            </time>
          </div>
        </li>
      );
    });
    return (
      <ul className="issues-list">
        {listItems}
      </ul>
    );
  }
});
module.exports = IssuesList;
