'use strict';
var React = require('react'),
    moment = require('moment'),
    CommitListItem = require('./commitListItem');
var CommitsByWeek = React.createClass({
  getInitialState: function() {
    return {expanded: false};
  },
  toggleExpanded: function(event) {
    event.preventDefault();
    this.setState({expanded: !this.state.expanded});
  },
  render: function() {
    var commitListItems = this.props.commits.map(function(commit) {
      var key = 'commit-' + commit.sha;
      return <CommitListItem key={key} commit={commit} />;
    });
    var commitCount = this.props.commits.length;
    var commitsLabel = 'commit';
    if (commitCount !== 1) {
      commitsLabel += 's';
    }
    var listStyle = {display: this.state.expanded ? 'block' : 'none'};
    var expandIcon = this.state.expanded ? (
      <span className="mdi-hardware-keyboard-arrow-down"></span>
    ) : (
      <span className="mdi-hardware-keyboard-arrow-right"></span>
    );
    return (
      <li className="commits-by-week-list-item">
        <span className="week">
          <a className="toggle-list-visibility" href="#" onClick={this.toggleExpanded}>
            {expandIcon}
            {this.props.week}
          </a>
          <span className="badge">
            {commitCount} {commitsLabel}
          </span>
        </span>
        <ul className="commits-list" style={listStyle}>
          {commitListItems}
        </ul>
      </li>
    );
  }
});
module.exports = CommitsByWeek;
