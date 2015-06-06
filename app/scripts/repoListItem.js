'use strict';
var React = require('react');
var RepoListItem = React.createClass({
  getInitialState: function() {
    return {checked: false};
  },
  handleChange: function(event) {
    this.setState({checked: !this.state.checked});
    if (this.state.checked) {
      this.props.onDeselected(this.props.repo);
    } else {
      this.props.onSelected(this.props.repo);
    }
  },
  render: function() {
    var icon = this.props.repo.private ? (
      <span data-tooltip="Private" data-position="right" className="tooltipped private-indicator mdi-action-lock"></span>
    ) : '';
    var checkboxId = 'repo-' + this.props.orgIndex + '-' + this.props.index;
    var labelClass = 'repo-name ';
    if (this.state.checked) {
      labelClass += 'checked';
    } else {
      labelClass += 'unchecked';
    }
    var url = 'https://github.com/' + this.props.repo.full_name;
    var orgAndName = this.props.repo.full_name.split('/');
    var name = orgAndName[1];
    return (
      <li className="repo-list-item">
        <input type="checkbox" checked={this.state.checked} id={checkboxId} onChange={this.handleChange} />
        <label className={labelClass} htmlFor={checkboxId}>
          <span className="octicon octicon-repo"></span>
          {name}
        </label>
        {icon}
        <a className="repo-link" href={url} target="_blank">
          <i className="mdi-action-open-in-new"></i>
        </a>
      </li>
    );
  }
});
module.exports = RepoListItem;
