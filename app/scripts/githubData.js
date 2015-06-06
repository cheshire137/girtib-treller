'use strict';
var ReposList = require('./reposList'),
    UserDetails = require('./userDetails'),
    moment = require('moment'),
    CommitsList = require('./commitsList'),
    React = require('react');
var GithubData = React.createClass({
  getInitialState: function() {
    var curDate = new Date();
    var curMonth = curDate.getMonth();
    if (curDate.getDate() >= 15) {
      curMonth = curDate.getMonth() + 1;
    }
    if (curMonth < 10) {
      curMonth = '0' + curMonth;
    }
    var curYear = curDate.getFullYear();
    return {monthStr: curYear + '-' + curMonth, selectedRepos: [], user: {},
            showWhat: 'commits'};
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
  onUserFetch: function(user) {
    this.setState({user: user});
  },
  onReposChange: function(selectedRepos) {
    console.log(selectedRepos.length, 'repos selected');
    this.setState({selectedRepos: selectedRepos});
  },
  onShowChoiceChange: function(event) {
    this.setState({showWhat: event.target.value});
  },
  handleMonthChange: function(event) {
    this.setState({monthStr: event.target.value});
  },
  render: function() {
    var listing;
    if (this.state.showWhat === 'commits') {
      listing = <CommitsList monthStr={this.state.monthStr} user={this.state.user} repos={this.state.selectedRepos} />;
    } else {
      listing = '';
    }
    var monthOptions = this.getMonthOptions();
    return (
      <div className="github-data">
        <nav className="blue darken-4">
          <div className="nav-wrapper">
            <a href="/#/" className="brand-logo center blue-text text-lighten-5">
              Girtib Treller
            </a>
            <UserDetails onUserFetch={this.onUserFetch} />
          </div>
        </nav>
        <div className="container">
          <div className="row">
            <div className="col s5 l4">
              <h2 className="repos-header">
                Repositories
                <span className="badge">
                  {this.state.selectedRepos.length} selected
                </span>
              </h2>
              <ReposList onReposChange={this.onReposChange} />
            </div>
            <div className="col s7 l8">
              <div className="show-what-choice">
                <input type="radio" value="commits" name="showWhat" id="commits-choice" checked={this.state.showWhat === 'commits'} onChange={this.onShowChoiceChange} />
                <label className="commits-choice-label" htmlFor="commits-choice">Commits</label>
                <input type="radio" value="issues" name="showWhat" id="issues-choice" checked={this.state.showWhat === 'issues'} onChange={this.onShowChoiceChange} />
                <label htmlFor="issues-choice">Issues</label>
              </div>
              <select value={this.state.monthStr} onChange={this.handleMonthChange} className="browser-default" id="month-select">
                <option value="" selected="selected">Choose a month</option>
                {monthOptions}
              </select>
              <h2 className="commits-header">
                Your {this.state.showWhat}
              </h2>
              {listing}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = GithubData;
