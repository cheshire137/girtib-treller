'use strict';
var moment = require('moment'),
    React = require('react'),
    Github = require('./github'),
    IssueGroup = require('./issueGroup');
var IssuesList = React.createClass({
  getInitialState: function() {
    return {issues: []};
  },
  filterIssues: function(allIssues, year, month, sinceDate) {
    var lastDayStr = moment(this.props.monthStr + '-01', 'YYYY-MM-DD').
        endOf('month').format('D');
    var lastDay = parseInt(lastDayStr, 10);
    var untilDate = new Date(year, month - 1, lastDay);
    var issues = [];
    allIssues.forEach(function(issue) {
      var closedDate = moment(issue.closed_at).toDate();
      if (closedDate <= untilDate && closedDate >= sinceDate) {
        issues.push(issue);
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
             this.filterIssues(issues, year, month, sinceDate);
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
    return <IssueGroup repos={this.props.repos} issues={this.state.issues} monthStr={this.props.monthStr} />;
  }
});
module.exports = IssuesList;
