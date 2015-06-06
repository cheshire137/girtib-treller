'use strict';
var React = require('react'),
    moment = require('moment');
var CommitListItem = React.createClass({
  render: function() {
    var date = this.props.commit.commit.author.date;
    var timestamp = moment(date).format('ddd D MMM');
    return (
      <li className="commit-list-item">
        <span className="octicon octicon-git-commit"></span>
        <a href={this.props.commit.html_url} target="_blank" className="commit-link">
          {this.props.commit.commit.message}
        </a>
        <time>{timestamp}</time>
      </li>
    );
  }
});
module.exports = CommitListItem;
