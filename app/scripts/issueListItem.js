'use strict';
var React = require('react'),
    moment = require('moment'),
    LabelListItem = require('./labelListItem');
var IssueListItem = React.createClass({
  render: function() {
    var icon = this.props.issue.pull_request ? (
      <span className="octicon octicon-git-pull-request"></span>
    ) : (
      <span className="octicon octicon-issue-closed"></span>
    );
    var date = this.props.issue.closed_at;
    var timestamp = moment(date).format('ddd D MMM');
    var labelListItems = this.props.issue.labels.map(function(label) {
      var key = 'label-' + this.props.issue.id + '-' + label.name;
      return <LabelListItem key={key} label={label} />
    }.bind(this));
    var labelsListStyle = {
      display: labelListItems.length > 0 ? 'inline-block' : 'none'
    };
    return (
      <li className="issue-list-item">
        {icon}
        <a className="issue-link" href={this.props.issue.html_url}>
          <span className="issue-number">#{this.props.issue.number}</span>
          <span className="issue-title">{this.props.issue.title}</span>
        </a>
        <div className="issue-metadata">
          <a className="issue-user-link" href={this.props.issue.user.html_url}>
            <img src={this.props.issue.user.avatar_url} alt={this.props.issue.user.login} className="issue-user-avatar" />
            <span className="issue-user-name">{this.props.issue.user.login}</span>
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
  }
});
module.exports = IssueListItem;
