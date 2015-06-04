'use strict';
var moment = require('moment'),
    React = require('react'),
    Github = require('./github');
var CommitsList = React.createClass({
  getInitialState: function() {
    return {monthStr: ''};
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
           }, function() {
             console.error('failed to fetch all commits');
           });
  },
  render: function() {
    var monthOptions = this.getMonthOptions();
    var commits = this.fetchCommits();
    return (
      <div>
        <label htmlFor="month-select">Month:</label>
        <select value={this.state.monthStr} onChange={this.handleChange} className="browser-default" id="month-select">
          <option value="" selected="selected">Choose a month</option>
          {monthOptions}
        </select>
        {commits}
      </div>
    );
  }
});
module.exports = CommitsList;
