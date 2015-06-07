'use strict';
var React = require('react'),
    moment = require('moment'),
    IssuesByRepo = require('./issuesByRepo');
var IssueGroup = React.createClass({
  render: function() {
    if (this.props.issues.length < 1 && this.props.monthStr !== '' &&
        this.props.repos.length > 0) {
      var monthLabel = moment(this.props.monthStr + '-01').format('MMMM YYYY');
      return (
        <p>You closed no issues or pull requests on the selected repositories
        in {monthLabel}.</p>
      );
    }
    if (this.props.monthStr === '' || this.props.repos.length < 1) {
      return (
        <p>Choose a month and select some repositories to see closed issues and
        pull requests.</p>
      );
    }
    var issuesByRepo = {};
    var repoFullNames = $.unique(this.props.issues.map(function(issue) {
      var fullName = issue.html_url.split('https://github.com/')[1].
                                    split('/issues')[0].split('/pull')[0];
      console.log('issue repo', fullName);
      if (typeof issuesByRepo[fullName] === 'undefined') {
        issuesByRepo[fullName] = [];
      }
      issuesByRepo[fullName].push(issue);
      return fullName;
    }));
    repoFullNames.sort(function(a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    var issueListItemsByRepo = repoFullNames.map(function(repoFullName) {
      var key = 'issue-repo-' + repoFullName;
      return <IssuesByRepo key={key} fullName={repoFullName} issues={issuesByRepo[repoFullName]} />;
    });
    return (
      <ul className="issues-by-repo-list">
        {issueListItemsByRepo}
      </ul>
    );
  }
});
module.exports = IssueGroup;
