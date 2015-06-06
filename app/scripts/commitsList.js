'use strict';
var moment = require('moment'),
    React = require('react'),
    Github = require('./github'),
    CommitGroup = require('./commitGroup');
var CommitsList = React.createClass({
  getInitialState: function() {
    var curDate = new Date();
    var curMonth = curDate.getMonth() + 1;
    if (curMonth < 10) {
      curMonth = '0' + curMonth;
    }
    var curYear = curDate.getFullYear();
    return {monthStr: curYear + '-' + curMonth, commits: []};
  },
  getMonthOptions: function() {
    var monthsToShow = 24;
    var options = [];
    var curDay = new Date().getDay();
    var monthIndex;
    if (curDay >= 15) {
      monthIndex = 0;
    } else {
      monthIndex = 1;
    }
    for (var i=0; i<=monthsToShow; i++) {
      var date = moment().subtract(i, 'months');
      var label = date.format('MMMM YYYY');
      var value = date.format('YYYY-MM');
      var option = (
        <option value={value}>{label}</option>
      );
      options.push(option);
    }
    return options;
  },
  handleChange: function(event) {
    var monthStr = event.target.value;
    this.setState({monthStr: monthStr});
  },
  fetchCommits: function() {
    if (!this.props.user || !this.state.monthStr || this.props.repos.length < 1) {
      return;
    }
    var bits = this.state.monthStr.split('-');
    var year = parseInt(bits[0], 10);
    var month = parseInt(bits[1], 10);
    var lastDayStr = moment(this.state.monthStr + '-01').endOf('month').format('D');
    var lastDay = parseInt(lastDayStr, 10);
    var author = this.props.user.login;
    var sinceDate = new Date(year, month - 1, 1);
    var untilDate = new Date(year, month - 1, lastDay);
    console.log('fetching commits for ', this.props.repos.length, 'repos', author,
                sinceDate, untilDate);
    Github.getCommitsFromRepos(this.props.repos, author, sinceDate, untilDate).
           then(function(commits) {
             console.log(commits.length, 'commits');
             this.setState({commits: commits});
           }.bind(this), function() {
             console.error('failed to fetch all commits');
           });
  },
  isSameUser: function(prevUser) {
    if (prevUser.login === this.props.user.login) {
      return true;
    }
    return false;
  },
  areSameRepos: function(prevRepos) {
    var repoFullNameMapper = function(repo) { return repo.full_name; };
    var prevRepoFullNames = prevRepos.map(repoFullNameMapper);
    var curRepoFullNames = this.props.repos.map(repoFullNameMapper);
    return $(prevRepoFullNames).not(curRepoFullNames).length === 0 &&
           $(curRepoFullNames).not(prevRepoFullNames).length === 0;
  },
  isSameMonth: function(prevMonthStr) {
    return prevMonthStr === this.state.monthStr;
  },
  componentDidUpdate: function(prevProps, prevState) {
    var sameUser = this.isSameUser(prevProps.user);
    var sameRepos = this.areSameRepos(prevProps.repos);
    var sameMonth = this.isSameMonth(prevState.monthStr);
    if (sameUser && sameRepos && sameMonth) {
      console.log('data unchanged, not fetching commits');
      return;
    }
    this.fetchCommits();
  },
  render: function() {
    var monthOptions = this.getMonthOptions();
    return (
      <div>
        <label htmlFor="month-select">Month:</label>
        <select value={this.state.monthStr} onChange={this.handleChange} className="browser-default" id="month-select">
          <option value="" selected="selected">Choose a month</option>
          {monthOptions}
        </select>
        <CommitGroup repos={this.props.repos} commits={this.state.commits} monthStr={this.state.monthStr} />
      </div>
    );
  }
});
module.exports = CommitsList;
