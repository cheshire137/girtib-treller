'use strict';
var moment = require('moment'),
    React = require('react'),
    Github = require('./github'),
    CommitGroup = require('./commitGroup');
var CommitsList = React.createClass({
  getInitialState: function() {
    return {commits: []};
  },
  fetchCommits: function() {
    if (!this.props.user || !this.props.monthStr || this.props.repos.length < 1) {
      return;
    }
    var bits = this.props.monthStr.split('-');
    var year = parseInt(bits[0], 10);
    var month = parseInt(bits[1], 10);
    var lastDayStr = moment(this.props.monthStr + '-01', 'YYYY-MM-DD').
        endOf('month').format('D');
    var lastDay = parseInt(lastDayStr, 10);
    var author = this.props.user.login;
    var sinceDate = new Date(year, month - 1, 1);
    var untilDate = new Date(year, month - 1, lastDay);
    console.log('fetching commits for', this.props.repos.length, 'repos', author,
                this.props.monthStr);
    Github.getCommitsFromRepos(this.props.repos, author, sinceDate, untilDate).
           then(function(commits) {
             console.log(commits.length, 'commits');
             this.setState({commits: commits});
           }.bind(this), function() {
             console.error('failed to fetch commits');
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
    return prevMonthStr === this.props.monthStr;
  },
  componentDidUpdate: function(prevProps, prevState) {
    var sameUser = this.isSameUser(prevProps.user);
    var sameRepos = this.areSameRepos(prevProps.repos);
    var sameMonth = this.isSameMonth(prevProps.monthStr);
    if (sameUser && sameRepos && sameMonth) {
      return;
    }
    this.fetchCommits();
  },
  componentWillMount: function() {
    this.fetchCommits();
  },
  render: function() {
    return <CommitGroup repos={this.props.repos} commits={this.state.commits} monthStr={this.props.monthStr} />;
  }
});
module.exports = CommitsList;
