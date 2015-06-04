'use strict';
var RepoListItem = require('./repoListItem'),
    React = require('react');
var RepoGroup = React.createClass({
  getInitialState: function() {
    return {checked: false};
  },
  handleChange: function(event) {
    this.setState({checked: !this.state.checked});
  },
  render: function() {
    var listItems = [];
    for (var i=0; i<this.props.repos.length; i++) {
      var repo = this.props.repos[i];
      var key = this.props.index + '-' + i;
      var listItem = <RepoListItem key={key} index={i} orgIndex={this.props.index} repo={repo} checked={this.state.checked} />;
      listItems.push(listItem)
    }
    var checkboxId = 'org-' + this.props.index;
    return (
      <li className="org-list-item">
        <input type="checkbox" checked={this.state.checked} className="filled-in" id={checkboxId} onChange={this.handleChange} />
        <label htmlFor={checkboxId} className="org-name">
          {this.props.orgName}
        </label>
        <ul className="org-repos-list">{listItems}</ul>
      </li>
    );
  }
});
module.exports = RepoGroup;
