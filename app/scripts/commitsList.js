'use strict';
var moment = require('moment'),
    React = require('react'),
    Github = require('./github');
var CommitsList = React.createClass({
  getInitialState: function() {
    return {monthStr: '', commits: []};
  },
  getMonthOptions: function() {
    var monthsToShow = 3;
    var options = [];
    var curDay = new Date().getDay();
    var monthIndex;
    if (curDay >= 15) {
      monthIndex = 0;
    } else {
      monthIndex = 1;
    }
    for (var i=0; i<=3; i++) {
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
      console.log('not yet ready to fetch commits');
      return '--';
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
             console.log(commits[0]);
             this.setState({commits: commits});
           }.bind(this), function() {
             console.error('failed to fetch all commits');
           });
  },
  isSameUser: function(prevUser) {
    console.log(prevUser.login, 'vs', this.props.user.login);
    if (prevUser.login === this.props.user.login) {
      return true;
    }
    return false;
  },
  areSameRepos: function(prevRepos) {
    var repoFullNameMapper = function(repo) { return repo.full_name; };
    var prevRepoFullNames = prevRepos.map(repoFullNameMapper);
    var curRepoFullNames = this.props.repos.map(repoFullNameMapper);
    console.log(prevRepoFullNames, 'vs', curRepoFullNames);
    return $(prevRepoFullNames).not(curRepoFullNames).length === 0 &&
           $(curRepoFullNames).not(prevRepoFullNames).length === 0;
  },
  isSameMonth: function(prevMonthStr) {
    return prevMonthStr === this.state.monthStr;
  },
  componentDidUpdate: function(prevProps, prevState) {
    console.log('componentDidUpdate');
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
    console.log('commits', this.state.commits);
    var commitListItems = this.state.commits.map(function(commit) {
      return (
        <li className="commit-list-item">
          <span className="commit-repo">{commit.full_name}</span> /
          <a href={commit.html_url} target="_blank" className="commit-link">
            {commit.commit.message}
          </a>
        </li>
      );
    });
    return (
      <div>
        <label htmlFor="month-select">Month:</label>
        <select value={this.state.monthStr} onChange={this.handleChange} className="browser-default" id="month-select">
          <option value="" selected="selected">Choose a month</option>
          {monthOptions}
        </select>
        <ul className="commits-list">{commitListItems}</ul>
      </div>
    );
  }
});
module.exports = CommitsList;
